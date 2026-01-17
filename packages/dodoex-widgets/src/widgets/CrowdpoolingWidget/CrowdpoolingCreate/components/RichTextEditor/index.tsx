import { Box, Button, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { compressImage } from '../../utils/imageCompression';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const quill = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        // toolbar: toolbarRef.current,
        toolbar: [
          [{ header: 2 }, 'blockquote'],
          ['bold', 'link', 'image'],
        ],
        history: {
          delay: 2000,
          maxStack: 500,
          userOnly: true,
        },
      },
      bounds: containerRef.current,
    });

    quillRef.current = quill;

    const toolbar = quill.getModule('toolbar') as {
      addHandler: (name: string, handler: () => void) => void;
    };
    toolbar.addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        try {
          const compressedFile = await compressImage(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', e.target?.result);
          };
          reader.readAsDataURL(compressedFile);
        } catch (err) {
          console.error('Failed to compress image:', err);
        }
      };
    });

    // Set initial content
    if (value) {
      try {
        const delta = JSON.parse(value);
        quill.setContents(delta);
      } catch {
        quill.setText(value);
      }
    }

    // Handle content changes
    quill.on('text-change', () => {
      onChange(quill.getSemanticHTML());
    });

    setIsInitialized(true);

    return () => {
      quillRef.current = null;
    };
  }, []);

  // Update value prop changes
  useEffect(() => {
    if (quillRef.current && value && isInitialized) {
      const currentText = quillRef.current.getSemanticHTML();
      if (currentText !== value) {
        quillRef.current.setText(value);
      }
    }
  }, [value, isInitialized]);

  return (
    <Box
      sx={{
        borderRadius: '16px',
        backgroundColor: 'background.paperContrast',
        border: 'solid 1px',
        borderColor: 'border.main',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Editor */}
      <Box
        sx={{
          minHeight: '400px',
          '&&& .ql-toolbar': {
            border: 'none',
            backgroundColor: 'background.input',
            '& .ql-formats': {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            },
            '& button': {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              width: 32,
              height: 32,
              borderRadius: 8,
              '& > svg': {
                width: 20,
                height: 20,
              },
              '&.ql-active, &:hover': {
                color: 'text.primary',
                backgroundColor: theme.palette.background.paperDarkContrast,
              },
            },
          },
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            '&&&': {
              border: 'none',
            },
            '& .ql-editor': {
              minHeight: '400px',
              fontFamily: 'inherit',
              border: 'none',
              padding: '24px 20px',
            },
            '& .ql-container': {
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit',
            },
            '& .ql-editor.ql-blank::before': {
              color: 'text.disabled',
              fontStyle: 'normal',
              left: 24,
              top: 20,
            },
            typography: 'body2',
            '& h2': {
              typography: 'body1',
              fontWeight: 600,
            },
          }}
        />
      </Box>
    </Box>
  );
}
