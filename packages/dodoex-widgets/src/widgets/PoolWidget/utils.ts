import { PoolApi, ExcludeNone } from '@dodoex/api';
import { ChainId } from '../../constants/chains';
import { TokenInfo } from '../../hooks/Token';
import { PoolOperateProps } from './PoolOperate';

export const poolApi = new PoolApi();

export type FetchLiquidityListLqList = ExcludeNone<
  ReturnType<
    Exclude<typeof PoolApi.fetchLiquidityList['__apiType'], undefined>
  >['liquidity_list']
>['lqList'];

/** Actually more than that, but the api has filtering */
export type LqPoolType = 'DPP' | 'DVM' | 'DSP' | 'CLASSICAL';

export function convertLiquidityTokenToTokenInfo(
  token:
    | {
        id: string;
        symbol: string;
        name: string;
        decimals: number;
        usdPrice: number;
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
    decimals: token.decimals,
    symbol: token.symbol,
    logoURI: token.logoImg ?? '',
  } as TokenInfo;
}

export function hasQuoteApy(type: string): boolean {
  return ['CLASSICAL', 'DPP'].includes(type);
}

export function canOperatePool(
  account: string | undefined,
  {
    owner,
    creator,
    type,
  }: {
    owner?: string | null;
    creator?: string | null;
    type?: LqPoolType;
  },
): boolean {
  const actuallyOwner = owner ?? creator;
  return (
    type !== 'DPP' ||
    !!(
      account &&
      actuallyOwner &&
      actuallyOwner.toLocaleLowerCase() === account.toLocaleLowerCase()
    )
  );
}

export function convertFetchLiquidityToOperateData(
  lqData: ExcludeNone<FetchLiquidityListLqList>[0],
): PoolOperateProps['pool'] {
  const pair = lqData?.pair;
  if (!pair) return undefined;
  return {
    address: pair.id,
    chainId: pair.chainId,
    baseToken: convertLiquidityTokenToTokenInfo(pair.baseToken, pair.chainId),
    quoteToken: convertLiquidityTokenToTokenInfo(pair.quoteToken, pair.chainId),
  };
}
