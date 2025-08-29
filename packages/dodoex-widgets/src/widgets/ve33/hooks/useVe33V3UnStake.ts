import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../hooks/Submission/spec';
import { useMessageState } from '../../../hooks/useMessageState';
import { encodeVE33V3GaugeWithdraw } from '@dodoex/dodo-contract-request';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../hooks/contract';

export function useVe33V3UnStake({
  tokenId,
  gaugeAddress,
  refetch,
}: {
  tokenId?: number;
  gaugeAddress?: string;
  refetch?: () => Promise<void> | void;
}) {
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  return useMutation({
    mutationFn: async () => {
      const to = gaugeAddress || '';
      try {
        if (!tokenId) {
          throw new Error('tokenId is undefined');
        }
        const data = await encodeVE33V3GaugeWithdraw(tokenId);
        const result = await submission.execute(
          t`UnStake`,
          {
            opcode: OpCode.TX,
            data,
            to,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.unStakeVe33V3Position]: true,
            },
          },
        );

        if (result !== ExecutionResult.Success) {
          return;
        }
      } catch (e) {
        useMessageState.getState().toast({
          message: `${t`Failed to unStake:`}${e ? `: ${e}` : ''}`,
          type: 'error',
        });
      }
      await updateBlockNumber();
      await refetch?.();
    },
  });
}
