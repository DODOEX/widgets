import { Ticks } from '@dodoex/api';
import JSBI from 'jsbi';
import { TickProcessed } from '../hooks/usePoolTickData';
import { Token } from '../sdks/sdk-core';
import { tickToPrice } from '../sdks/v3-sdk';

const PRICE_FIXED_DIGITS = 8;

// Computes the numSurroundingTicks above or below the active tick.
export default function computeSurroundingTicks(
  token0: Token,
  token1: Token,
  activeTickProcessed: TickProcessed,
  sortedTickData: Ticks,
  pivot: number,
  ascending: boolean,
): TickProcessed[] {
  let previousTickProcessed: TickProcessed = {
    ...activeTickProcessed,
  };
  // Iterate outwards (either up or down depending on direction) from the active tick,
  // building active liquidity for every tick.
  let processedTicks: TickProcessed[] = [];
  for (
    let i = pivot + (ascending ? 1 : -1);
    ascending ? i < sortedTickData.length : i >= 0;
    ascending ? i++ : i--
  ) {
    const tick = Number(sortedTickData[i]?.tickIdx);
    const sdkPrice = tickToPrice(token0, token1, tick);
    const currentTickProcessed: TickProcessed = {
      liquidityActive: previousTickProcessed.liquidityActive,
      tick,
      liquidityNet: JSBI.BigInt(sortedTickData[i]?.liquidityNet ?? ''),
      price0: sdkPrice.toFixed(PRICE_FIXED_DIGITS),
      sdkPrice,
    };

    // Update the active liquidity.
    // If we are iterating ascending and we found an initialized tick we immediately apply
    // it to the current processed tick we are building.
    // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
    if (ascending) {
      currentTickProcessed.liquidityActive = JSBI.add(
        previousTickProcessed.liquidityActive,
        JSBI.BigInt(sortedTickData[i]?.liquidityNet ?? 0),
      );
    } else if (
      !ascending &&
      JSBI.notEqual(previousTickProcessed.liquidityNet, JSBI.BigInt(0))
    ) {
      // We are iterating descending, so look at the previous tick and apply any net liquidity.
      currentTickProcessed.liquidityActive = JSBI.subtract(
        previousTickProcessed.liquidityActive,
        previousTickProcessed.liquidityNet,
      );
    }

    processedTicks.push(currentTickProcessed);
    previousTickProcessed = currentTickProcessed;
  }

  if (!ascending) {
    processedTicks = processedTicks.reverse();
  }

  return processedTicks;
}
