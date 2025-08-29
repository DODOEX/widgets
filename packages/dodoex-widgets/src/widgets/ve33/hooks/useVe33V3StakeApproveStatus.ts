import {
  encodeVE33NonfungiblePositionManagerApprove,
  getFetchVE33NonfungiblePositionManagerGetApprovedQueryOptions,
  getVE33NonfungiblePositionManagerContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { t } from '@lingui/macro';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { MetadataFlag, ExecutionResult } from '../../../hooks/Submission/types';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { Ve33PoolInfoI } from '../types';
import { useFetchBlockNumber } from '../../../hooks/contract';
import { useMessageState } from '../../../hooks/useMessageState';

export default function useVe33V3StakeApproveStatus({
  poolInfo,
  tokenId,
}: {
  poolInfo: Ve33PoolInfoI | undefined;
  tokenId: number | undefined;
}) {
  const fetchStakeApproved = useQuery(
    getFetchVE33NonfungiblePositionManagerGetApprovedQueryOptions(
      poolInfo?.chainId,
      tokenId,
    ),
  );
  const submission = useSubmission();
  const { updateBlockNumber } = useFetchBlockNumber();
  const approveTitle = t`Approve ${poolInfo?.baseToken?.symbol}-${poolInfo?.quoteToken.symbol} LP`;
  const submitStakeApproveMutation = useMutation({
    mutationFn: async () => {
      if (!poolInfo || tokenId === undefined) {
        return;
      }
      try {
        const to = getVE33NonfungiblePositionManagerContractAddressByChainId(
          poolInfo?.chainId,
        );
        if (!to) {
          throw new Error(
            'VE33 Nonfungible Position Manager contract address not found',
          );
        }
        const spender = poolInfo.gaugeAddress;
        const data = await encodeVE33NonfungiblePositionManagerApprove(
          spender,
          tokenId,
        );
        const result = await submission.execute(
          approveTitle,
          {
            opcode: OpCode.TX,
            data,
            to,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.approve]: true,
            },
          },
        );

        if (result !== ExecutionResult.Success) {
          return;
        }
      } catch (e) {
        console.error(e);
        useMessageState.getState().toast({
          message: `${t`Failed to Approve:`}${e ? `: ${e}` : ''}`,
          type: 'error',
        });
      }
      await updateBlockNumber();
      await fetchStakeApproved.refetch();
    },
  });

  const needApprove =
    fetchStakeApproved.data?.toLowerCase() !==
    poolInfo?.gaugeAddress?.toLowerCase();
  const stakeTokenStatus = {
    isApproving: submitStakeApproveMutation.isPending,
    needApprove,
    needShowTokenStatusButton: needApprove,
    loading: fetchStakeApproved.isLoading,
    approveTitle,
    submitApprove: () => submitStakeApproveMutation.mutateAsync(),
  } as ReturnType<typeof useTokenStatus>;

  return stakeTokenStatus;
}
