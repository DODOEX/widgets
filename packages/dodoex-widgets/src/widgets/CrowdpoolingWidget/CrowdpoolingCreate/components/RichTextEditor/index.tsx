import { Box, Button, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useEffect, useRef } from 'react';
import type Quill from 'quill';
import { compressImage } from '../../utils/imageCompression';
import 'quill/dist/quill.snow.css';

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
  const theme = useTheme();

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    let cancelled = false;

    Promise.all([import('quill')]).then(([{ default: QuillClass }]) => {
      if (cancelled || !containerRef.current || quillRef.current) return;

      const quill = new QuillClass(containerRef.current, {
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
        isInternalUpdate.current = true;
        quill.clipboard.dangerouslyPasteHTML(value);
        isInternalUpdate.current = false;
      }

      // Handle content changes
      quill.on('text-change', () => {
        onChange(quill.getSemanticHTML());
      });
    });

    return () => {
      cancelled = true;
      quillRef.current = null;
    };
  }, []);

  return (
    <Box
      sx={{
        borderRadius: '16px',
        backgroundColor: 'background.input',
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
              '& h2': {
                typography: 'body1',
                fontWeight: 600,
              },
              '& h1, & h2, & h3, & h4, & h5, & h6, & img, & blockquote': {
                my: 12,
              },
              '& a': {
                color: 'text.primary',
                textDecoration: 'underline',
              },
              '& blockquote': {
                borderLeft: `4px solid ${theme.palette.border.main}`,
                ml: 0,
                pl: 16,
              },
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
          }}
        />
      </Box>
    </Box>
  );
}
