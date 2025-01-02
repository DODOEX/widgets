import { useMemo } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { usePool } from '../hooks/usePools';
import { Pool, Position as V3Position } from '../sdks/v3-sdk';
import { PositionDetails } from '../types/position';
import { buildCurrency } from '../utils';

export function useDerivedPositionInfo(
  positionDetails: PositionDetails | undefined,
  baseToken: TokenInfo,
  quoteToken: TokenInfo,
): {
  position?: V3Position;
  pool?: Pool;
} {
  const currency0 = useMemo(
    () => (baseToken ? buildCurrency(baseToken) : undefined),
    [baseToken],
  );
  const currency1 = useMemo(
    () => (quoteToken ? buildCurrency(quoteToken) : undefined),
    [quoteToken],
  );

  // construct pool data
  const [, pool] = usePool(
    currency0 ?? undefined,
    currency1 ?? undefined,
    positionDetails?.fee,
  );

  let position = undefined;
  if (pool && positionDetails) {
    position = new V3Position({
      pool,
      liquidity: positionDetails.liquidity.toString(),
      tickLower: positionDetails.tickLower,
      tickUpper: positionDetails.tickUpper,
    });
  }

  return {
    position,
    pool: pool ?? undefined,
  };
}
