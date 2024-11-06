import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { MiningRewardTokenWithAprI } from '../../types';

export function useTotalRewardUSD({
  rewardTokenWithAprList,
}: {
  rewardTokenWithAprList: Array<
    Pick<MiningRewardTokenWithAprI, 'pendingReward' | 'usdPrice'>
  >;
}) {
  const totalRewardUSD = useMemo(() => {
    return rewardTokenWithAprList.reduce<BigNumber | undefined>(
      (previousValue, currentValue) => {
        const { usdPrice, pendingReward } = currentValue;
        if (pendingReward !== undefined && usdPrice !== undefined) {
          return (pendingReward ?? new BigNumber(0))
            .multipliedBy(usdPrice)
            .dp(4, BigNumber.ROUND_DOWN)
            .plus(previousValue ?? 0);
        }
        return previousValue;
      },
      undefined,
    );
  }, [rewardTokenWithAprList]);

  return totalRewardUSD;
}
