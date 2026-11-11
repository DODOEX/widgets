import { SystemApi } from '@dodoex/api';
import { t } from '@lingui/macro';
import { useMutation } from '@tanstack/react-query';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../../hooks/Submission/types';

export interface LpFeeRewardClaimData {
  claimContract?: string | null;
  claimableRewardRaw?: string | null;
  index?: number | null;
  proof?: string[] | null;
}

/**
 * Submits the Merkle distributor `claim` for the LP fee reward. Only valid when
 * `claimStatus === 'CLAIMABLE'`; the caller is responsible for gating on that.
 */
export function useClaimLpFeeRewardSubmit({
  reward,
  successBack,
}: {
  reward: LpFeeRewardClaimData | undefined;
  successBack?: () => void;
}) {
  const { account } = useWalletInfo();
  const submission = useSubmission();

  return useMutation({
    mutationFn: async () => {
      if (
        !account ||
        !reward?.claimContract ||
        reward.index == null ||
        !reward.claimableRewardRaw ||
        !reward.proof
      ) {
        return;
      }

      const params = SystemApi.encode.claimLpFeeReward({
        claimContract: reward.claimContract,
        index: reward.index,
        account,
        amount: reward.claimableRewardRaw,
        proof: reward.proof,
      });

      return submission.execute(
        t`Claim`,
        {
          opcode: OpCode.TX,
          ...params,
        },
        {
          metadata: {
            [MetadataFlag.claimLpFeeReward]: '1',
          },
          successBack,
        },
      );
    },
  });
}
