import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../../hooks/Submission/spec';
import { useMessageState } from '../../../../hooks/useMessageState';
import {
  encodeVE33VotingEscrowTransferFrom,
  getVE33VotingEscrowContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import {
  ExecutionResult,
  MetadataFlag,
} from '../../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../../hooks/contract';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';

export function useTransferLock({
  refetch,
}: {
  refetch?: () => Promise<void> | void;
}) {
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  const { account, chainId } = useWalletInfo();
  return useMutation({
    mutationFn: async ({
      tokenId,
      fromAddress,
      toAddress,
    }: {
      tokenId: number;
      fromAddress: string;
      toAddress: string;
    }) => {
      const to = getVE33VotingEscrowContractAddressByChainId(chainId);
      try {
        if (!account || !to || !tokenId || !fromAddress || !toAddress) {
          throw new Error('params is not valid.');
        }
        const data = encodeVE33VotingEscrowTransferFrom(
          fromAddress,
          toAddress,
          tokenId,
        );
        const result = await submission.execute(
          t`Transfer Lock`,
          {
            opcode: OpCode.TX,
            data,
            to,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.transferVe33Lock]: true,
            },
          },
        );

        if (result !== ExecutionResult.Success) {
          return;
        }
      } catch (e) {
        useMessageState.getState().toast({
          message: `${t`Failed to Transfer:`}${e ? `: ${e}` : ''}`,
          type: 'error',
        });
      }
      await updateBlockNumber();
      await refetch?.();
    },
  });
}
