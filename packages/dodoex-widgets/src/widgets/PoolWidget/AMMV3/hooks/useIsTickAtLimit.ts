import {
  FeeAmount,
  TICK_SPACINGS,
  TickMath,
  nearestUsableTick,
} from '../sdks/v3-sdk';
import { useMemo } from 'react';
import { Bound } from '../types';

export default function useIsTickAtLimit(
  feeAmount: FeeAmount | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined,
) {
  return useMemo(
    () => ({
      [Bound.LOWER]:
        feeAmount && tickLower
          ? tickLower ===
            nearestUsableTick(
              TickMath.MIN_TICK,
              TICK_SPACINGS[feeAmount as FeeAmount],
            )
          : undefined,
      [Bound.UPPER]:
        feeAmount && tickUpper
          ? tickUpper ===
            nearestUsableTick(
              TickMath.MAX_TICK,
              TICK_SPACINGS[feeAmount as FeeAmount],
            )
          : undefined,
    }),
    [feeAmount, tickLower, tickUpper],
  );
}
