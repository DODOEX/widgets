import { useCallback, useMemo } from 'react';
import { Actions, StateProps, Types } from '../reducer';
import { Rounding } from '../sdks/sdk-core/constants';
import { Pool, TICK_SPACINGS, tickToPrice } from '../sdks/v3-sdk';

export function useRangeHopCallbacks({
  tickLower,
  tickUpper,
  pool,
  state,
  dispatch,
}: {
  tickLower: number | undefined;
  tickUpper: number | undefined;
  pool?: Pool | undefined | null;
  state: StateProps;
  dispatch: React.Dispatch<Actions>;
}) {
  const {
    baseToken: baseCurrency,
    quoteToken: quoteCurrency,
    feeAmount,
  } = state;

  const baseToken = useMemo(() => baseCurrency?.wrapped, [baseCurrency]);
  const quoteToken = useMemo(() => quoteCurrency?.wrapped, [quoteCurrency]);

  const getDecrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === 'number' && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickLower - TICK_SPACINGS[feeAmount],
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickLower === 'number') &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent - TICK_SPACINGS[feeAmount],
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return '';
  }, [baseToken, quoteToken, tickLower, feeAmount, pool]);

  const getIncrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === 'number' && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickLower + TICK_SPACINGS[feeAmount],
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickLower === 'number') &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent + TICK_SPACINGS[feeAmount],
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return '';
  }, [baseToken, quoteToken, tickLower, feeAmount, pool]);

  const getDecrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === 'number' && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickUpper - TICK_SPACINGS[feeAmount],
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickUpper === 'number') &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent - TICK_SPACINGS[feeAmount],
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return '';
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool]);

  const getIncrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === 'number' && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickUpper + TICK_SPACINGS[feeAmount],
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickUpper === 'number') &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent + TICK_SPACINGS[feeAmount],
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return '';
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool]);

  const getSetFullRange = useCallback(() => {
    dispatch({
      type: Types.setFullRange,
      payload: undefined,
    });
  }, [dispatch]);

  return {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
  };
}
