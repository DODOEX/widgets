import { useMemo } from 'react';
import { useMiningList } from './useMiningList';

export function useMiningItem({
  miningContractAddress,
  poolAddress,
  account,
  chainId,
}: {
  miningContractAddress?: string;
  poolAddress?: string;
  account: string | undefined;
  chainId: number;
}) {
  const chainIds = useMemo(() => [chainId], [chainId]);
  const { miningList, error, loading, refetch } = useMiningList({
    isEnded: undefined,
    account,
    searchText: miningContractAddress,
    chainIds,
  });

  const miningItem = useMemo(() => {
    return miningList.find(
      (m) =>
        m.id ===
        `${chainId}-${poolAddress?.toLowerCase()}-${miningContractAddress?.toLowerCase()}`.toLowerCase(),
    );
  }, [chainId, miningContractAddress, miningList, poolAddress]);

  return { miningItem, error, loading, refetch };
}
