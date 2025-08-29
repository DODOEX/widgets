import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../../hooks/Submission/spec';
import { useMessageState } from '../../../../hooks/useMessageState';
import {
  encodeVE33VotingEscrowIncreaseUnlockTime,
  encodeVE33VotingEscrowLockPermanent,
  getVE33VotingEscrowContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import {
  ExecutionResult,
  MetadataFlag,
} from '../../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../../hooks/contract';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';

export function useExtendLock({
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
      lockDuration,
    }: {
      tokenId: number;
      lockDuration: number;
    }) => {
      const to = getVE33VotingEscrowContractAddressByChainId(chainId);
      try {
        if (!account || !to || !tokenId) {
          throw new Error('params is not valid.');
        }
        let data = '';
        if (lockDuration) {
          data = encodeVE33VotingEscrowIncreaseUnlockTime(
            tokenId,
            lockDuration,
          );
        } else {
          data = encodeVE33VotingEscrowLockPermanent(tokenId);
        }
        const result = await submission.execute(
          t`Extend Lock`,
          {
            opcode: OpCode.TX,
            data,
            to,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.extendVe33Lock]: true,
            },
          },
        );

        if (result !== ExecutionResult.Success) {
          return;
        }
      } catch (e) {
        useMessageState.getState().toast({
          message: `${t`Failed to Extend:`}${e ? `: ${e}` : ''}`,
          type: 'error',
        });
      }
      await updateBlockNumber();
      await refetch?.();
    },
  });
}
