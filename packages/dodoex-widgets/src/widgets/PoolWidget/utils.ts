import { AMMV3Api, ChainId, ExcludeNone, PoolApi, PoolType } from '@dodoex/api';
import { contractRequests } from '../../constants/api';
import { TokenInfo } from '../../hooks/Token';
import { OperatePool } from './PoolOperate/types';
import {
  getUniswapV2FactoryContractAddressByChainId,
  getUniswapV2Router02ContractAddressByChainId,
} from '@dodoex/dodo-contract-request';

export const poolApi = new PoolApi({
  contractRequests,
});

export const ammV3Api = new AMMV3Api({
  contractRequests,
});

export type FetchLiquidityListLqList = ExcludeNone<
  ReturnType<
    Exclude<(typeof PoolApi.graphql.fetchLiquidityList)['__apiType'], undefined>
  >['liquidity_list']
>['lqList'];

export type FetchMyLiquidityListLqList = ExcludeNone<
  ReturnType<
    Exclude<
      (typeof PoolApi.graphql.fetchMyLiquidityList)['__apiType'],
      undefined
    >
  >['liquidity_list']
>['lqList'];

export type FetchMyCreateListLqList = ExcludeNone<
  ReturnType<
    Exclude<
      (typeof PoolApi.graphql.fetchDashboardPairList)['__apiType'],
      undefined
    >
  >['dashboard_pairs_list']
>['list'];

export type FetchPoolList = ExcludeNone<
  ReturnType<
    Exclude<(typeof PoolApi.graphql.fetchPoolList)['__apiType'], undefined>
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
    baseLpToken: {
      id: pair.baseLpToken?.id as string,
    },
    quoteLpToken: {
      id: pair.quoteLpToken?.id as string,
    },
    lpFeeRate: lqData?.pair?.lpFeeRate,
  };
}

export function convertFetchMyLiquidityToOperateData(
  lqData: ExcludeNone<FetchMyLiquidityListLqList>[0],
): OperatePool {
  const data = convertFetchLiquidityToOperateData(lqData);
  if (!data) {
    return undefined;
  }

  return {
    ...data,
    liquidityPositions: lqData?.liquidityPositions,
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
    baseLpToken: {
      id: pool.baseLpToken?.id as string,
      decimals: Number(pool.baseLpToken?.decimals ?? 18),
    },
    quoteLpToken: {
      id: pool.quoteLpToken?.id as string,
      decimals: Number(pool.quoteLpToken?.decimals ?? 18),
    },
  };
}

export function getPoolAMMOrPMM(type: PoolType) {
  switch (type) {
    case 'AMMV2':
      return 'AMM V2';
    case 'AMMV3':
      return 'AMM V3';
    default:
      return 'PMM';
  }
}

export function getIsAMMV2DynamicFeeContractByChainId(chainId: number) {
  return !!(
    getUniswapV2FactoryContractAddressByChainId(chainId) &&
    getUniswapV2Router02ContractAddressByChainId(chainId)
  );
}
