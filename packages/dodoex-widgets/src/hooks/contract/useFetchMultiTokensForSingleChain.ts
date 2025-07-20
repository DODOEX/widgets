import { CONTRACT_QUERY_KEY, TokenApi } from '@dodoex/api';
import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { TokenInfo, TokenList } from '../Token';
import { useGraphQLRequests } from '../useGraphQLRequests';

type TokenInfoMap = Map<
  string,
  {
    balance: BigNumber;
    allowance: BigNumber;
  }
>;

/**
 *
 * 类似于 useFetchTokens
 * 该方法用于查询单个 EVM 链上的多个 token 的余额，用于 TokenPicker 的 token 列表查询
 * @param tokenList 需要查询的 token 列表，单一链
 * @returns
 */
export default function useFetchMultiTokensForSingleChain({
  chainId,
  tokenList,
  blockNumber,
  skip,
}: {
  chainId: number;
  tokenList: TokenList;
  blockNumber?: number;
  skip?: boolean;
}) {
  const { getAppKitAccountByChainId, chainId: currentChainId } =
    useWalletInfo();
  const graphQLRequests = useGraphQLRequests();

  const account = useMemo(() => {
    return getAppKitAccountByChainId(chainId);
  }, [chainId, getAppKitAccountByChainId]);

  const tokenListChunks = useMemo(() => {
    // Split tokenAddresses into chunks of 1000
    const chunkSize = 500;
    const chunks: TokenInfo[][] = [];
    for (let i = 0; i < tokenList.length; i += chunkSize) {
      chunks.push(tokenList.slice(i, i + chunkSize));
    }
    return chunks;
  }, [tokenList]);

  const tokensQueries = useQueries({
    queries: tokenListChunks.map((chunk) => {
      const userAddress = account?.appKitAccount.address;
      const tokenAddresss = chunk.map((token) => token.address);
      return {
        ...graphQLRequests.getQuery(TokenApi.graphql.token_info_balances, {
          data: {
            chainId,
            userAddress,
            tokenAddresss,
          },
        }),
        queryKey: [
          CONTRACT_QUERY_KEY,
          'token',
          'getFetchTokenQuery',
          chainId,
          userAddress,
          tokenAddresss,
        ],
        enabled: !!userAddress && tokenAddresss.length > 0,
      };
    }),
    combine: (results) => {
      const tokenBalanceMap = new Map() as TokenInfoMap;
      results.forEach((result) => {
        if (result && result.data && result.data.token_info_balances) {
          const { token_info_balances } = result.data;
          if (token_info_balances.tokens) {
            tokenList.forEach((t) => {
              if (
                Object.prototype.hasOwnProperty.call(
                  token_info_balances.tokens,
                  t.address,
                )
              ) {
                const tokenAmountResult = token_info_balances.tokens[t.address];
                if (tokenAmountResult) {
                  const divisor = new BigNumber(10).pow(
                    tokenAmountResult.decimals as string,
                  );
                  const raw = {
                    balance: new BigNumber(tokenAmountResult.balance).div(
                      divisor,
                    ),
                    allowance: new BigNumber(0),
                  };
                  tokenBalanceMap.set(`${t.chainId}-${t.address}`, raw);
                }
              }
            });
          }
        }
      });
      return {
        data: tokenBalanceMap,
        pending: results.some((result) => result.isPending),
      };
    },
  });

  return tokensQueries.data;
}
