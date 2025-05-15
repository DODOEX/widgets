import { useCallback } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { tickToPrice } from '../utils/getTickToPrice';
import React from 'react';
import { TickMath } from '../utils/tickMath';
import { tryParseTick } from '../utils/tryParseTick';
import { Rounding } from '../../../../utils/fractions/types';
import { Price } from '../../../../utils/fractions';
import { nearestUsableTick } from '../utils/nearestUsableTick';
import { Bound } from '../types';

export function useSetRange({
  tickCurrent,
  token0,
  token1,
  sorted,
  tickSpacing,
  price,
}: {
  tickCurrent: number | undefined;
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  sorted: boolean;
  tickSpacing: number;
  price?: Price;
}) {
  const [leftRangeTypedValue, setLeftRangeTypedValue] = React.useState<
    string | boolean
  >('');
  const [rightRangeTypedValue, setRightRangeTypedValue] = React.useState<
    string | boolean
  >('');

  // note to parse inputs in reverse
  const invertPrice = !sorted;

  const [baseToken, quoteToken] = React.useMemo(() => {
    return [sorted ? token0 : token1, sorted ? token1 : token0];
  }, [sorted, token0, token1]);

  // lower and upper limits in the tick space
  const tickSpaceLimits = React.useMemo(
    () => ({
      [Bound.LOWER]: tickSpacing
        ? nearestUsableTick(TickMath.MIN_TICK, tickSpacing)
        : undefined,
      [Bound.UPPER]: tickSpacing
        ? nearestUsableTick(TickMath.MAX_TICK, tickSpacing)
        : undefined,
    }),
    [tickSpacing],
  );

  // parse typed range values and determine closest ticks
  // lower should always be a smaller tick
  const [tickLower, tickUpper] = React.useMemo(() => {
    const tickLower = (
      (invertPrice && typeof rightRangeTypedValue === 'boolean') ||
      (!invertPrice && typeof leftRangeTypedValue === 'boolean')
        ? tickSpaceLimits[Bound.LOWER]
        : invertPrice
          ? tryParseTick(
              token1,
              token0,
              rightRangeTypedValue.toString(),
              tickSpacing,
            )
          : tryParseTick(
              token0,
              token1,
              leftRangeTypedValue.toString(),
              tickSpacing,
            )
    ) as number;

    const tickUpper = (
      (!invertPrice && typeof rightRangeTypedValue === 'boolean') ||
      (invertPrice && typeof leftRangeTypedValue === 'boolean')
        ? tickSpaceLimits[Bound.UPPER]
        : invertPrice
          ? tryParseTick(
              token1,
              token0,
              leftRangeTypedValue.toString(),
              tickSpacing,
            )
          : tryParseTick(
              token0,
              token1,
              rightRangeTypedValue.toString(),
              tickSpacing,
            )
    ) as number;
    return [tickLower, tickUpper];
  }, [
    invertPrice,
    leftRangeTypedValue,
    rightRangeTypedValue,
    tickSpaceLimits,
    tickSpacing,
    token0,
    token1,
  ]);

  // always returns the price with 0 as base token
  const pricesAtTicks = React.useMemo(() => {
    if (!token0 || !token1)
      return {
        [Bound.LOWER]: undefined,
        [Bound.UPPER]: undefined,
      };
    return {
      [Bound.LOWER]:
        tickLower !== undefined
          ? tickToPrice(token0, token1, tickLower)
          : undefined,
      [Bound.UPPER]:
        tickUpper !== undefined
          ? tickToPrice(token0, token1, tickUpper)
          : undefined,
    };
  }, [token0, token1, tickLower, tickUpper]);

  // specifies whether the lower and upper ticks is at the exteme bounds
  const ticksAtLimit = React.useMemo(() => {
    return {
      [Bound.LOWER]: tickLower === tickSpaceLimits.LOWER,
      [Bound.UPPER]: tickUpper === tickSpaceLimits.UPPER,
    };
  }, [tickSpaceLimits, tickLower, tickUpper]);

  const getDecrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === 'number') {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickLower - tickSpacing,
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickLower === 'number') &&
      baseToken &&
      quoteToken &&
      typeof tickCurrent === 'number'
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickCurrent - tickSpacing,
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return '';
  }, [baseToken, quoteToken, tickLower, tickCurrent, tickSpacing]);

  const getIncrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === 'number') {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickLower + tickSpacing,
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickLower === 'number') &&
      baseToken &&
      quoteToken &&
      tickCurrent
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickCurrent + tickSpacing,
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return '';
  }, [baseToken, quoteToken, tickLower, tickCurrent, tickSpacing]);

  const getDecrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === 'number') {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickUpper - tickSpacing,
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickUpper === 'number') &&
      baseToken &&
      quoteToken &&
      tickCurrent
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickCurrent - tickSpacing,
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return '';
  }, [baseToken, quoteToken, tickUpper, tickCurrent, tickSpacing]);

  const getIncrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === 'number') {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickUpper + tickSpacing,
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickUpper === 'number') &&
      baseToken &&
      quoteToken &&
      tickCurrent
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickCurrent + tickSpacing,
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return '';
  }, [baseToken, quoteToken, tickUpper, tickCurrent, tickSpacing]);

  const getSetFullRange = useCallback(() => {
    setLeftRangeTypedValue(true);
    setRightRangeTypedValue(true);
  }, []);

  const handleSetFullRange = React.useCallback(() => {
    getSetFullRange();
    // if (!token0 || !token1) {
    //   throw new Error('token is undefined');
    // }

    // const minPrice = tickToPrice(
    //   token0,
    //   token1,
    //   tickSpaceLimits[Bound.LOWER] as number,
    // );
    // if (minPrice) {
    //   setLeftRangeTypedValue(minPrice.toSignificant(5));
    // }
    // const maxPrice = tickToPrice(
    //   token0,
    //   token1,
    //   tickSpaceLimits[Bound.UPPER] as number,
    // );
    // if (maxPrice) {
    //   setRightRangeTypedValue(maxPrice.toSignificant(5));
    // }
  }, [getSetFullRange]);

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } =
    pricesAtTicks;

  const handleRateToggle = () => {
    if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
      setLeftRangeTypedValue(
        (invertPrice ? priceLower : priceLower?.invert())?.toSignificant(6) ??
          '',
      );
      setRightRangeTypedValue(
        (invertPrice ? priceUpper : priceUpper?.invert())?.toSignificant(6) ??
          '',
      );
    }
  };

  // mark invalid range
  const invalidRange = Boolean(
    typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      tickLower >= tickUpper,
  );

  // liquidity range warning
  const outOfRange = Boolean(
    !invalidRange &&
      price &&
      priceLower &&
      priceUpper &&
      (price.lessThan(priceLower) || price.greaterThan(priceUpper)),
  );

  return {
    ticksAtLimit,
    tickLower,
    tickUpper,
    priceLower,
    priceUpper,
    leftRangeTypedValue,
    rightRangeTypedValue,
    invalidRange,
    outOfRange,
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    handleSetFullRange,
    handleRateToggle,
    onLeftRangeInput: setLeftRangeTypedValue,
    onRightRangeInput: setRightRangeTypedValue,
  };
}
