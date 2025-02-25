import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { Actions, StateProps, Types } from '../reducer';
import { TICK_SPACINGS } from '../sdks/v3-sdk';
import { PoolInfoI } from '../types';
import { tickToPrice } from '../utils/tickToPrice';

export function useRangeHopCallbacks({
  tickLower,
  tickUpper,
  poolInfo,
  state,
  dispatch,
}: {
  tickLower: number | undefined;
  tickUpper: number | undefined;
  poolInfo: PoolInfoI | undefined;
  state: StateProps;
  dispatch: React.Dispatch<Actions>;
}) {
  const { feeAmount } = state;
  const decimalsA = poolInfo?.mintA?.decimals;
  const decimalsB = poolInfo?.mintB?.decimals;

  const getDecrementLower = useCallback(() => {
    if (!feeAmount) {
      return '';
    }

    const nextTick =
      typeof tickLower === 'number' ? tickLower : poolInfo?.tickCurrent;
    if (!nextTick) {
      return '';
    }

    const newPrice = tickToPrice({
      decimalsA,
      decimalsB,
      tick: nextTick - TICK_SPACINGS[feeAmount],
    });
    if (!newPrice) {
      return '';
    }

    return newPrice.dp(5, BigNumber.ROUND_UP).toString();
  }, [decimalsA, decimalsB, feeAmount, poolInfo?.tickCurrent, tickLower]);

  const getIncrementLower = useCallback(() => {
    if (!feeAmount) {
      return '';
    }

    const nextTick =
      typeof tickLower === 'number' ? tickLower : poolInfo?.tickCurrent;
    if (!nextTick) {
      return '';
    }

    const newPrice = tickToPrice({
      decimalsA,
      decimalsB,
      tick: nextTick + TICK_SPACINGS[feeAmount],
    });
    if (!newPrice) {
      return '';
    }

    return newPrice.dp(5, BigNumber.ROUND_UP).toString();
  }, [decimalsA, decimalsB, feeAmount, poolInfo?.tickCurrent, tickLower]);

  const getDecrementUpper = useCallback(() => {
    if (!feeAmount) {
      return '';
    }

    const nextTick =
      typeof tickUpper === 'number' ? tickUpper : poolInfo?.tickCurrent;
    if (!nextTick) {
      return '';
    }

    const newPrice = tickToPrice({
      decimalsA,
      decimalsB,
      tick: nextTick - TICK_SPACINGS[feeAmount],
    });
    if (!newPrice) {
      return '';
    }

    return newPrice.dp(5, BigNumber.ROUND_UP).toString();
  }, [decimalsA, decimalsB, feeAmount, poolInfo?.tickCurrent, tickUpper]);

  const getIncrementUpper = useCallback(() => {
    if (!feeAmount) {
      return '';
    }

    const nextTick =
      typeof tickUpper === 'number' ? tickUpper : poolInfo?.tickCurrent;
    if (!nextTick) {
      return '';
    }

    const newPrice = tickToPrice({
      decimalsA,
      decimalsB,
      tick: nextTick + TICK_SPACINGS[feeAmount],
    });
    if (!newPrice) {
      return '';
    }

    return newPrice.dp(5, BigNumber.ROUND_UP).toString();
  }, [decimalsA, decimalsB, feeAmount, poolInfo?.tickCurrent, tickUpper]);

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
