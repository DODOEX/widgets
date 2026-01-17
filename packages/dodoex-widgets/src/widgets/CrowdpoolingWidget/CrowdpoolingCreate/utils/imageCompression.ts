export interface ImageCompressionOptions {
  quality?: number;
  maxSize?: number;
}

export interface CompressorOptions {
  quality?: number;
  success?: (result: File) => void;
  error?: (err: Error) => void;
}

interface Compressor {
  new (file: File, options: CompressorOptions): void;
}

const DEFAULT_OPTIONS = {
  quality: 0.5,
  maxSize: 2 * 1024 * 1024,
};

let compressorInstance: Compressor | null = null;
let compressorLoadPromise: Promise<Compressor | null> | null = null;
let useCanvasFallback = false;

async function loadCompressor(): Promise<Compressor | null> {
  if (compressorInstance) {
    return compressorInstance;
  }

  if (compressorLoadPromise) {
    return compressorLoadPromise;
  }

  if (useCanvasFallback) {
    return null;
  }

  compressorLoadPromise = (async () => {
    try {
      const module = await import('compressorjs');
      compressorInstance = module.default;
      return compressorInstance;
    } catch (err) {
      console.warn(
        'Failed to load compressorjs, falling back to Canvas API:',
        err,
      );
      useCanvasFallback = true;
      return null;
    }
  })();

  return compressorLoadPromise;
}

function calculateTargetQuality(
  file: File,
  options: typeof DEFAULT_OPTIONS,
): number {
  const { maxSize, quality } = options;

  if (file.size <= maxSize) {
    return quality;
  }

  const ratio = maxSize / file.size;
  return Math.min(quality, ratio);
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressImageUsingCanvas(
  file: File,
  quality: number,
): Promise<File> {
  const img = await loadImage(file);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to compress image'));
          return;
        }
        const compressedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      },
      file.type,
      quality,
    );
  });
}

async function compressImageUsingCompressor(
  file: File,
  quality: number,
): Promise<File> {
  const Compressor = await loadCompressor();

  if (!Compressor) {
    throw new Error('Compressor library not available');
  }

  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      success: (result: File) => {
        resolve(result);
      },
      error: (err: Error) => {
        reject(err);
      },
    });
  });
}

async function compressImageWithFallback(
  file: File,
  options: typeof DEFAULT_OPTIONS,
): Promise<File> {
  const Compressor = await loadCompressor();
  const targetQuality = calculateTargetQuality(file, options);
  let compressedFile = file;
  let currentQuality = targetQuality;

  while (currentQuality > 0.1) {
    try {
      if (Compressor) {
        compressedFile = await compressImageUsingCompressor(
          file,
          currentQuality,
        );
      } else {
        throw new Error('Compressor not available');
      }
    } catch (err) {
      console.warn('Compressor compression failed, using Canvas API:', err);
      compressedFile = await compressImageUsingCanvas(file, currentQuality);
    }

    if (compressedFile.size <= options.maxSize) {
      break;
    }

    currentQuality *= 0.8;
  }

  return compressedFile;
}

export async function compressImage(
  file: File,
  userOptions: ImageCompressionOptions = {},
): Promise<File> {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
    quality: userOptions.quality ?? DEFAULT_OPTIONS.quality,
    maxSize: userOptions.maxSize ?? DEFAULT_OPTIONS.maxSize,
  };

  return compressImageWithFallback(file, options);
}
