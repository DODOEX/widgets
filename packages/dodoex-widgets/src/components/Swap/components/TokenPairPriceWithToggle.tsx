import { Box, RotatingIcon, ButtonBase } from '@dodoex/components';
import { Switch } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useState, useEffect, useCallback } from 'react';
import { TokenInfo } from '../../../hooks/Token';
import { RoutePriceStatus } from '../../../hooks/Swap';
import { formatReadableNumber } from '../../../utils/formatter';
import { Warn } from '@dodoex/icons';

export function TokenPairPriceWithToggle({
  toToken,
  fromToken,
  priceStatus,
  pricePerToToken,
  pricePerFromToken,
}: {
  toToken: TokenInfo | null;
  fromToken: TokenInfo | null;
  priceStatus: RoutePriceStatus;
  pricePerToToken: number | null;
  pricePerFromToken: number | null;
}) {
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
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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
            <>
              <Box
                sx={{ typography: 'body2' }}
              >{`1 ${leftSymbol}  = ${formatReadableNumber({
                input: rightAmount as number,
                showDecimals: 4,
              })} ${rightSymbol}`}</Box>
              <Box
                component={ButtonBase}
                sx={{
                  width: 18,
                  height: 18,
                  ml: 6,
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
            </>
          ),
        }[priceStatus]
      }
    </Box>
  );
}
