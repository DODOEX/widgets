import { SwapApi } from '@dodoex/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { convertFetchTokenToTokenInfo } from '../../utils/token';
import { TokenInfo } from '../Token';
import { useGraphQLRequests } from '../useGraphQLRequests';

type OrderList = NonNullable<
  NonNullable<
    ReturnType<
      NonNullable<
        (typeof SwapApi.graphql.cross_chain_swap_zetachain_swapOrderList)['__apiType']
      >
    >['cross_chain_swap_zetachain_swapOrderList']
  >['list']
>;

export function useTradeSwapOrderList({
  account,
  limit = 5,
}: {
  account: string | undefined;
  limit?: number;
}) {
  // TODO: need replace
  const getSafeHashDetailUrl:
    | undefined
    | ((safeTxHash: string, chainId: number, account: string) => string) =
    undefined;
  const graphQLRequests = useGraphQLRequests();

  const query = graphQLRequests.getInfiniteQuery(
    SwapApi.graphql.cross_chain_swap_zetachain_swapOrderList,
    'page',
    {
      where: {
        userAddress: account?.toLowerCase(),
        pageSize: limit,
      },
    },
  );
  const result = useInfiniteQuery({
    ...query,
    enabled: !!account,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page: currentPage, count: total } =
        lastPage.cross_chain_swap_zetachain_swapOrderList ?? {
          page: 0,
          count: 0,
        };
      if (!currentPage || !total) return null;
      if (currentPage * limit >= total) return null;
      return currentPage + 1;
    },
  });

  const orderList =
    result.data?.pages
      ?.reduce((prev, current) => {
        const data =
          current.cross_chain_swap_zetachain_swapOrderList?.list ?? [];
        return [...prev, ...data];
      }, [] as OrderList)
      ?.map((item) => {
        let safeTxUrl = '';
        const safeTxHash = (item?.extra?.safeTxHash ?? undefined) as
          | string
          | undefined;
        if (safeTxHash && getSafeHashDetailUrl && account) {
          // @ts-ignore
          safeTxUrl = getSafeHashDetailUrl(
            safeTxHash,
            item?.chainId as number,
            account,
          );
        }
        return {
          hash: item?.hash ?? '',
          fromToken: convertFetchTokenToTokenInfo(
            {
              address: item?.fromTokenAddress ?? '',
              decimals: item?.fromTokenDecimals as number,
              symbol: item?.fromTokenSymbol ?? '',
              name: item?.fromTokenSymbol ?? '',
            },
            item?.chainId as number,
          ) as TokenInfo,
          toToken: convertFetchTokenToTokenInfo(
            {
              address: item?.toTokenAddress ?? '',
              decimals: item?.toTokenDecimals as number,
              symbol: item?.toTokenSymbol ?? '',
              name: item?.toTokenSymbol ?? '',
            },
            item?.chainId as number,
          ) as TokenInfo,
          fromAmount:
            item?.fromAmount && !!String(item.fromTokenDecimals)
              ? new BigNumber(item.fromAmount).div(
                  10 ** (item.fromTokenDecimals as number),
                )
              : null,
          toAmount: item?.toAmount ?? '',
          minAmount: item?.minAmount ?? '',
          fromTokenPrice: item?.fromTokenPrice ?? '',
          toTokenPrice: item?.toTokenPrice ?? '',
          createdAt: item?.createdAt ?? '',
          routeData: item?.extra?.routeData ?? '',
          safeTxHash,
          safeTxUrl,
          status: item?.status ?? '',
          transactionHash: item?.extra?.transactionHash as string,
        };
      }) ?? [];

  return {
    ...result,
    orderList,
  };
}
