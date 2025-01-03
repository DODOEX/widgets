import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { ReactNode, useCallback, useState } from 'react';
import { formatTokenAmountNumber } from '../../../../utils';
import { Currency } from '../sdks/sdk-core';
import { Position } from '../sdks/v3-sdk';
import { Bound } from '../types';
import { formatTickPrice } from '../utils/formatTickPrice';
import { RateToggle } from './RateToggle';
import { AutoColumn, LightCard, RowBetween } from './widgets';

export const PositionSelectedRangePreview = ({
  position,
  title,
  baseCurrencyDefault,
  ticksAtLimit,
}: {
  position: Position;
  title?: ReactNode;
  baseCurrencyDefault?: Currency;
  ticksAtLimit: { [bound: string]: boolean | undefined };
}) => {
  const currency0 = position.pool.token0;
  const currency1 = position.pool.token1;

  const theme = useTheme();

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(
    baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
          ? currency1
          : currency0
      : currency0,
  );

  const sorted = baseCurrency === currency0;
  const quoteCurrency = sorted ? currency1 : currency0;

  const price = sorted
    ? position.pool.priceOf(position.pool.token0)
    : position.pool.priceOf(position.pool.token1);

  const priceLower = sorted
    ? position.token0PriceLower
    : position.token0PriceUpper.invert();
  const priceUpper = sorted
    ? position.token0PriceUpper
    : position.token0PriceLower.invert();

  const handleRateChange = useCallback(() => {
    setBaseCurrency(quoteCurrency);
  }, [quoteCurrency]);

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
          baseToken={sorted ? currency0 : currency1}
          quoteToken={sorted ? currency1 : currency0}
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
                {quoteCurrency.symbol} per {baseCurrency.symbol}
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
              price: priceLower,
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
              Your position will be 100% composed of {baseCurrency?.symbol} at
              this price
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
                {quoteCurrency.symbol} per {baseCurrency.symbol}
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
              price: priceUpper,
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
              Your position will be 100% composed of {quoteCurrency?.symbol} at
              this price
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
              {quoteCurrency.symbol} per {baseCurrency.symbol}
            </Trans>
          </Box>
        </AutoColumn>
        <Box
          sx={{
            color: theme.palette.text.primary,
            typography: 'caption',
          }}
        >{`${formatTokenAmountNumber({
          input: price.toSignificant(),
        })} `}</Box>
      </LightCard>
    </AutoColumn>
  );
};
