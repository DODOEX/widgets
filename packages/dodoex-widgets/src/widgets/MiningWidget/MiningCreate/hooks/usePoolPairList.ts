import { ChainId, ExcludeNone, PoolApi } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ThegraphKeyMap } from '../../../../constants/chains';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';

export type FetchPoolList = ExcludeNone<
  ReturnType<
    Exclude<(typeof PoolApi.graphql.fetchPoolPairList)['__apiType'], undefined>
  >['basePairs']
>;

export const usePoolPairList = ({
  baseAddress,
  quoteAddress,
  poolAddress,
  isMyPool,
  skip,
}: {
  baseAddress?: string;
  quoteAddress?: string;
  poolAddress?: string;
  isMyPool?: boolean;
  skip?: boolean;
}) => {
  const { account, chainId } = useWalletInfo();

  const [poolList, setPoolList] = useState<FetchPoolList>([]);
  const chain = chainId ? ThegraphKeyMap[chainId as ChainId] : '';

  const onlyBase = poolAddress || (!baseAddress && !quoteAddress);

  const graphQLRequests = useGraphQLRequests();
  const { data, isPending, isLoading } = useQuery({
    ...graphQLRequests.getQuery(PoolApi.graphql.fetchPoolPairList, {
      baseWhere: {
        baseToken: poolAddress ? undefined : baseAddress,
        quoteToken: poolAddress ? undefined : quoteAddress,
        creator: isMyPool ? account : undefined,
        chain,
        id: poolAddress,
        type_in: ['DVM', 'DSP', 'GSP'],
      },
      quoteWhere: {
        baseToken: onlyBase ? '1' : quoteAddress,
        quoteToken: baseAddress,
        creator: isMyPool ? account : undefined,
        chain,
        type_in: ['DVM', 'DSP', 'GSP'],
      },
      first: 50,
    }),
    enabled: !skip,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    setPoolList([...data.basePairs, ...data.quotePairs]);
  }, [data]);

  return {
    loading: isLoading,
    datas: poolList,
  };
};
