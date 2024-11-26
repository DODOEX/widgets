import { Box, Button, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useMemo } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import useIsTickAtLimit from '../hooks/useIsTickAtLimit';
import { usePool } from '../hooks/usePools';
import { Currency, Price, Token } from '../sdks/sdk-core';
import { Position as V3Position } from '../sdks/v3-sdk';
import { PositionDetails } from '../types/position';
import { buildCurrency } from '../utils';
import { formatTickPrice } from '../utils/formatTickPrice';
import { Bound } from '../types';
import { formatTokenAmountNumber } from '../../../../utils';

export interface PriceOrdering {
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  quote?: Currency;
  base?: Currency;
}

export function getPriceOrderingFromPositionForUI(
  position?: V3Position,
): PriceOrdering {
  if (!position) {
    return {};
  }

  const token0 = position.amount0.currency;
  const token1 = position.amount1.currency;

  // if token0 is a dollar-stable asset, set it as the quote token
  const stables: Token[] = [];
  if (stables.some((stable) => stable.equals(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    };
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  const bases: Token[] = [];
  if (bases.some((base) => base && base.equals(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    };
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    };
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  };
}

export interface PositionViewCardProps {
  p: PositionDetails;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  onClickManage: () => void;
}

export const PositionViewCard = ({
  p,
  baseToken,
  quoteToken,
  onClickManage,
}: PositionViewCardProps) => {
  const theme = useTheme();

  const currency0 = useMemo(
    () => (baseToken ? buildCurrency(baseToken) : undefined),
    [baseToken],
  );
  const currency1 = useMemo(
    () => (quoteToken ? buildCurrency(quoteToken) : undefined),
    [quoteToken],
  );

  // construct Position from details returned
  const [, pool] = usePool(
    currency0 ?? undefined,
    currency1 ?? undefined,
    p.fee,
  );

  const position = useMemo(() => {
    if (pool) {
      return new V3Position({
        pool,
        liquidity: p.liquidity.toString(),
        tickLower: p.tickLower,
        tickUpper: p.tickUpper,
      });
    }
    return undefined;
  }, [p.liquidity, p.tickLower, p.tickUpper, pool]);

  const tickAtLimit = useIsTickAtLimit(p.fee, p.tickLower, p.tickUpper);

  // prices
  const { priceLower, priceUpper, quote, base } =
    getPriceOrderingFromPositionForUI(position);

  const currencyQuote = quote;
  const currencyBase = base;

  // check if price is within range
  const outOfRange: boolean = pool
    ? pool.tickCurrent < p.tickLower || pool.tickCurrent >= p.tickUpper
    : false;

  const sorted = currency0 === currency0;
  const price = sorted
    ? position?.pool.priceOf(position?.pool.token0)
    : position?.pool.priceOf(position?.pool.token1);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 24,
        px: 20,
        py: 20,
        pb: 12,
        borderRadius: 12,
        backgroundColor: theme.palette.background.paperContrast,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            typography: 'h5',
            color: theme.palette.text.primary,
          }}
        >
          <Box>
            <>
              <span>
                {formatTickPrice({
                  price: priceLower,
                  atLimit: tickAtLimit,
                  direction: Bound.LOWER,
                })}
                &nbsp;
              </span>
              {currencyQuote?.symbol}
            </>
            &nbsp;per&nbsp;
            {currencyBase?.symbol ?? ''}
          </Box>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
          >
            <path
              d="M15.75 9.50293L12.75 12.5029L11.7 11.4529L12.8813 10.2529L5.11875 10.2529L6.3 11.4529L5.25 12.5029L2.25 9.50293L5.25 6.50293L6.31875 7.55293L5.11875 8.75293L12.8813 8.75293L11.7 7.55293L12.75 6.50293L15.75 9.50293Z"
              fill="currentColor"
              fillOpacity="0.5"
            />
          </svg>
          <Box>
            <>
              <span>
                {formatTickPrice({
                  price: priceUpper,
                  atLimit: tickAtLimit,
                  direction: Bound.UPPER,
                })}
                &nbsp;
              </span>
              {currencyQuote?.symbol}
            </>
            &nbsp;per&nbsp;
            {currencyBase?.symbol}
          </Box>
          {/* <Box
            component="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 19"
            fill="none"
            sx={{
              ml: 4,
              width: 18,
              height: 19,
            }}
          >
            <circle
              cx="9"
              cy="9.5"
              r="9"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <path
              d="M9.5 7H4.5V8.5H13.5L9.5 4.75V7ZM8.25 14.25V12H13.5V10.5H4.5L8.25 14.25Z"
              fill="currentColor"
              fillOpacity="0.5"
            />
          </Box> */}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {outOfRange ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.583252 12.5416L6.99992 1.45825L13.4166 12.5416H0.583252ZM11.3924 11.3749L6.9999 3.78575L2.6074 11.3749H11.3924ZM7.58328 9.62492H6.41661V10.7916H7.58328V9.62492ZM6.41661 6.12492H7.58328V8.45825H6.41661V6.12492Z"
                fill={theme.palette.warning.main}
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
            >
              <circle cx="4" cy="4" r="4" fill={theme.palette.success.main} />
            </svg>
          )}

          <Box
            sx={{
              typography: 'h6',
              color: theme.palette.text.secondary,
            }}
          >
            {t`Current price`}:&nbsp;
            {`${formatTokenAmountNumber({
              input: price?.toSignificant(),
            })} `}
            &nbsp;{currencyQuote?.symbol}&nbsp;per&nbsp;
            {currencyBase?.symbol}
          </Box>
        </Box>
      </Box>
      <Button
        variant={Button.Variant.outlined}
        size={Button.Size.small}
        fullWidth
        onClick={onClickManage}
      >
        {t`Manage`}
      </Button>
    </Box>
  );
};
