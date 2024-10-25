import { useQuery } from '@tanstack/react-query';
import { ChainId, PoolApi, PoolType } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { poolApi } from '../../utils';
import { TokenInfo } from '../../../../hooks/Token';
import { getLpToTokenBalance } from '../../hooks/usePoolBalanceInfo';
import {
  formatReadableNumber,
  formatUnknownTokenSymbol,
} from '../../../../utils';
import { useFetchFiatPrice } from '../../../../hooks/Swap';
import { ThegraphKeyMap } from '../../../../constants/chains';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';

type TmpUser = {
  id: string;
  baseSupplied: BigNumber;
  quoteSupplied: BigNumber;
};

export type LpItem = {
  userId: string;
  baseSupplied: string;
  quoteSupplied: string;
  baseTokenSymbol: string;
  baseTokenAddress: string;
  quoteTokenSymbol: string;
  quoteTokenAddress: string;
  sharePercentage: string;
  dollarValue: string;
  dollarValueBN: BigNumber;
};

function errorRefetchProcess(
  queryResult: Array<{
    error: Error | null;
    refetch: () => void;
  }>,
) {
  const errorRefetchs: Array<() => void> = [];
  queryResult.forEach((result) => {
    if (result.error) {
      errorRefetchs.push(result.refetch);
    }
  });
  if (!errorRefetchs.length) return undefined;
  return () => {
    errorRefetchs.forEach((refetch) => refetch());
  };
}

function loadingProcess(
  queryResult: Array<{
    isLoading: boolean;
  }>,
) {
  return queryResult.some((result) => result.isLoading);
}

