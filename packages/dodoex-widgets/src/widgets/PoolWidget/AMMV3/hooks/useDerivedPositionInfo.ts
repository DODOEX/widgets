import {
  PositionInfoLayout,
  PositionUtils,
  TickUtils,
} from '@raydium-io/raydium-sdk-v2';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useRaydiumSDKContext } from '../../../../hooks/raydium-sdk-V2/RaydiumSDKContext';
import { usePoolFromPoolId } from './usePool';

export function useDerivedPositionInfo({
  position,
}: {
  position: ReturnType<typeof PositionInfoLayout.decode> | undefined;
}) {
  const raydium = useRaydiumSDKContext();

  const [, pool] = usePoolFromPoolId(
    position ? position.poolId.toBase58() : null,
  );

  const { data } = useQuery({
    queryKey: ['clmm', 'getPositionInfo', position, pool?.poolInfo],
    enabled: !!position && !!pool?.poolInfo,
    queryFn: async () => {
      const poolInfo = pool?.poolInfo;
      if (!poolInfo || !raydium || !position) {
        return null;
      }
      /** get position pooled amount and price range */
      const priceLower = TickUtils.getTickPrice({
        poolInfo,
        tick: position.tickLower,
        baseIn: true,
      });
      const priceUpper = TickUtils.getTickPrice({
        poolInfo,
        tick: position.tickUpper,
        baseIn: true,
      });
      const epochInfo = await raydium.connection.getEpochInfo();
      const { amountA, amountB } = PositionUtils.getAmountsFromLiquidity({
        poolInfo,
        ownerPosition: position,
        liquidity: position.liquidity,
        slippage: 0,
        add: false,
        epochInfo,
      });
      const [pooledAmountA, pooledAmountB] = [
        new BigNumber(amountA.amount.toString()).div(
          10 ** poolInfo.mintA.decimals,
        ),
        new BigNumber(amountB.amount.toString()).div(
          10 ** poolInfo.mintB.decimals,
        ),
      ];

      return {
        pooledAmountA,
        pooledAmountB,
        priceLower: new BigNumber(priceLower.price.toString()),
        priceUpper: new BigNumber(priceUpper.price.toString()),
      };
    },
  });

  return {
    pool,
    positionInfo: data ?? null,
  };
}
