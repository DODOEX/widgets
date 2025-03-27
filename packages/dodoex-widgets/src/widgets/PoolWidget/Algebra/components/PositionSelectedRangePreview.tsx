import { Box, LoadingSkeleton, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { ReactNode, useCallback, useState } from 'react';
import { formatTokenAmountNumber } from '../../../../utils';
import { Token } from '../sdks/sdk-core';
import { formatAmountWithAlphabetSymbol } from '../utils/formatTickPrice';
import { RateToggle } from './RateToggle';
import { AutoColumn, LightCard, RowBetween } from './widgets';
import { TokenInfo } from '../../../../hooks/Token';
import BigNumber from 'bignumber.js';
import { getTickToPrice } from '../utils/getTickToPrice';
import { buildCurrency } from '../utils';

export const PositionSelectedRangePreview = ({
  token0,
  token1,
  token0Price,
  tickLower,
  tickUpper,
  title,
  border,
}: {
  token0: TokenInfo;
  token1: TokenInfo;
  token0Price: string | undefined;
  tickLower: number | undefined;
  tickUpper: number | undefined;
  title?: ReactNode;
  border?: boolean;
}) => {
  const theme = useTheme();

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(token0);

  const sorted = baseCurrency.address === token0.address;
  const quoteCurrency = sorted ? token1 : token0;

  const currency0 = buildCurrency(token0) as Token;
  const currency1 = buildCurrency(token1) as Token;
  const price = token0Price
    ? sorted
      ? token0Price
      : new BigNumber(1).div(token0Price).toString()
    : undefined;
  const priceLower = getTickToPrice(token0, token1, tickLower);
  const priceUpper = getTickToPrice(token0, token1, tickUpper);
  const loading = tickLower === undefined || tickUpper === undefined;

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
          border={border}
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
          <LoadingSkeleton
            loading={loading}
            loadingProps={{
              width: 100,
            }}
            sx={{
              color: theme.palette.text.primary,
              typography: 'caption',
            }}
          >
            {formatAmountWithAlphabetSymbol(priceLower, 6)}
          </LoadingSkeleton>
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
          border={border}
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
          <LoadingSkeleton
            loading={loading}
            loadingProps={{
              width: 100,
            }}
            sx={{
              color: theme.palette.text.primary,
              typography: 'caption',
            }}
          >
            {formatAmountWithAlphabetSymbol(priceUpper, 6)}
          </LoadingSkeleton>

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
        border={border}
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
        <LoadingSkeleton
          loading={!token0Price}
          loadingProps={{
            width: 100,
          }}
          sx={{
            color: theme.palette.text.primary,
            typography: 'caption',
          }}
        >{`${formatTokenAmountNumber({
          input: price,
        })} `}</LoadingSkeleton>
      </LightCard>
    </AutoColumn>
  );
};
