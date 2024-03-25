import { PoolApi, ExcludeNone, PoolType } from '@dodoex/api';
import { contractRequests } from '../../constants/api';
import { ChainId } from '../../constants/chains';
import { TokenInfo } from '../../hooks/Token';
import { OperatePool } from './PoolOperate/types';

export const poolApi = new PoolApi({
  contractRequests,
});

export type FetchLiquidityListLqList = ExcludeNone<
  ReturnType<
    Exclude<typeof PoolApi.graphql.fetchLiquidityList['__apiType'], undefined>
  >['liquidity_list']
>['lqList'];

export type FetchPoolList = ExcludeNone<
  ReturnType<
    Exclude<typeof PoolApi.graphql.fetchPoolList['__apiType'], undefined>
  >['pairs']
>;

export function convertLiquidityTokenToTokenInfo(
  token:
    | {
        id: string;
        symbol: string;
        name: string;
        decimals: number;
        logoImg?: string | null;
      }
    | undefined,
  chainId: ChainId | number,
) {
  if (!token) return token;
  return {
    chainId: chainId,
    address: token.id,
    name: token.name,
    decimals: Number(token.decimals),
    symbol: token.symbol,
    logoURI: token.logoImg ?? '',
  } as TokenInfo;
}

export function convertFetchLiquidityToOperateData(
  lqData: ExcludeNone<FetchLiquidityListLqList>[0],
): OperatePool {
  const pair = lqData?.pair;
  if (!pair) return undefined;
  return {
    address: pair.id,
    chainId: pair.chainId,
    baseToken: convertLiquidityTokenToTokenInfo(
      pair.baseToken,
      pair.chainId,
    ) as TokenInfo,
    quoteToken: convertLiquidityTokenToTokenInfo(
      pair.quoteToken,
      pair.chainId,
    ) as TokenInfo,
    type: pair.type as PoolType,
    creator: pair.creator,
    lpFeeRate: pair.lpFeeRate,
  };
}
export function convertFetchPoolToOperateData(
  pool: FetchPoolList[0],
  chainId: number,
): OperatePool {
  if (!pool) return undefined;
  return {
    address: pool.id,
    chainId: chainId,
    baseToken: convertLiquidityTokenToTokenInfo(
      pool.baseToken,
      chainId,
    ) as TokenInfo,
    quoteToken: convertLiquidityTokenToTokenInfo(
      pool.quoteToken,
      chainId,
    ) as TokenInfo,
    type: pool.type as PoolType,
    creator: pool.creator,
    lpFeeRate: pool.lpFeeRate,
  };
}
