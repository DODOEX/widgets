import { Box, useTheme } from '@dodoex/components';
import { usePoolColors } from '../hooks/usePoolColors';
import { PoolTypeE } from '../types';
import { formatFee } from '../utils';

export interface PoolTypeTagProps {
  type: PoolTypeE;
  stable: boolean;
  fee: number;
}

export const PoolTypeTag = (props: PoolTypeTagProps) => {
  const { type, stable, fee } = props;
  const theme = useTheme();

  const { color, backgroundColor, name } = usePoolColors({ type, stable, fee });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Box
        sx={{
          borderRadius: 4,
          backgroundColor,
          color,
          px: 8,
          py: 2,
          typography: 'h6',
          lineHeight: '16px',
          fontWeight: 500,
        }}
      >
        {name}
      </Box>
      <Box
        sx={{
          borderRadius: 4,
          backgroundColor: theme.palette.background.paperDarkContrast,
          color: theme.palette.text.secondary,
          px: 8,
          py: 2,
          typography: 'h6',
          lineHeight: '16px',
          fontWeight: 500,
        }}
      >
        {formatFee({ type, fee })}
      </Box>
    </Box>
  );
};
