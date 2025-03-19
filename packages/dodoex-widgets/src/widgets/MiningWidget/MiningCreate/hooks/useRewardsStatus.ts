import { useMemo } from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import useFetchTokens from '../../../../hooks/contract/useFetchTokens';
import { useGetTokenStatus } from '../../../../hooks/Token/useGetTokenStatus';
import { RewardStatus } from '../types';
import { StateProps } from './reducers';

export function useRewardsStatus({
  rewards,
}: {
  rewards: StateProps['rewards'];
}) {
  const { chainId, account } = useWalletInfo();

  const { getApprovalState, getPendingRest, submitApprove, getMaxBalance } =
    useGetTokenStatus({
      account,
      chainId,
    });

  const needQueryTokens = useMemo(
    () => rewards.map((reward) => reward.token).filter((item) => !!item),
    [rewards],
  );

  const tokenInfoMap = useFetchTokens({
    tokenList: needQueryTokens,
  });

  const rewardsStatus: RewardStatus[] = useMemo(
    () =>
      rewards.map((reward) => {
        const tokenInfo = reward.token
          ? tokenInfoMap.get(`${reward.token.chainId}-${reward.token.address}`)
          : undefined;
        const balance = tokenInfo?.balance ?? null;
        const allowance = tokenInfo?.allowance ?? null;
        return {
          pendingReset:
            reward && reward.token
              ? getPendingRest(reward.token, allowance)
              : undefined,
          state:
            reward && reward.token
              ? getApprovalState(
                  reward.token,
                  reward.total || '',
                  balance,
                  allowance,
                )
              : undefined,
          balance,
        };
      }),
    [rewards, getApprovalState, getPendingRest, tokenInfoMap],
  );

  return {
    rewardsStatus,
    submitApprove,
    getMaxBalance,
  };
}
