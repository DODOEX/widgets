import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../../hooks/Submission/spec';
import { useMessageState } from '../../../../hooks/useMessageState';
import {
  encodeVE33V2GaugeGetReward,
  encodeVE33VotingEscrowCreateLock,
  getVE33VotingEscrowContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import {
  ExecutionResult,
  MetadataFlag,
} from '../../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../../hooks/contract';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { toWei } from '../../../../utils';

export function useCreateLock({
  amount,
  decimals,
  symbol,
  lockDuration,
  refetch,
}: {
  amount: string;
  decimals: number | undefined;
  symbol?: string;
  lockDuration: number;
  refetch?: () => Promise<void> | void;
}) {
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  const { account, chainId } = useWalletInfo();
  return useMutation({
    mutationFn: async () => {
      const to = getVE33VotingEscrowContractAddressByChainId(chainId);
      try {
        if (!account || !to || decimals === undefined || !symbol) {
          throw new Error('params is not valid.');
        }
        const amountWei = toWei(amount, decimals).toString();
        const data = encodeVE33VotingEscrowCreateLock(amountWei, lockDuration);
        const result = await submission.execute(
          t`Lock` + ` ${symbol}`,
          {
            opcode: OpCode.TX,
            data,
            to,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.createVe33Lock]: true,
            },
          },
        );

        if (result !== ExecutionResult.Success) {
          return;
        }
      } catch (e) {
        useMessageState.getState().toast({
          message: `${t`Failed to Create:`}${e ? `: ${e}` : ''}`,
          type: 'error',
        });
      }
      await updateBlockNumber();
      await refetch?.();
    },
  });
}
