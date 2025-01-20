import { Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import { TokenInfo } from '../../../../hooks/Token';

export interface RateToggleProps {
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  handleRateToggle: () => void;
  sx?: BoxProps['sx'];
}

export const RateToggle = ({
  token0,
  token1,
  handleRateToggle,
  sx,
}: RateToggleProps) => {
  const theme = useTheme();

  return (
    <Box
      component={ButtonBase}
      onClick={handleRateToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        borderRadius: 8,
        backgroundColor: theme.palette.border.main,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          [theme.breakpoints.up('tablet')]: {
            width: 'auto',
          },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: '50%',
            px: 12,
            py: 4,
            borderRadius: 7,
            textAlign: 'center',
            typography: 'h6',
            whiteSpace: 'nowrap',
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {token0?.symbol}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: '50%',
            px: 12,
            py: 4,
            borderRadius: 7,
            textAlign: 'center',
            typography: 'h6',
            whiteSpace: 'nowrap',
            color: theme.palette.text.secondary,
            backgroundColor: 'transparent',
          }}
        >
          {token1?.symbol}
        </Box>
      </Box>
    </Box>
  );
};
