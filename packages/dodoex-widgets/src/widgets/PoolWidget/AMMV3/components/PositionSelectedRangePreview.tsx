import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { formatTokenAmountNumber } from '../../../../utils';
import { Bound, PositionI } from '../types';
import { formatTickPrice } from '../utils/formatTickPrice';
import { RateToggle } from './RateToggle';
import { AutoColumn, LightCard, RowBetween } from './widgets';

export const PositionSelectedRangePreview = ({
  position,
  title,
  ticksAtLimit,
}: {
  position: PositionI;
  title?: ReactNode;
  ticksAtLimit: { [bound: string]: boolean | undefined };
}) => {
  const {
    poolInfo: {
      mintA,
      mintB,
      feeRate,
      mintASymbol,
      mintBSymbol,
      mintAChainId,
      mintBChainId,
      price,
    },
    liquidity,
    amountA,
    amountB,
    tickLowerPrice,
    tickUpperPrice,
  } = position;

  const theme = useTheme();

  // track which currency should be base
  const [mint1, setMint1] = useState({
    ...mintA,
    chainId: mintAChainId,
    symbol: mintASymbol,
  });

  const mint2 = useMemo(() => {
    const sorted = mint1.address === mintA.address;
    return sorted
      ? {
          ...mintB,
          chainId: mintBChainId,
          symbol: mintBSymbol,
        }
      : {
          ...mintA,
          chainId: mintAChainId,
          symbol: mintASymbol,
        };
  }, [
    mint1,
    mintA,
    mintAChainId,
    mintASymbol,
    mintB,
    mintBChainId,
    mintBSymbol,
  ]);

  const handleRateChange = useCallback(() => {
    setMint1(mint2);
  }, [mint2]);

  return (
    <AutoColumn gap="md">
      <RowBetween>
        {title ? (
          <Box
            sx={{
              typography: 'body1',
              fontWeight: 600,
              color: theme.palette.text.secondary,
            }}
          >
            {title}
          </Box>
        ) : (
          <div />
        )}
        <RateToggle
          mint1={mint1}
          mint2={mint2}
          handleRateToggle={handleRateChange}
        />
      </RowBetween>

      <RowBetween>
        <LightCard
          sx={{
            width: '48%',
            py: 12,
            gap: 12,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <Box
              sx={{
                color: theme.palette.text.primary,
                typography: 'body2',
              }}
            >
              <Trans>Min price</Trans>
            </Box>
            <Box
              sx={{
                color: theme.palette.text.secondary,
                typography: 'h6',
              }}
            >
              <Trans>
                {mint2.symbol} per {mint1.symbol}
              </Trans>
            </Box>
          </Box>
          <Box
            sx={{
              color: theme.palette.text.primary,
              typography: 'caption',
            }}
          >
            {formatTickPrice({
              price: tickLowerPrice,
              atLimit: ticksAtLimit,
              direction: Bound.LOWER,
            })}
          </Box>
          <Box
            sx={{
              color: theme.palette.text.secondary,
              typography: 'h6',
            }}
          >
            <Trans>
              Your position will be 100% composed of {mint1?.symbol} at this
              price
            </Trans>
          </Box>
        </LightCard>

        <LightCard
          sx={{
            width: '48%',
            py: 12,
            gap: 12,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <Box
              sx={{
                color: theme.palette.text.primary,
                typography: 'body2',
              }}
            >
              <Trans>Max price</Trans>
            </Box>
            <Box
              sx={{
                color: theme.palette.text.secondary,
                typography: 'h6',
              }}
            >
              <Trans>
                {mint2.symbol} per {mint1.symbol}
              </Trans>
            </Box>
          </Box>
          <Box
            sx={{
              color: theme.palette.text.primary,
              typography: 'caption',
            }}
          >
            {formatTickPrice({
              price: tickUpperPrice,
              atLimit: ticksAtLimit,
              direction: Bound.UPPER,
            })}
          </Box>

          <Box
            sx={{
              color: theme.palette.text.secondary,
              typography: 'h6',
            }}
          >
            <Trans>
              Your position will be 100% composed of {mint2?.symbol} at this
              price
            </Trans>
          </Box>
        </LightCard>
      </RowBetween>
      <LightCard
        sx={{
          py: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <AutoColumn gap="4px" justify="flex-start">
          <Box
            sx={{
              color: theme.palette.text.primary,
              typography: 'body2',
            }}
          >
            <Trans>Current price</Trans>
          </Box>
          <Box
            sx={{
              color: theme.palette.text.secondary,
              typography: 'h6',
            }}
          >
            <Trans>
              {mint2.symbol} per {mint1.symbol}
            </Trans>
          </Box>
        </AutoColumn>
        <Box
          sx={{
            color: theme.palette.text.primary,
            typography: 'caption',
          }}
        >
          {formatTokenAmountNumber({
            input: price,
          })}
        </Box>
      </LightCard>
    </AutoColumn>
  );
};
