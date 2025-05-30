import { Box, useTheme } from '@dodoex/components';
import { SectionStatusT } from '../types';

export function SectionTitle({
  index,
  title,
  status,
}: {
  index: number;
  title: string;
  status: SectionStatusT;
}) {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          mt: 28,
          mb: 28,
          borderTopColor: 'divider',
          borderTopStyle: 'solid',
          borderTopWidth: 1,
          [theme.breakpoints.down('tablet')]: {
            mt: 12,
            mb: 12,
            display: index === 1 ? 'none' : 'block',
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 20,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '20px',
            height: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
            borderRadius: '50%',
            backgroundColor:
              status === 'waiting'
                ? theme.palette.background.paperDarkContrast
                : theme.palette.secondary.main,
            typography: 'h6',
            fontWeight: 600,
            textAlign: 'center',
            color:
              status === 'waiting'
                ? theme.palette.text.disabled
                : theme.palette.mode === 'light'
                ? theme.palette.text.primary
                : theme.palette.primary.contrastText,
          }}
        >
          {status === 'completed' ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7596 3.55566L5.92549 10.3897L3.23957 7.71418L1.77734 9.17641L5.92549 13.3246L14.2218 5.02826L12.7596 3.55566Z"
                  fill="currentColor"
                />
              </svg>
            </>
          ) : (
            index
          )}
        </Box>

        <Box
          sx={{
            ml: 8,
            typography: 'body1',
            fontWeight: 600,
            color:
              status === 'waiting'
                ? theme.palette.text.disabled
                : theme.palette.text.primary,
          }}
        >
          {title}
        </Box>
      </Box>
    </>
  );
}
