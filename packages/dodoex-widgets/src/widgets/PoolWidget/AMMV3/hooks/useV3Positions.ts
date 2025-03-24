import { ChainId } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { useRaydiumSDKContext } from '../../../../hooks/raydium-sdk-V2/RaydiumSDKContext';
import { clmmConfigMap } from '../../../../hooks/raydium-sdk-V2/common/programId';

export function useV3Positions(chainId: ChainId) {
  const raydium = useRaydiumSDKContext();

  const allPositionQuery = useQuery({
    queryKey: ['clmm', 'getOwnerPositionInfo', chainId, raydium?.owner],
    enabled: chainId != null && raydium != null && raydium.owner != null,
    queryFn: async () => {
      if (!raydium || !raydium.owner || !chainId) {
        return null;
      }

      const clmmConfig = clmmConfigMap[chainId];
      if (!clmmConfig) {
        throw new Error('Invalid config');
      }

      try {
        const allPosition = await raydium.clmm.getOwnerPositionInfo({
          programId: clmmConfig.programId,
        });

        allPosition.forEach((p) => {
          console.log(
            'getOwnerPositionInfo p',
            p.poolId.toBase58(),
            p.rewardInfos,
            p.tokenFeesOwedA.toString(),
            p.tokenFeesOwedB.toString(),
            p.nftMint.toBase58(),
            p.liquidity.toString(),
            p.tickLower,
            p.tickUpper,
          );
          // p.rewardInfos.forEach((r) => {
          //   console.log(
          //     'getOwnerPositionInfo r',
          //     r.rewardAmountOwed.toString(),
          //     r.growthInsideLastX64.toString(),
          //   );
          // });
        });

        return {
          allPosition,
        };
      } catch (error) {
        console.error('getOwnerPositionInfo error', error);
        return null;
      }
    },
  });

  return {
    loading: allPositionQuery.isLoading,
    positions: allPositionQuery.data?.allPosition,
  };
}
