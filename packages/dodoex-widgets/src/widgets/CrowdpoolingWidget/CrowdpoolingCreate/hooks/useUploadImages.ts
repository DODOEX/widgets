import { useMutation } from '@tanstack/react-query';
import { APIServiceKey } from '../../../../constants/api';
import { useGetAPIService } from '../../../../hooks/setting/useGetAPIService';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import axios from 'axios';
import { useMessageState } from '../../../../hooks/useMessageState';

const MAX_BATCH_SIZE = 3 * 1024 * 1024;

function splitFilesIntoBatches(files: File[]): File[][] {
  const batches: File[][] = [];
  let currentBatch: File[] = [];
  let currentBatchSize = 0;

  for (const file of files) {
    const fileSize = file.size;

    if (
      currentBatchSize + fileSize > MAX_BATCH_SIZE &&
      currentBatch.length > 0
    ) {
      batches.push(currentBatch);
      currentBatch = [];
      currentBatchSize = 0;
    }

    currentBatch.push(file);
    currentBatchSize += fileSize;
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}

async function uploadBatch(
  uploadImagesAPI: string,
  files: File[],
  crowdpoolingAddress: string,
  chainId: string | undefined,
  header: object,
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('crowdpoolingAddress', crowdpoolingAddress);
  formData.append('chainId', chainId?.toString() || '');

  const response = await axios.post(uploadImagesAPI, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...header,
    },
  });

  if (response.data?.code !== 0) {
    const message = response.data?.msg || 'Upload failed';
    throw new Error(message);
  }

  return response.data?.data?.files || [];
}

export function useUploadImages() {
  const uploadImagesAPI = useGetAPIService(APIServiceKey.cpUploadImages);
  const { chainId } = useWalletInfo();

  return useMutation({
    mutationFn: async ({
      header,
      files,
      crowdpoolingAddress,
    }: {
      header: object;
      files: File[];
      crowdpoolingAddress: string;
    }) => {
      try {
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);

        if (totalSize <= MAX_BATCH_SIZE) {
          return await uploadBatch(
            uploadImagesAPI,
            files,
            crowdpoolingAddress,
            String(chainId),
            header,
          );
        }

        const batches = splitFilesIntoBatches(files);
        const allUrls: string[] = [];

        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i];
          const urls = await uploadBatch(
            uploadImagesAPI,
            batch,
            crowdpoolingAddress,
            String(chainId),
            header,
          );
          allUrls.push(...urls);
        }

        return allUrls;
      } catch (e: any) {
        const message = e.message || 'Upload failed';
        useMessageState.getState().toast({
          message,
          type: 'error',
        });
        throw message;
      }
    },
  });
}
