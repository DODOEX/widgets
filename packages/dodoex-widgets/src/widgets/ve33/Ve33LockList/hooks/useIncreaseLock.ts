import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../../hooks/Submission/spec';
import { useMessageState } from '../../../../hooks/useMessageState';
import {
  encodeVE33VotingEscrowIncreaseAmount,
  getVE33VotingEscrowContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import {
  ExecutionResult,
  MetadataFlag,
} from '../../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../../hooks/contract';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';

export function useIncreaesLock({
  refetch,
}: {
  refetch?: () => Promise<void> | void;
}) {
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  const { account, chainId } = useWalletInfo();
  return useMutation({
    mutationFn: async ({
      amount,
      tokenId,
    }: {
      amount: string;
      tokenId: number;
    }) => {
      const to = getVE33VotingEscrowContractAddressByChainId(chainId);
      try {
        if (!account || !to || !amount || !tokenId) {
          throw new Error('params is not valid.');
        }
        const data = encodeVE33VotingEscrowIncreaseAmount(tokenId, amount);
        const result = await submission.execute(
          t`Increase Lock`,
          {
            opcode: OpCode.TX,
            data,
            to,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.increaseVe33Lock]: true,
            },
          },
        );

        if (result !== ExecutionResult.Success) {
          return;
        }
      } catch (e) {
        useMessageState.getState().toast({
          message: `${t`Failed to Increase:`}${e ? `: ${e}` : ''}`,
          type: 'error',
        });
      }
      await updateBlockNumber();
      await refetch?.();
    },
  });
}
