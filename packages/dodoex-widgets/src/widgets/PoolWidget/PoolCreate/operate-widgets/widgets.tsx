import { Box, BoxProps, useTheme } from '@dodoex/components';

export interface SettingItemWrapperProps {
  title: React.ReactNode;
  children: React.ReactNode;
  sx?: BoxProps['sx'];
}

export const SettingItemWrapper = ({
  title,
  children,
  sx,
}: SettingItemWrapperProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mx: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 12,
        ...sx,
      }}
    >
      <Box
        sx={{
          typography: 'body2',
          color: theme.palette.text.primary,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {title}
      </Box>

      {children}
    </Box>
  );
};
