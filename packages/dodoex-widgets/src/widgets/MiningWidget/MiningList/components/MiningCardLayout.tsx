import { Box, useTheme } from '@dodoex/components';

export function MiningCardLayout({
  headerLeft,
  headerRight,
  children,
  center,
  footer,
  onClick,
}: {
  headerLeft: React.ReactNode;
  headerRight: React.ReactNode;
  children: React.ReactNode;
  center?: React.ReactNode;
  footer: React.ReactNode;
  onClick?: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 16,
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 12,
        paddingLeft: 20,
        [theme.breakpoints.up('tablet')]: {
          minWidth: 350,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {headerLeft}
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            cursor: onClick ? 'pointer' : 'default',
            alignSelf: 'stretch',
          }}
          onClick={onClick}
        />
        {headerRight}
      </Box>
      <Box
        sx={{
          pt: 40,
          display: 'flex',
          alignItems: 'center',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        {children}
      </Box>
      {center && (
        <Box
          sx={{
            pt: 20,
            cursor: onClick ? 'pointer' : 'default',
          }}
          onClick={onClick}
        >
          {center}
        </Box>
      )}

      <Box
        sx={{
          mt: 20,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {footer}
      </Box>
    </Box>
  );
}
