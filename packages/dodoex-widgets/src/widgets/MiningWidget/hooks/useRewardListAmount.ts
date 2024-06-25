import { useQueries } from '@tanstack/react-query';
import { FetchMiningListItem } from '../types';
import { miningApi } from '../helper';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

export function useRewardListAmount({
  miningItem,
}: {
  miningItem: FetchMiningListItem;
}) {
  const { account } = useWeb3React();
  const rewardList = miningItem?.rewardTokenInfos ?? [];

  const queryInfo = [] as Array<{
    address: string;
    symbol: string;
    decimals: number;
    usdPrice: string;
  }>;
  const queries = [] as Array<
    ReturnType<typeof miningApi.getPendingRewardQuery>
  >;

  if (miningItem) {
    const version = miningItem.version;
    const miningContractAddress = miningItem.miningContractAddress ?? '';
    rewardList.forEach((rewardToken) => {
      const queryItem = {
        address: rewardToken?.address ?? '',
        decimals: rewardToken?.decimals as number,
        symbol: rewardToken?.symbol ?? '',
        usdPrice: rewardToken?.price ?? '',
      };
      if (version !== '3') {
        switch (miningItem.type) {
          case 'classical':
            queryInfo.push(queryItem);
            queries.push(
              miningApi.getPendingRewardQuery(
                miningItem.chainId,
                miningContractAddress,
                account,
                miningItem.baseLpToken?.address ?? '',
                queryItem.decimals,
                '2',
              ),
            );
            queryInfo.push(queryItem);
            queries.push(
              miningApi.getPendingRewardQuery(
                miningItem.chainId,
                miningContractAddress,
                account,
                miningItem.quoteLpToken?.address ?? '',
                queryItem.decimals,
                '2',
              ),
            );
            break;
          case 'vdodo':
          case 'single':
            queryInfo.push(queryItem);
            queries.push(
              miningApi.getPendingRewardQuery(
                miningItem.chainId,
                miningContractAddress,
                account,
                miningItem.baseToken?.address ?? '',
                queryItem.decimals,
                '2',
              ),
            );
            break;

          default:
            throw new Error(`type: ${miningItem.type} is not valid.`);
        }
        return;
      }

      queryInfo.push(queryItem);
      queries.push(
        miningApi.getPendingRewardQuery(
          miningItem.chainId,
          miningContractAddress,
          account,
          queryItem.address,
          queryItem.decimals,
          version,
        ),
      );
    });
  }

  const rewardQueries = useQueries({
    queries,
    combine: (results) => {
      let totalReward = new BigNumber(0);
      let totalRewardUSD = new BigNumber(0);
      const data = results.map((result, index) => {
        const query = queryInfo[index];
        const amount = result.data;
        if (amount) {
          totalReward = amount.plus(totalReward);
          const usdPrice = query?.usdPrice;
          if (usdPrice) {
            totalRewardUSD = totalRewardUSD.plus(amount.times(usdPrice));
          }
        }
        return {
          ...query,
          amount,
        };
      });
      return {
        data,
        pending: results.some((result) => result.isPending),
        error: results.some((result) => result.isError),
        totalReward,
        totalRewardUSD,
      };
    },
  });

  return rewardQueries;
}
