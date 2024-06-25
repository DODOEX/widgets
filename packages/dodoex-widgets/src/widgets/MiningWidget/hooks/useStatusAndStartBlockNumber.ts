import { MiningApi, MiningStatusE } from '@dodoex/api';
import { useMemo } from 'react';
import { FetchMiningListItem } from '../types';

export function useStatusAndStartBlockNumber({
  miningItem,
}: {
  miningItem: FetchMiningListItem;
}) {
  let status = MiningStatusE.active;
  let miningStatusList = [] as Array<
    ReturnType<typeof MiningApi.utils.getMiningStatusByTimestamp>
  >;

  if (miningItem?.rewardTokenInfos) {
    if (miningItem.type !== 'classical') {
      const result = MiningApi.utils.getMiningStatusByTimestamp({
        startTime: miningItem.startTime ?? '',
        endTime: miningItem.endTime ?? '',
        rewardTokenInfoList: miningItem.rewardTokenInfos.map((rewardToken) => ({
          startTime: rewardToken?.startTime ?? '',
          endTime: rewardToken?.endTime ?? '',
        })),
      });
      status = result.status;
      miningStatusList.push(result);
    } else if (miningItem.rewardQuoteTokenInfos) {
      miningStatusList = [
        miningItem.rewardTokenInfos,
        miningItem.rewardQuoteTokenInfos,
      ].map((rewardTokenInfos) =>
        MiningApi.utils.getMiningStatusByTimestamp({
          startTime: miningItem.startTime ?? '',
          endTime: miningItem.endTime ?? '',
          rewardTokenInfoList: rewardTokenInfos.map((rewardToken) => ({
            startTime: rewardToken?.startTime ?? '',
            endTime: rewardToken?.endTime ?? '',
          })),
        }),
      );

      const [{ status: baseLpTokenStatus }, { status: quoteLpTokenStatus }] =
        miningStatusList;
      let status = MiningStatusE.active;
      if (
        (baseLpTokenStatus === MiningStatusE.upcoming &&
          quoteLpTokenStatus === MiningStatusE.upcoming) ||
        (baseLpTokenStatus === MiningStatusE.upcoming &&
          quoteLpTokenStatus === MiningStatusE.ended) ||
        (baseLpTokenStatus === MiningStatusE.ended &&
          quoteLpTokenStatus === MiningStatusE.upcoming)
      ) {
        status = MiningStatusE.upcoming;
      }
      if (
        baseLpTokenStatus === MiningStatusE.ended &&
        quoteLpTokenStatus === MiningStatusE.ended
      ) {
        status = MiningStatusE.ended;
      }
    }
  }

  return {
    status,
    miningStatusList,
  };
}
