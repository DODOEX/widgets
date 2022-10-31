import { useTheme } from '@mui/system';
import { Box, BoxProps } from '../Box';
import { Loading } from '@dodoex-io/icons';

export interface RotatingIconProps {
  sx?: BoxProps['sx'];
}
export const RotatingIcon = ({ sx }: RotatingIconProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 20,
        color: theme.palette.primary.main,
        animation: 'spin 3s linear infinite',
        '@keyframes spin': {
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        ...sx,
      }}
      component={Loading}
    />
  );
};
