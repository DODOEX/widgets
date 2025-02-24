import { MAX_TICK, MIN_TICK } from '@raydium-io/raydium-sdk-v2';
import invariant from 'tiny-invariant';

/**
 * Returns the closest tick that is nearest a given tick and usable for the given tick spacing
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */
export function nearestUsableTick(tick: number, tickSpacing: number) {
  invariant(
    Number.isInteger(tick) && Number.isInteger(tickSpacing),
    'INTEGERS',
  );
  invariant(tickSpacing > 0, 'TICK_SPACING');
  invariant(tick >= MIN_TICK && tick <= MAX_TICK, 'TICK_BOUND');
  const rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < MIN_TICK) {
    return rounded + tickSpacing;
  } else if (rounded > MAX_TICK) {
    return rounded - tickSpacing;
  } else {
    return rounded;
  }
}
