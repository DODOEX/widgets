import { ChainId } from '@dodoex/api';
import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import { useV3Positions } from './useV3Positions';

export function useV3PositionFromNFTMint({
  chainId,
  nftMint,
  poolId,
}: {
  chainId: ChainId;
  nftMint: string;
  poolId: string;
}) {
  const allPosition = useV3Positions(chainId);

  const position = useMemo(() => {
    if (!allPosition.positions) {
      return undefined;
    }
    return allPosition.positions.find(
      (p) =>
        p.nftMint.equals(new PublicKey(nftMint)) &&
        p.poolId.equals(new PublicKey(poolId)),
    );
  }, [allPosition, nftMint, poolId]);

  return { position, loading: allPosition.loading };
}
