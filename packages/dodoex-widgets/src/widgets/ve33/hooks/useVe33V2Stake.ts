import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../hooks/Submission/spec';
import { useMessageState } from '../../../hooks/useMessageState';
import { encodeVE33V2GaugeDeposit2 } from '@dodoex/dodo-contract-request';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../hooks/contract';

export function useVe33V2Stake({
  amount,
  gaugeAddress,
  refetch,
}: {
  amount: string;
  gaugeAddress?: string;
  refetch?: () => Promise<void> | void;
}) {
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  return useMutation({
    mutationFn: async () => {
      const to = gaugeAddress || '';
      try {
        const data = await encodeVE33V2GaugeDeposit2(amount);
        const result = await submission.execute(
          t`Stake`,
          {
            opcode: OpCode.TX,
            data,
            to,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.stakeVe33V2Position]: true,
            },
          },
        );

        if (result !== ExecutionResult.Success) {
          return;
        }
      } catch (e) {
        useMessageState.getState().toast({
          message: `${t`Failed to Stake:`}${e ? `: ${e}` : ''}`,
          type: 'error',
        });
      }
      await updateBlockNumber();
      await refetch?.();
    },
  });
}
