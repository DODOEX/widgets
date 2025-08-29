import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../hooks/Submission/spec';
import { useMessageState } from '../../../hooks/useMessageState';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../hooks/contract';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { encodeVE33V2PairClaimFees } from '@dodoex/dodo-contract-request';

export function useVe33V2ClaimTradingFees({
  address,
  refetch,
}: {
  address?: string;
  refetch?: () => Promise<void> | void;
}) {
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  const { chainId, account } = useWalletInfo();
  return useMutation({
    mutationFn: async () => {
      if (chainId === undefined || !account) return;
      const to = address ?? '';
      try {
        if (!to) {
          throw new Error('pool address is undefined');
        }
        const data = await encodeVE33V2PairClaimFees();
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
              [MetadataFlag.claimTradingFeesVe33V2Position]: true,
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
