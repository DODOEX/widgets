import { Box, useTheme } from '@dodoex/components';
import { Loading } from '@dodoex/icons';

export interface LoadingRotationProps {}

export const LoadingRotation = (props: LoadingRotationProps) => {
  const theme = useTheme();

  return (
    <Box
      component={Loading}
      sx={{
        mr: 8,
        '& path': {
          fill: theme.palette.text.disabled,
        },
        animation: 'loadingRotate 1.1s infinite linear',
        '@keyframes loadingRotate': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(359deg)',
          },
        },
      }}
    />
  );
};
