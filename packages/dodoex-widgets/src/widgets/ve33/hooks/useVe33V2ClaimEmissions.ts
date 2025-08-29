import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../hooks/Submission/spec';
import { useMessageState } from '../../../hooks/useMessageState';
import { encodeVE33V2GaugeGetReward } from '@dodoex/dodo-contract-request';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../hooks/contract';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';

export function useVe33V2ClaimEmissions({
  gaugeAddress,
  refetch,
}: {
  gaugeAddress?: string;
  refetch?: () => Promise<void> | void;
}) {
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  const { account } = useWalletInfo();
  return useMutation({
    mutationFn: async () => {
      const to = gaugeAddress || '';
      try {
        if (!account) {
          throw new Error('account is undefined');
        }
        const data = await encodeVE33V2GaugeGetReward(account);
        const result = await submission.execute(
          t`Claim`,
          {
            opcode: OpCode.TX,
            data,
            to,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.claimEmissionsVe33V2Position]: true,
            },
          },
        );

        if (result !== ExecutionResult.Success) {
          return;
        }
      } catch (e) {
        useMessageState.getState().toast({
          message: `${t`Failed to Claim:`}${e ? `: ${e}` : ''}`,
          type: 'error',
        });
      }
      await updateBlockNumber();
      await refetch?.();
    },
  });
}
