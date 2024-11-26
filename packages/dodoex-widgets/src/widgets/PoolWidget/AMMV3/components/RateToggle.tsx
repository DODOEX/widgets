import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { StateProps } from '../reducer';

export interface RateToggleProps {
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  handleRateToggle: () => void;
}

export const RateToggle = ({
  baseToken,
  quoteToken,
  handleRateToggle,
}: RateToggleProps) => {
  const theme = useTheme();

  const tokenA = baseToken?.wrapped;
  const tokenB = quoteToken?.wrapped;

  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB);

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
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
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
            ...(isSorted
              ? {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.paper,
                }
              : {
                  color: theme.palette.text.secondary,
                  backgroundColor: 'transparent',
                }),
          }}
        >
          {isSorted ? baseToken.symbol : quoteToken?.symbol}
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
            ...(!isSorted
              ? {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.paper,
                }
              : {
                  color: theme.palette.text.secondary,
                  backgroundColor: 'transparent',
                }),
          }}
        >
          {isSorted ? quoteToken.symbol : baseToken?.symbol}
        </Box>
      </Box>
    </Box>
  );
};
