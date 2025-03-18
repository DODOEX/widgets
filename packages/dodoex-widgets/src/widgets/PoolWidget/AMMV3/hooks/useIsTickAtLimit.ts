import { MAX_TICK, MIN_TICK } from '@raydium-io/raydium-sdk-v2';
import { useMemo } from 'react';
import { FeeAmount, TICK_SPACINGS } from '../sdks/v3-sdk/constants';
import { nearestUsableTick } from '../sdks/v3-sdk/utils/nearestUsableTick';
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
            nearestUsableTick(MIN_TICK, TICK_SPACINGS[feeAmount as FeeAmount])
          : undefined,
      [Bound.UPPER]:
        feeAmount && tickUpper
          ? tickUpper ===
            nearestUsableTick(MAX_TICK, TICK_SPACINGS[feeAmount as FeeAmount])
          : undefined,
    }),
    [feeAmount, tickLower, tickUpper],
  );
}
