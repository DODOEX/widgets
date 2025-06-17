import { Box, ButtonBase, RotatingIcon, useTheme } from '@dodoex/components';
import { Switch, Warn } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useCallback, useEffect, useState } from 'react';
import { RoutePriceStatus } from '../../../hooks/Swap';
import { TokenInfo } from '../../../hooks/Token';
import { formatReadableNumber } from '../../../utils/formatter';
import { RouteVisionModal } from './RouteVisionModal';

export function TokenPairPriceWithToggle({
  toToken,
  fromToken,
  priceStatus,
  pricePerToToken,
  pricePerFromToken,
  routeInfo,
}: {
  toToken: TokenInfo | null;
  fromToken: TokenInfo | null;
  priceStatus: RoutePriceStatus;
  pricePerToToken: number | null;
  pricePerFromToken: number | null;
  routeInfo: string | null;
}) {
  const theme = useTheme();

  const [leftSymbol, setLeftSymbol] = useState<string | undefined>('-');
  const [leftAmount, setLeftAmount] = useState<number | null>(null);
  const [rightSymbol, setRightSymbol] = useState<string | undefined>('-');
  const [rightAmount, setRightAmount] = useState<number | null>(null);

  useEffect(() => {
    setLeftSymbol(fromToken?.symbol);
    setRightSymbol(toToken?.symbol);
    setLeftAmount(pricePerToToken);
    setRightAmount(pricePerFromToken);
  }, [fromToken, toToken, pricePerToToken, pricePerFromToken]);

  const handleSwitch = useCallback(() => {
    setLeftSymbol(rightSymbol);
    setRightSymbol(leftSymbol);
    setLeftAmount(rightAmount);
    setRightAmount(leftAmount);
  }, [leftSymbol, leftAmount, rightSymbol, rightAmount]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {
        {
          [RoutePriceStatus.Initial]: '-',
          [RoutePriceStatus.Loading]: (
            <>
              <RotatingIcon sx={{ mr: 5 }} />
              <Trans>Fetching best price...</Trans>
            </>
          ),
          [RoutePriceStatus.Failed]: (
            <>
              <Box
                component={Warn}
                sx={{ width: 15, mr: 5, color: 'warning.main' }}
              />
              <Trans>Quote not available</Trans>
            </>
          ),
          [RoutePriceStatus.Success]: (
            <Box
              sx={{
                width: '100%',
                mt: 16,
                px: 11,
                py: 7,
                borderRadius: 12,
                border: `solid 1px ${theme.palette.border.main}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    lineHeight: '18px',
                    color: theme.palette.text.primary,
                  }}
                >
                  1&nbsp;{leftSymbol}&nbsp;
                  <span style={{ color: theme.palette.text.secondary }}>=</span>
                  &nbsp;$
                  {formatReadableNumber({
                    input: rightAmount as number,
                    showDecimals: 4,
                  })}
                  &nbsp;{rightSymbol}
                </Box>

                <Box
                  component={ButtonBase}
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: 'border.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      color: 'text.secondary',
                    }}
                    onClick={handleSwitch}
                    component={Switch}
                  />
                </Box>
              </Box>

              {fromToken && toToken && (
                <RouteVisionModal
                  routeInfo={routeInfo}
                  fromToken={fromToken}
                  toToken={toToken}
                />
              )}
            </Box>
          ),
        }[priceStatus]
      }
    </Box>
  );
}
