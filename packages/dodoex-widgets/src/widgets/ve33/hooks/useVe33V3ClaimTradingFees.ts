import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../hooks/Submission';
import { t } from '@lingui/macro';
import { OpCode } from '../../../hooks/Submission/spec';
import { useMessageState } from '../../../hooks/useMessageState';
import {
  encodeVE33NonfungiblePositionManagerCollect,
  getVE33NonfungiblePositionManagerContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
import { useFetchBlockNumber } from '../../../hooks/contract';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { toHex } from '../Ve33V3PoolOperate/utils/calldata';
import JSBI from 'jsbi';

const MaxUint128 = toHex(
  JSBI.subtract(
    JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
    JSBI.BigInt(1),
  ),
);

export function useVe33V3ClaimTradingFees({
  tokenId,
  refetch,
}: {
  tokenId?: number;
  refetch?: () => Promise<void> | void;
}) {
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  const { chainId, account } = useWalletInfo();
  return useMutation({
    mutationFn: async () => {
      if (chainId === undefined || !account) return;
      const to =
        getVE33NonfungiblePositionManagerContractAddressByChainId(chainId);
      try {
        if (!tokenId) {
          throw new Error('tokenId is undefined');
        }
        const data = await encodeVE33NonfungiblePositionManagerCollect({
          tokenId,
          recipient: account,
          amount0Max: MaxUint128,
          amount1Max: MaxUint128,
        });
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
              [MetadataFlag.claimTradingFeesVe33V3Position]: true,
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
