import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import JSBI from 'jsbi';
import { ReactNode, useMemo } from 'react';
import { tokenApi } from '../../../../constants/api';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { BIG_INT_ZERO } from '../constants/misc';
import { StateProps } from '../reducer';
import { Currency, CurrencyAmount, Price, Token } from '../sdks/sdk-core';
import {
  encodeSqrtRatioX96,
  nearestUsableTick,
  Pool,
  Position,
  priceToClosestTick,
  TICK_SPACINGS,
  TickMath,
} from '../sdks/v3-sdk';
import { Bound, Field } from '../types';
import { getTickToPrice } from '../utils/getTickToPrice';
import tryParseCurrencyAmount from '../utils/tryParseCurrencyAmount';
import { tryParseTick } from '../utils/tryParseTick';
import { PoolState, usePool } from './usePools';
import { useSwapTaxes } from './useSwapTaxes';

export function useV3DerivedMintInfo({
  state,
  existingPosition,
}: {
  state: StateProps;
  // override for existing position
  existingPosition?: Position;
}): {
  pool?: Pool | null;
  poolState: PoolState;
  ticks: { [bound in Bound]?: number | undefined };
  price?: Price<Token, Token>;
  pricesAtTicks: {
    [bound in Bound]?: Price<Token, Token> | undefined;
  };
  pricesAtLimit: {
    [bound in Bound]?: Price<Token, Token> | undefined;
  };
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> };
  dependentField: Field;
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> };
  position?: Position;
  noLiquidity?: boolean;
  errorMessage?: ReactNode;
  invalidPool: boolean;
  outOfRange: boolean;
  invalidRange: boolean;
  depositADisabled: boolean;
  depositBDisabled: boolean;
  invertPrice: boolean;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  isTaxed: boolean;
} {
  const { account, chainId } = useWalletInfo();

  const {
    feeAmount,
    independentField,
    typedValue,
    leftRangeTypedValue,
    rightRangeTypedValue,
    startPriceTypedValue,
  } = state;
  const currencyA = state.baseToken ?? undefined;
  const baseCurrency = state.baseToken ?? undefined;
  const currencyB = state.quoteToken ?? undefined;

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

  // currencies
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA,
      [Field.CURRENCY_B]: currencyB,
    }),
    [currencyA, currencyB],
  );

  // formatted with tokens
  const [tokenA, tokenB, baseToken] = useMemo(
    () => [currencyA?.wrapped, currencyB?.wrapped, baseCurrency?.wrapped],
    [currencyA, currencyB, baseCurrency],
  );

  const [token0, token1] = useMemo(
    () =>
      tokenA && tokenB
        ? tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA]
        : [undefined, undefined],
    [tokenA, tokenB],
  );

  // balances
  const currencyATokenQuery = useQuery(
    tokenApi.getFetchTokenQuery(
      currencies[Field.CURRENCY_A]?.chainId,
      currencies[Field.CURRENCY_A]?.address,
      account,
    ),
  );
  const currencyBTokenQuery = useQuery(
    tokenApi.getFetchTokenQuery(
      currencies[Field.CURRENCY_B]?.chainId,
      currencies[Field.CURRENCY_B]?.address,
      account,
    ),
  );
  const currencyBalances: { [field in Field]?: CurrencyAmount<Currency> } =
    useMemo(() => {
      return {
        [Field.CURRENCY_A]: !currencies[Field.CURRENCY_A]
          ? undefined
          : currencyATokenQuery.data?.balance
            ? CurrencyAmount.fromRawAmount(
                currencies[Field.CURRENCY_A],
                JSBI.BigInt(
                  currencyATokenQuery.data?.balance
                    .multipliedBy(
                      Math.pow(10, currencies[Field.CURRENCY_A].decimals ?? 18),
                    )
                    .toString(),
                ),
              )
            : CurrencyAmount.fromRawAmount(currencies[Field.CURRENCY_A], 0),
        [Field.CURRENCY_B]: !currencies[Field.CURRENCY_B]
          ? undefined
          : currencyBTokenQuery.data?.balance
            ? CurrencyAmount.fromRawAmount(
                currencies[Field.CURRENCY_B],
                JSBI.BigInt(
                  currencyBTokenQuery.data?.balance
                    .multipliedBy(
                      Math.pow(10, currencies[Field.CURRENCY_B].decimals ?? 18),
                    )
                    .toString(),
                ),
              )
            : CurrencyAmount.fromRawAmount(currencies[Field.CURRENCY_B], 0),
      };
    }, [
      currencies,
      currencyATokenQuery.data?.balance,
      currencyBTokenQuery.data?.balance,
    ]);

  // pool
  const [poolState, pool] = usePool(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
    feeAmount,
  );
  const noLiquidity = poolState === PoolState.NOT_EXISTS;

  // note to parse inputs in reverse
  const invertPrice = Boolean(baseToken && token0 && !baseToken.equals(token0));

  // always returns the price with 0 as base token
  const price: Price<Token, Token> | undefined = useMemo(() => {
    // if no liquidity use typed value
    if (noLiquidity) {
      const parsedQuoteAmount = tryParseCurrencyAmount(
        startPriceTypedValue,
        invertPrice ? token0 : token1,
      );
      if (parsedQuoteAmount && token0 && token1) {
        const baseAmount = tryParseCurrencyAmount(
          '1',
          invertPrice ? token1 : token0,
        );
        const price =
          baseAmount && parsedQuoteAmount
            ? new Price(
                baseAmount.currency,
                parsedQuoteAmount.currency,
                baseAmount.quotient,
                parsedQuoteAmount.quotient,
              )
            : undefined;
        return (invertPrice ? price?.invert() : price) ?? undefined;
      }
      return undefined;
    } else {
      // get the amount of quote currency
      return pool && token0 ? pool.priceOf(token0) : undefined;
    }
  }, [noLiquidity, startPriceTypedValue, invertPrice, token1, token0, pool]);

  // check for invalid price input (converts to invalid ratio)
  const invalidPrice = useMemo(() => {
    const sqrtRatioX96 = price
      ? encodeSqrtRatioX96(price.numerator, price.denominator)
      : undefined;
    return (
      price &&
      sqrtRatioX96 &&
      !(
        JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) &&
        JSBI.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)
      )
    );
  }, [price]);

  // used for ratio calculation when pool not initialized
  const mockPool = useMemo(() => {
    if (tokenA && tokenB && feeAmount && price && !invalidPrice) {
      const currentTick = priceToClosestTick(price);
      const currentSqrt = TickMath.getSqrtRatioAtTick(currentTick);
      return new Pool(
        tokenA,
        tokenB,
        feeAmount,
        currentSqrt,
        JSBI.BigInt(0),
        currentTick,
        [],
      );
    } else {
      return undefined;
    }
  }, [feeAmount, invalidPrice, price, tokenA, tokenB]);

  // if pool exists use it, if not use the mock pool
  const poolForPosition: Pool | undefined = pool ?? mockPool;

  // lower and upper limits in the tick space for `feeAmount`
  const tickSpaceLimits = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount
        ? nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount])
        : undefined,
      [Bound.UPPER]: feeAmount
        ? nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount])
        : undefined,
    }),
    [feeAmount],
  );

  // parse typed range values and determine closest ticks
  // lower should always be a smaller tick
  const ticks = useMemo(() => {
    return {
      [Bound.LOWER]:
        typeof existingPosition?.tickLower === 'number'
          ? existingPosition.tickLower
          : (invertPrice && typeof rightRangeTypedValue === 'boolean') ||
              (!invertPrice && typeof leftRangeTypedValue === 'boolean')
            ? tickSpaceLimits[Bound.LOWER]
            : invertPrice
              ? tryParseTick(
                  token1,
                  token0,
                  feeAmount,
                  rightRangeTypedValue.toString(),
                )
              : tryParseTick(
                  token0,
                  token1,
                  feeAmount,
                  leftRangeTypedValue.toString(),
                ),
      [Bound.UPPER]:
        typeof existingPosition?.tickUpper === 'number'
          ? existingPosition.tickUpper
          : (!invertPrice && typeof rightRangeTypedValue === 'boolean') ||
              (invertPrice && typeof leftRangeTypedValue === 'boolean')
            ? tickSpaceLimits[Bound.UPPER]
            : invertPrice
              ? tryParseTick(
                  token1,
                  token0,
                  feeAmount,
                  leftRangeTypedValue.toString(),
                )
              : tryParseTick(
                  token0,
                  token1,
                  feeAmount,
                  rightRangeTypedValue.toString(),
                ),
    };
  }, [
    existingPosition,
    feeAmount,
    invertPrice,
    leftRangeTypedValue,
    rightRangeTypedValue,
    tickSpaceLimits,
    token0,
    token1,
  ]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks || {};

  // specifies whether the lower and upper ticks is at the exteme bounds
  const ticksAtLimit = useMemo(() => {
    return {
      [Bound.LOWER]: feeAmount && tickLower === tickSpaceLimits.LOWER,
      [Bound.UPPER]: feeAmount && tickUpper === tickSpaceLimits.UPPER,
    };
  }, [tickSpaceLimits, tickLower, tickUpper, feeAmount]);

  // mark invalid range
  const invalidRange = Boolean(
    typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      tickLower >= tickUpper,
  );

  const pricesAtLimit = useMemo(() => {
    return {
      [Bound.LOWER]: getTickToPrice(token0, token1, tickSpaceLimits.LOWER),
      [Bound.UPPER]: getTickToPrice(token0, token1, tickSpaceLimits.UPPER),
    };
  }, [token0, token1, tickSpaceLimits.LOWER, tickSpaceLimits.UPPER]);

  // always returns the price with 0 as base token
  const pricesAtTicks = useMemo(() => {
    return {
      [Bound.LOWER]: getTickToPrice(token0, token1, ticks[Bound.LOWER]),
      [Bound.UPPER]: getTickToPrice(token0, token1, ticks[Bound.UPPER]),
    };
  }, [token0, token1, ticks]);
  const { [Bound.LOWER]: lowerPrice, [Bound.UPPER]: upperPrice } =
    pricesAtTicks;

  // liquidity range warning
  const outOfRange = Boolean(
    !invalidRange &&
      price &&
      lowerPrice &&
      upperPrice &&
      (price.lessThan(lowerPrice) || price.greaterThan(upperPrice)),
  );

  // amounts
  const independentAmount: CurrencyAmount<Currency> | undefined =
    tryParseCurrencyAmount(typedValue, currencies[independentField]);

  const dependentAmount: CurrencyAmount<Currency> | undefined = useMemo(() => {
    // we wrap the currencies just to get the price in terms of the other token
    const wrappedIndependentAmount = independentAmount?.wrapped;
    const dependentCurrency =
      dependentField === Field.CURRENCY_B ? currencyB : currencyA;
    if (
      independentAmount &&
      wrappedIndependentAmount &&
      typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      poolForPosition
    ) {
      // if price is out of range or invalid range - return 0 (single deposit will be independent)
      if (outOfRange || invalidRange) {
        return undefined;
      }

      const position: Position | undefined =
        wrappedIndependentAmount.currency.equals(poolForPosition.token0)
          ? Position.fromAmount0({
              pool: poolForPosition,
              tickLower,
              tickUpper,
              amount0: independentAmount.quotient,
              useFullPrecision: true, // we want full precision for the theoretical position
            })
          : Position.fromAmount1({
              pool: poolForPosition,
              tickLower,
              tickUpper,
              amount1: independentAmount.quotient,
            });

      const dependentTokenAmount = wrappedIndependentAmount.currency.equals(
        poolForPosition.token0,
      )
        ? position.amount1
        : position.amount0;
      return (
        dependentCurrency &&
        CurrencyAmount.fromRawAmount(
          dependentCurrency,
          dependentTokenAmount.quotient,
        )
      );
    }

    return undefined;
  }, [
    independentAmount,
    outOfRange,
    dependentField,
    currencyB,
    currencyA,
    tickLower,
    tickUpper,
    poolForPosition,
    invalidRange,
  ]);

  const parsedAmounts: {
    [field in Field]: CurrencyAmount<Currency> | undefined;
  } = useMemo(() => {
    return {
      [Field.CURRENCY_A]:
        independentField === Field.CURRENCY_A
          ? independentAmount
          : dependentAmount,
      [Field.CURRENCY_B]:
        independentField === Field.CURRENCY_A
          ? dependentAmount
          : independentAmount,
    };
  }, [dependentAmount, independentAmount, independentField]);

  // single deposit only if price is out of range
  const deposit0Disabled = Boolean(
    typeof tickUpper === 'number' &&
      poolForPosition &&
      poolForPosition.tickCurrent >= tickUpper,
  );
  const deposit1Disabled = Boolean(
    typeof tickLower === 'number' &&
      poolForPosition &&
      poolForPosition.tickCurrent <= tickLower,
  );

  // sorted for token order
  const depositADisabled =
    invalidRange ||
    Boolean(
      (deposit0Disabled &&
        poolForPosition &&
        tokenA &&
        poolForPosition.token0.equals(tokenA)) ||
        (deposit1Disabled &&
          poolForPosition &&
          tokenA &&
          poolForPosition.token1.equals(tokenA)),
    );
  const depositBDisabled =
    invalidRange ||
    Boolean(
      (deposit0Disabled &&
        poolForPosition &&
        tokenB &&
        poolForPosition.token0.equals(tokenB)) ||
        (deposit1Disabled &&
          poolForPosition &&
          tokenB &&
          poolForPosition.token1.equals(tokenB)),
    );

  const { inputTax: currencyATax, outputTax: currencyBTax } = useSwapTaxes(
    currencyA?.isToken ? currencyA.address : undefined,
    currencyB?.isToken ? currencyB.address : undefined,
    chainId,
  );

  // create position entity based on users selection
  const position: Position | undefined = useMemo(() => {
    if (
      !poolForPosition ||
      !tokenA ||
      !tokenB ||
      typeof tickLower !== 'number' ||
      typeof tickUpper !== 'number' ||
      invalidRange
    ) {
      return undefined;
    }

    // mark as 0 if disabled because out of range
    const amount0 = !deposit0Disabled
      ? parsedAmounts?.[
          tokenA.equals(poolForPosition.token0)
            ? Field.CURRENCY_A
            : Field.CURRENCY_B
        ]?.quotient
      : BIG_INT_ZERO;
    const amount1 = !deposit1Disabled
      ? parsedAmounts?.[
          tokenA.equals(poolForPosition.token0)
            ? Field.CURRENCY_B
            : Field.CURRENCY_A
        ]?.quotient
      : BIG_INT_ZERO;

    if (amount0 !== undefined && amount1 !== undefined) {
      return Position.fromAmounts({
        pool: poolForPosition,
        tickLower,
        tickUpper,
        amount0,
        amount1,
        useFullPrecision: true, // we want full precision for the theoretical position
      });
    } else {
      return undefined;
    }
  }, [
    parsedAmounts,
    poolForPosition,
    tokenA,
    tokenB,
    deposit0Disabled,
    deposit1Disabled,
    invalidRange,
    tickLower,
    tickUpper,
  ]);

  let errorMessage: ReactNode | undefined;
  if (!account) {
    errorMessage = t`Connect to a wallet`;
  }

  if (poolState === PoolState.INVALID) {
    errorMessage = errorMessage ?? t`Invalid pair`;
  }

  if (invalidPrice) {
    errorMessage = errorMessage ?? t`Invalid price input`;
  }

  if (
    (!parsedAmounts[Field.CURRENCY_A] && !depositADisabled) ||
    (!parsedAmounts[Field.CURRENCY_B] && !depositBDisabled)
  ) {
    errorMessage = errorMessage ?? t`Enter an amount`;
  }

  const {
    [Field.CURRENCY_A]: currencyAAmount,
    [Field.CURRENCY_B]: currencyBAmount,
  } = parsedAmounts;

  if (
    currencyAAmount &&
    currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)
  ) {
    errorMessage = t`Insufficient ${currencies[Field.CURRENCY_A]?.symbol} balance`;
  }

  if (
    currencyBAmount &&
    currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)
  ) {
    errorMessage = t`Insufficient ${currencies[Field.CURRENCY_B]?.symbol} balance`;
  }

  const isTaxed = currencyATax.greaterThan(0) || currencyBTax.greaterThan(0);
  const invalidPool = poolState === PoolState.INVALID || isTaxed;

  return {
    dependentField,
    currencies,
    pool,
    poolState,
    currencyBalances,
    parsedAmounts,
    ticks,
    price,
    pricesAtTicks,
    pricesAtLimit,
    position,
    noLiquidity,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
    isTaxed,
  };
}
