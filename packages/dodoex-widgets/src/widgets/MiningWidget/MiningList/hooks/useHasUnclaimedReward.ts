import { useMemo } from 'react';
import { MiningRewardTokenWithAprI } from '../../types';

export function useHasUnclaimedReward({
  rewardTokenWithAprList,
}: {
  rewardTokenWithAprList: Array<
    Pick<MiningRewardTokenWithAprI, 'pendingReward'>
  >;
}) {
  return useMemo(() => {
    return (
      rewardTokenWithAprList.findIndex(({ pendingReward }) =>
        pendingReward?.gt(0),
      ) >= 0
    );
  }, [rewardTokenWithAprList]);
}
