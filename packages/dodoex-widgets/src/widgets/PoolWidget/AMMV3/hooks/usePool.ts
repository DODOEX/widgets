import { ChainId } from '@dodoex/api';
import { Clmm } from '@raydium-io/raydium-sdk-v2';
import { useQuery } from '@tanstack/react-query';
import { useRaydiumSDKContext } from '../../../../hooks/raydium-sdk-V2/RaydiumSDKContext';
import { FeeAmount, computePoolAddress } from '../sdks/v3-sdk';
import { useMemo } from 'react';

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export type PoolInfo = Awaited<ReturnType<Clmm['getPoolInfoFromRpc']>>;

export function usePool(
  mint1Address: string | undefined,
  mint2Address: string | undefined,
  feeAmount: FeeAmount | undefined,
  chainId: ChainId,
): [PoolState, PoolInfo | null, id: string | null] {
  const raydium = useRaydiumSDKContext();

  const id = useMemo(() => {
    if (!mint1Address || !mint2Address || !feeAmount) {
      return null;
    }

    const poolAddress = computePoolAddress({
      mint1Address,
      mint2Address,
      feeAmount,
      chainId,
    }).toBase58();

    return poolAddress;
  }, [chainId, feeAmount, mint1Address, mint2Address]);

  const poolInfoQuery = useQuery({
    queryKey: ['clmm', 'poolInfo', ...arguments],
    enabled: id != null && raydium != null,
    queryFn: async () => {
      if (!raydium || !id) {
        return null;
      }

      const { poolInfo, poolKeys, computePoolInfo, tickData } =
        await raydium.clmm.getPoolInfoFromRpc(id);

      console.log('poolInfo', poolInfo);
      console.log('poolKeys', poolKeys);
      console.log('computePoolInfo', computePoolInfo);
      console.log('tickData', tickData);

      return {
        poolInfo,
        poolKeys,
        computePoolInfo,
        tickData,
      };
    },
  });

  if (poolInfoQuery.isLoading) {
    return [PoolState.LOADING, null, id];
  }

  if (poolInfoQuery.isError) {
    return [PoolState.INVALID, null, id];
  }

  if (!poolInfoQuery.data) {
    return [PoolState.NOT_EXISTS, null, id];
  }

  return [PoolState.EXISTS, poolInfoQuery.data, id];
}
