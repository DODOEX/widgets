import { useMemo } from 'react';
import { TabMiningI } from '../../types';
import { getMiningStatusByTimestamp } from '../../hooks/utils';
import { MiningStatusE } from '@dodoex/api';

export function useStatusAndStartBlockNumber({
  miningItem,
}: {
  miningItem: TabMiningI;
}) {
  const { miningMinings, type } = miningItem;
  const miningStatusList = useMemo(() => {
    return miningMinings.map(({ rewardTokenList }) => {
      return getMiningStatusByTimestamp({
        rewardTokenInfoList: rewardTokenList,
      });
    });
  }, [miningMinings]);

  const status = useMemo(() => {
    if (type !== 'classical') {
      return miningStatusList[0].status;
    }

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
    return status;
  }, [miningStatusList, type]);

  return {
    status,
    miningStatusList,
  };
}
