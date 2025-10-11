import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../hooks/Submission/spec';
import { useMessageState } from '../../../hooks/useMessageState';
import {
  encodeVE33V2BribeVotingRewardNotifyRewardAmount,
  encodeVE33V3BribeVotingRewardNotifyRewardAmount,
  getVE33V2BribeVotingRewardContractAddressByChainId,
  getVE33V3BribeVotingRewardContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../hooks/contract';
import { PoolTypeE } from '../types';
import { TokenInfo } from '../../../hooks/Token';
import { toWei } from '../../../utils';
import { basicTokenMap } from '@dodoex/api';
import { ChainId } from '@dodoex/api';

export function useAddIncentive({
  refetch,
}: {
  refetch?: () => Promise<void> | void;
}) {
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  return useMutation({
    mutationFn: async ({
      chainId,
      token,
      amount,
      type,
    }: {
      chainId: number;
      token: TokenInfo;
      amount: string;
      type: PoolTypeE;
    }) => {
      const isV2 = type === PoolTypeE.Pool;
      const to = isV2
        ? getVE33V2BribeVotingRewardContractAddressByChainId(chainId)
        : getVE33V3BribeVotingRewardContractAddressByChainId(chainId);
      try {
        if (!token || !amount) {
          throw new Error('params is not valid.');
        }
        const amountWei = toWei(amount, token.decimals);
        const amountWeiStr = amountWei.toString();
        const basicToken = basicTokenMap[chainId as ChainId];
        let data = '';
        if (isV2) {
          data = encodeVE33V2BribeVotingRewardNotifyRewardAmount(
            token.address,
            amountWeiStr,
          );
        } else {
          data = encodeVE33V3BribeVotingRewardNotifyRewardAmount(
            token.address,
            amountWeiStr,
          );
        }
        const result = await submission.execute(
          t`Add incentive`,
          {
            opcode: OpCode.TX,
            data,
            to,
            value:
              token.address.toLowerCase() === basicToken.address.toLowerCase()
                ? amountWeiStr
                : '0x0',
          },
          {
            metadata: {
              [MetadataFlag.addIncentive]: true,
            },
          },
        );

        if (result !== ExecutionResult.Success) {
          return;
        }
      } catch (e) {
        useMessageState.getState().toast({
          message: `${t`Failed to Add incentive:`}${e ? `: ${e}` : ''}`,
          type: 'error',
        });
      }
      await updateBlockNumber();
      await refetch?.();
    },
  });
}
