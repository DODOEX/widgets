import { BigNumber } from '@ethersproject/bignumber';
import { useQuery } from '@tanstack/react-query';
import {
  CONTRACT_QUERY_COMMON_KEY,
  encodeNonfungiblePositionManagerAlgebraCollect,
  getFetchNonfungiblePositionManagerAlgebraOwnerOfQueryOptions,
  getNonfungiblePositionManagerAlgebraContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { ChainId } from '@dodoex/api';
import { useInitContractRequest } from '../../../../providers/useInitContractRequest';

// compute current + counterfactual fees for a v3 position
export function useAlgebraPositionFees({
  chainId,
  tokenId,
}: {
  chainId: ChainId;
  tokenId: string;
}) {
  const fetchOwner = useQuery(
    getFetchNonfungiblePositionManagerAlgebraOwnerOfQueryOptions(
      chainId,
      Number(tokenId),
    ),
  );
  const contractRequest = useInitContractRequest();

  const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1).toString();
  const fetchCollect = useQuery({
    queryKey: [
      CONTRACT_QUERY_COMMON_KEY,
      'fetchNonfungiblePositionManagerAlgebraCollect',
      fetchOwner.data,
    ],
    enabled: !!fetchOwner.data,
    queryFn: async () => {
      if (!fetchOwner.data) {
        throw new Error('owner is undefined');
      }
      const to =
        getNonfungiblePositionManagerAlgebraContractAddressByChainId(chainId);
      const data = encodeNonfungiblePositionManagerAlgebraCollect({
        tokenId,
        recipient: fetchOwner.data,
        amount0Max: MAX_UINT128,
        amount1Max: MAX_UINT128,
      });
      return await contractRequest.batchCall<{
        amount0: bigint;
        amount1: bigint;
      }>(chainId, to, data, [
        { internalType: 'uint256', name: 'amount0', type: 'uint256' },
        { internalType: 'uint256', name: 'amount1', type: 'uint256' },
      ]);
    },
  });

  return {
    data: fetchCollect.data,
    isLoading: fetchOwner.isLoading || fetchCollect.isLoading,
    isError: fetchOwner.isError || fetchCollect.isError,
    errorRefetch: () => {
      if (fetchOwner.isError) {
        fetchOwner.refetch();
      }
      if (fetchCollect.isError) {
        fetchCollect.refetch();
      }
    },
  };
}
