import { SwapApi } from '@dodoex/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useGraphQLRequests } from '../useGraphQLRequests';
import { useTokenState } from '../useTokenState';
import { generateBridgeStep } from '../Bridge/utils';

type OrderList = NonNullable<
  NonNullable<
    ReturnType<
      NonNullable<
        (typeof SwapApi.graphql.cross_chain_swap_zetachain_orderList)['__apiType']
      >
    >['cross_chain_swap_zetachain_orderList']
  >['list']
>;

export function useCrossSwapOrderList({
  account,
  limit = 5,
  type,
}: {
  account: string | undefined;
  limit?: number;
  type?: 'error_refund';
}) {
  const { tokenList } = useTokenState();
  const graphQLRequests = useGraphQLRequests();

  const query = graphQLRequests.getInfiniteQuery(
    SwapApi.graphql.cross_chain_swap_zetachain_orderList,
    'page',
    {
      where: {
        user: account,
        pageSize: limit,
        type,
      },
    },
  );
  const result = useInfiniteQuery({
    ...query,
    enabled: !!account,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page: currentPage, count: total } =
        lastPage.cross_chain_swap_zetachain_orderList ?? {
          page: 0,
          count: 0,
        };
      if (!currentPage || !total) return null;
      if (currentPage * limit >= total) return null;
      return currentPage + 1;
    },
  });

  const orderList = useMemo(() => {
    const orderList =
      result.data?.pages
        ?.reduce((prev, current) => {
          const data = current.cross_chain_swap_zetachain_orderList?.list ?? [];
          return [...prev, ...data];
        }, [] as OrderList)
        ?.map((item) => {
          const fromToken = tokenList.find(
            (token) =>
              token.address.toLowerCase() ===
                item?.fromTokenAddress?.toLowerCase() &&
              token.chainId === item?.fromChainId,
          );
          const toToken = tokenList.find(
            (token) =>
              token.address.toLowerCase() ===
                item?.toTokenAddress?.toLowerCase() &&
              token.chainId === item?.toChainId,
          );
          const fromAmount =
            item?.fromAmount && fromToken
              ? new BigNumber(item.fromAmount)
                  .div(10 ** fromToken.decimals)
                  .dp(fromToken.decimals, BigNumber.ROUND_DOWN)
              : null;
          const toAmount =
            item?.toAmount && toToken
              ? new BigNumber(item.toAmount)
                  .div(10 ** toToken.decimals)
                  .dp(toToken.decimals, BigNumber.ROUND_DOWN)
              : null;

          return {
            hash: item?.fromHash,
            fromToken,
            toToken,
            fromAmount,
            toAmount,
            createdAt: item?.createdAt,
            fromAddress: item?.fromAddress,
            toAddress: item?.toAddress,
            routeData: {
              fromChainId: item?.fromChainId,
              toChainId: item?.toChainId,
              step: generateBridgeStep({
                omniPlan: item?.omniPlan,
                tokenList,
              }),
            },
            fees: item?.fees,
            // pending\success\failure_revert\abort
            status: item?.status,
            transactionHash: item?.fromHash,
            fromTokenPrice:
              fromAmount && toAmount && fromToken
                ? toAmount
                    .div(fromAmount)
                    .dp(fromToken.decimals, BigNumber.ROUND_DOWN)
                    .toString()
                : null,
            toTokenPrice:
              fromAmount && toAmount && toToken
                ? fromAmount
                    .div(toAmount)
                    .dp(toToken.decimals, BigNumber.ROUND_DOWN)
                    .toString()
                : null,
          };
        }) ?? [];

    return orderList;
  }, [result.data?.pages, tokenList]);

  return {
    ...result,
    orderList,
  };
}
