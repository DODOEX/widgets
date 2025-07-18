import { ChainId, CurveApi, ExcludeNone } from '@dodoex/api';
import { contractRequests } from '../../../constants/api';
import { CurvePoolT } from './types';

export const curveApi = new CurveApi({
  contractRequests,
});

export function convertRawPoolListToCurvePoolListT(
  rawPoolList: ExcludeNone<
    ReturnType<
      Exclude<
        (typeof CurveApi.graphql.curve_stableswap_ng_getAllPools)['__apiType'],
        undefined
      >
    >['curve_stableswap_ng_getAllPools']
  >['lqList'],
  chainId: ChainId | undefined,
): CurvePoolT[] {
  if (!rawPoolList || !chainId) {
    return [];
  }

  const curvePoolList: CurvePoolT[] = [];

  for (const lqItem of rawPoolList) {
    if (!lqItem?.pool) {
      continue;
    }

    const pool = lqItem.pool;

    // Convert coins to TokenInfo format
    const coins =
      pool.coins?.map((coin) => ({
        chainId,
        address: coin.address || coin.id || '',
        name: coin.name || coin.symbol || '',
        decimals: coin.decimals || 18,
        symbol: coin.symbol || '',
        logoURI: coin.logoImg || undefined,
      })) || [];

    // Create CurvePoolT object
    const curvePool: CurvePoolT = {
      chainId,
      name: pool.name || '',
      address: pool.address || pool.id || '',
      symbol: coins.length > 0 ? coins.map((c) => c.symbol).join('.') : '',
      decimals: 18, // Default decimals for LP token
      fee: pool.fee?.toString() || '0',
      coins: coins,
      apy: pool.apy?.toString() || null,
      dailyApy: null,
      weeklyApy: null,
      tvl: pool.tvl?.toString() || null,
      volume: pool.volume?.toString() || null,
      dailyVolumeUsd: pool.dailyVolumeUsd?.toString() || null,
      traderCount: pool.traderCount?.toString() || null,
      liquidityUtilization: pool.liquidityUtilization?.toString() || null,
      lpTokenBalance:
        lqItem.liquidityPositions?.[0]?.liquidityTokenBalance || null,
      daoFee: pool.daoFee?.toString() || null,
      virtualPrice: pool.virtualPrice?.toString() || null,
      poolType: (pool.poolType as 'plain' | 'meta') || 'plain',
      a: pool.a?.toString() || null,
      offpegFeeMultiplier: pool.offpegFeeMultiplier?.toString() || null,
    };

    curvePoolList.push(curvePool);
  }

  return curvePoolList;
}
