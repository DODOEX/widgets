import { Box, BoxProps, useTheme } from '@dodoex/components';

export function OperateButtonWrapper({ sx, ...props }: BoxProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        paddingTop: 20,
        backgroundColor: theme.palette.background.paper,
        position: 'sticky',
        bottom: 0,
        ...sx,
      }}
      {...props}
    />
  );
}
