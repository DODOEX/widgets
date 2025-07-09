import { Box, useTheme } from '@dodoex/components';

export function OperateButtonContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 20,
        py: 16,
        boxShadow: '0px -1px 0px 0px rgba(55, 55, 57, 0.10)',
        backgroundColor: 'background.paper',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        [theme.breakpoints.up('tablet')]: {
          position: 'static',
        },
      }}
    >
      {children}
    </Box>
  );
}