export function useLiquidityProviders({
  pool,
}: {
  pool:
    | {
        chainId: number;
        address: string;
        type: PoolType;
        baseToken: TokenInfo;
        quoteToken: TokenInfo;
      }
    | null
    | undefined;
}) {
  const { chainId, address, type, baseToken, quoteToken } = pool || {};
  const id = address ?? '';
  const chain = chainId ? ThegraphKeyMap[chainId as ChainId] : '';
  const baseDecimals = baseToken?.decimals;
  const quoteDecimals = quoteToken?.decimals;

  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      chainId as number,
      address,
      type,
      baseToken?.decimals,
      quoteToken?.decimals,
    ),
  );
  const midPrice = pmmStateQuery.data?.midPrice;

  const totalBaseLpQuery = useQuery(
    poolApi.getTotalBaseLpQuery(chainId, address, type, baseDecimals),
  );
  const totalQuoteLpQuery = useQuery(
    poolApi.getTotalBaseLpQuery(chainId, address, type, quoteDecimals),
  );
  const reserveQuery = useQuery(
    poolApi.getReserveLpQuery(
      chainId,
      address,
      type,
      baseDecimals,
      quoteDecimals,
    ),
  );
  const classicalTargetQuery = useQuery(
    poolApi.getClassicalTargetQuery(
      chainId,
      address,
      type,
      baseDecimals,
      quoteDecimals,
    ),
  );
  const totalBaseLpBalance = totalBaseLpQuery.data;
  const totalQuoteLpBalance = totalQuoteLpQuery.data;
  const { baseReserve, quoteReserve } = reserveQuery.data || {};
  const classicalBaseTarget = classicalTargetQuery.data?.baseTarget;
  const classicalQuoteTarget = classicalTargetQuery.data?.quoteTarget;

  const fiatPriceQuery = useFetchFiatPrice({
    fromToken: baseToken ?? null,
    toToken: quoteToken ?? null,
  });

  const graphQLRequests = useGraphQLRequests();
  const fetchPositionsQuery = useQuery({
    ...graphQLRequests.getQuery(PoolApi.graphql.fetchLiquidityPositions, {
      id,
      where: {
        pair: id,
        liquidityTokenBalance_not: '0',
        chain,
      },
      miningWhere: {
        pair: id,
        liquidityTokenInMining_not: '0',
        chain,
      },
      first: 1000,
      orderBy: 'liquidityTokenBalance',
      orderDirection: 'desc',
    }),
    enabled: !!address,
  });

  const { balance, mining, pair } = fetchPositionsQuery.data ?? {};
  let newLpList: Array<LpItem> = [];
  if (balance && mining && pair && fiatPriceQuery.toFiatPrice) {
    const { baseLpToken, quoteLpToken } = pair;

    const userMap = new Map<string, TmpUser>();
    const baseLpEqQuoteLp = baseLpToken?.id === quoteLpToken?.id;

    for (const lp of balance) {
      const { id, liquidityTokenBalance } = lp;
      const liquidityTokenBalanceBN = new BigNumber(liquidityTokenBalance ?? 0);
      const [userId, lpId] = id.split('-');

      let newUser: TmpUser = {
        id: userId,
        baseSupplied: new BigNumber(0),
        quoteSupplied: new BigNumber(0),
      };

      if (userMap.has(newUser.id)) {
        newUser = userMap.get(newUser.id) as TmpUser;
      } else {
        userMap.set(newUser.id, newUser);
      }

      const [, baseSupplied] = getLpToTokenBalance(
        liquidityTokenBalanceBN,
        totalBaseLpBalance,
        baseReserve,
        classicalBaseTarget,
        address,
        type,
        baseDecimals,
      );
      if (baseSupplied && (baseLpEqQuoteLp || lpId === baseLpToken?.id)) {
        newUser.baseSupplied = baseSupplied;
      }
      const [, quoteSupplied] = getLpToTokenBalance(
        liquidityTokenBalanceBN,
        totalQuoteLpBalance,
        quoteReserve,
        classicalQuoteTarget,
        address,
        type,
        quoteDecimals,
      );
      if (quoteSupplied && (baseLpEqQuoteLp || lpId === quoteLpToken?.id)) {
        newUser.quoteSupplied = quoteSupplied;
      }
    }

    for (const mine of mining) {
      const { id, liquidityTokenInMining } = mine;
      const liquidityTokenInMiningBN = new BigNumber(
        liquidityTokenInMining ?? 0,
      );
      const [userId, lpId] = id.split('-');

      const [, baseSupplied] = getLpToTokenBalance(
        liquidityTokenInMiningBN,
        totalBaseLpBalance,
        baseReserve,
        classicalBaseTarget,
        address,
        /** Mining does not require judging the type */
        undefined,
        baseDecimals,
      );
      const [, quoteSupplied] = getLpToTokenBalance(
        liquidityTokenInMiningBN,
        totalQuoteLpBalance,
        quoteReserve,
        classicalQuoteTarget,
        address,
        /** Mining does not require judging the type */
        undefined,
        quoteDecimals,
      );
      if (userMap.has(userId)) {
        const existedUser = userMap.get(userId) as TmpUser;
        if (baseSupplied && (baseLpEqQuoteLp || lpId === baseLpToken?.id)) {
          existedUser.baseSupplied = baseSupplied.plus(
            existedUser.baseSupplied,
          );
        }
        if (quoteSupplied && (baseLpEqQuoteLp || lpId === quoteLpToken?.id)) {
          existedUser.quoteSupplied = quoteSupplied.plus(
            existedUser.quoteSupplied,
          );
        }
      } else {
        const newUser: TmpUser = {
          id: userId,
          baseSupplied: new BigNumber(0),
          quoteSupplied: new BigNumber(0),
        };
        if (baseSupplied) {
          newUser.baseSupplied = baseSupplied;
        }
        if (quoteSupplied) {
          newUser.quoteSupplied = quoteSupplied;
        }
        userMap.set(newUser.id, newUser);
      }
    }

    const baseShowDecimals = (baseToken?.decimals ?? 0 > 6) ? 6 : 4;
    const quoteShowDecimals = (quoteToken?.decimals ?? 0 > 6) ? 6 : 4;
    const quoteTokenPrice = fiatPriceQuery.toFiatPrice;
    userMap.forEach((user) => {
      newLpList.push({
        userId: user.id,
        baseSupplied: user.baseSupplied
          ? formatReadableNumber({
              input: user.baseSupplied,
              showDecimals: baseShowDecimals,
            })
          : '0',
        quoteSupplied: user.quoteSupplied
          ? formatReadableNumber({
              input: user.quoteSupplied,
              showDecimals: quoteShowDecimals,
            })
          : '0',
        baseTokenAddress: baseToken?.address ?? '',
        quoteTokenAddress: quoteToken?.address ?? '',
        baseTokenSymbol: formatUnknownTokenSymbol(baseToken),
        quoteTokenSymbol: formatUnknownTokenSymbol(quoteToken),
        sharePercentage:
          midPrice && baseReserve
            ? formatReadableNumber({
                input: midPrice
                  .multipliedBy(user.baseSupplied || 0)
                  .plus(user.quoteSupplied || 0)
                  .div(
                    midPrice.multipliedBy(baseReserve).plus(quoteReserve ?? 0),
                  )
                  .multipliedBy(100),
                showDecimals: 2,
              })
            : '',
        dollarValue:
          quoteTokenPrice === null || !midPrice
            ? '-'
            : `$${formatReadableNumber({
                input: midPrice
                  .multipliedBy(user.baseSupplied || 0)
                  .plus(user.quoteSupplied || 0)
                  .multipliedBy(quoteTokenPrice),
                showDecimals: 2,
              })}`,
        dollarValueBN: midPrice
          ? midPrice
              .multipliedBy(user.baseSupplied || 0)
              .plus(user.quoteSupplied || 0)
          : BigNumber(0),
      });
    });
    newLpList.sort((a, b) => (b.dollarValueBN.gt(a.dollarValueBN) ? 1 : -1));
  }

  const queryList = [
    pmmStateQuery,
    totalBaseLpQuery,
    totalQuoteLpQuery,
    classicalTargetQuery,
    reserveQuery,
    fiatPriceQuery,
    fetchPositionsQuery,
  ];
  const errorRefetch = errorRefetchProcess(queryList);
  const isLoading = loadingProcess(queryList);

  return {
    ...fetchPositionsQuery,
    isLoading,
    errorRefetch,

    list: newLpList,
  };
}
