import { Box, useTheme } from '@dodoex/components';

export function DirectionLine({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: 'calc(100% - 32px)',
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          borderTopColor: theme.palette.text.primary,
          borderTopWidth: 1,
          borderTopStyle: 'dashed',
          '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: -0.5,
            backgroundColor: theme.palette.text.primary,
            width: 6,
            height: 6,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          },
          '&:after': {
            display: {
              tablet: 'block',
            },
            content: '""',
            position: 'absolute',
            right: -1,
            top: -0.5,
            width: 0,
            height: 0,
            transform: 'translate(0, -50%)',
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: `6px solid ${theme.palette.text.primary}`,
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
