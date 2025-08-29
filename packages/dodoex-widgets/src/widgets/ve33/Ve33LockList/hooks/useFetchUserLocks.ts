import { useQuery } from '@tanstack/react-query';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';
import { PoolApi } from '@dodoex/api';
import React from 'react';
import {
  getFetchVE33VotingEscrowTokenQueryOptions,
  getFetchVE33VotingEscrowUserPointHistoryQueryOptions,
} from '@dodoex/dodo-contract-request';
import { tokenApi } from '../../../../constants/api';
import { byWei } from '../../../../utils';

export function useFetchUserLocks({
  account,
  chainId,
}: {
  account: string | undefined;
  chainId?: number;
}) {
  const grahqlRequest = useGraphQLRequests();
  const fetchUserLocks = useQuery({
    enabled: !!account,
    // ...grahqlRequest.getQuery(PoolApi.graphql.fetchVe33UserLocks, {
    //   where: {
    //     user: account?.toLocaleLowerCase() ?? '',
    //   },
    // }),
    queryKey: ['test1'],
    queryFn: async () => {
      return {
        ve33_getUserLock: [
          {
            id: '3',
            value: '1000000000000000000',
            votingPower: '0',
            lockedEnd: '1756339200',
            isPermanent: false,
            isVoted: false,
          },
          {
            id: '4',
            value: '1000000000000000000',
            votingPower: '0',
            lockedEnd: '1759968000',
            isPermanent: false,
            isVoted: false,
          },
        ],
      };
    },
  });
  // const fetchTokenAddress = useQuery(
  //   getFetchVE33VotingEscrowTokenQueryOptions(chainId),
  // );
  const tokenQuery = useQuery({
    // ...tokenApi.getFetchTokenQuery(chainId, fetchTokenAddress.data, account),
    queryKey: ['test2'],
    queryFn: () => {
      return {
        address: '0x42EDf453F8483c7168c158d28D610A58308517D1',
        symbol: 'MOMO',
        decimals: 18,
        name: 'MOMO',
        chainId,
      };
    },
  });

  const userLocks = React.useMemo(() => {
    const token = tokenQuery.data;
    return fetchUserLocks.data?.ve33_getUserLock?.map((item) => {
      return {
        tokenId: Number(item?.id!),
        value: token ? byWei(item?.value, token?.decimals).toString() : '',
        votingPower: item?.votingPower ?? '',
        lockedEnd: Number(item?.lockedEnd + '000'),
        isPermanent: !!item?.isPermanent,
        isVoted: !!item?.isVoted,
        chainId: token?.chainId,
        token,
      };
    });
  }, [fetchUserLocks.data, tokenQuery.data]);

  return {
    ...fetchUserLocks,
    userLocks,
  };
}

export type Lock = NonNullable<
  ReturnType<typeof useFetchUserLocks>['userLocks']
>['0'];

export type Point = Awaited<
  ReturnType<
    ReturnType<
      typeof getFetchVE33VotingEscrowUserPointHistoryQueryOptions
    >['queryFn']
  >
>;
