import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import {
  PriceRangeRatioSelectProps,
  usePriceRangeRatioSelect,
} from '../hooks/usePriceRangeRatioSelect';

export default function RangeRatioSelect({
  totalApr,
  currentPrice,
  tickSpacing,
  priceLower,
  priceUpper,
  token0,
  token1,
  tickSpaceLimits,
  onLeftRangeInput,
  onRightRangeInput,
  handleSetFullRange,
}: PriceRangeRatioSelectProps) {
  const { options } = usePriceRangeRatioSelect({
    totalApr,
    currentPrice,
    tickSpacing,
    priceLower,
    priceUpper,
    token0,
    token1,
    tickSpaceLimits,
    onLeftRangeInput,
    onRightRangeInput,
    handleSetFullRange,
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        fontWeight: 600,
      }}
    >
      {options.map((item) => {
        const { active, borderRadius, type, ratio, apr } = item;
        return (
          <Box
            key={ratio + type}
            sx={{
              p: 12,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: active ? 'text.primary' : 'border.main',
              borderRadius,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.7,
              },
              ...(active
                ? {
                    backgroundColor: 'background.paperDarkContrast',
                  }
                : {
                    '&:nth-of-type(odd)': {
                      borderRightWidth: 0,
                    },
                    '&:not(:nth-of-type(-n + 2))': {
                      borderTopWidth: 0,
                    },
                  }),
            }}
            onClick={item.onClick}
            role="button"
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {type}
              <Box
                sx={{
                  typography: 'h6',
                  color: 'text.secondary',
                }}
              >
                {ratio}
              </Box>
            </Box>
            <Box
              sx={{
                mt: 8,
                typography: 'h6',
              }}
            >
              <Trans>APR</Trans>
              {' ' + apr}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
