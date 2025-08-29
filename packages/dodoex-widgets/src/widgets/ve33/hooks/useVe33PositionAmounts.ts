import {
  getFetchVE33NonfungiblePositionManagerPositionsQueryOptions,
  getFetchVE33V3PairSlot0QueryOptions,
} from '@dodoex/dodo-contract-request';
import { useQuery } from '@tanstack/react-query';
import { convertPositionData } from '../Ve33PoolDetail/useVe33V3Positions';
import {
  getPositionAmount0,
  getPositionAmount1,
} from '../Ve33V3PoolOperate/utils/getPositionAmount';
import { Ve33PoolInfoI } from '../types';
import BigNumber from 'bignumber.js';

export function useVe33PositionAmounts({
  poolInfo,
  tokenId,
}: {
  poolInfo: Ve33PoolInfoI | undefined;
  tokenId: number | undefined;
}) {
  const { chainId } = poolInfo || {};
  const fetchPosition = useQuery(
    getFetchVE33NonfungiblePositionManagerPositionsQueryOptions(
      chainId,
      tokenId ? Number(tokenId) : undefined,
    ),
  );
  const existingPositionDetails = convertPositionData(fetchPosition.data);
  const fetchGlobalState = useQuery(
    getFetchVE33V3PairSlot0QueryOptions(poolInfo?.chainId, poolInfo?.id),
  );
  const tickCurrent =
    fetchGlobalState.data?.tick !== undefined
      ? Number(fetchGlobalState.data.tick)
      : undefined;
  const tickLower = existingPositionDetails
    ? Number(existingPositionDetails.tickLower)
    : undefined;
  const tickUpper = existingPositionDetails
    ? Number(existingPositionDetails.tickUpper)
    : undefined;
  const amount0 =
    existingPositionDetails && tickCurrent
      ? getPositionAmount0({
          tickCurrent,
          tickLower: tickLower!,
          tickUpper: tickUpper!,
          liquidity: existingPositionDetails?.liquidity?.toString() || '0',
          roundUp: false,
          sqrtRatioX96: fetchGlobalState.data?.sqrtPriceX96,
        })
      : null;
  const amount0Bg = amount0
    ? new BigNumber(amount0.toString()).div(10 ** poolInfo?.baseToken.decimals!)
    : null;
  const amount1 =
    existingPositionDetails && tickCurrent
      ? getPositionAmount1({
          tickCurrent,
          tickLower: tickLower!,
          tickUpper: tickUpper!,
          liquidity: existingPositionDetails?.liquidity?.toString() || '0',
          roundUp: false,
          sqrtRatioX96: fetchGlobalState.data?.sqrtPriceX96,
        })
      : null;
  const amount1Bg = amount1
    ? new BigNumber(amount1.toString()).div(
        10 ** poolInfo?.quoteToken.decimals!,
      )
    : null;

  const errorRefetch =
    fetchPosition.isError || fetchGlobalState.isError
      ? () => {
          if (fetchGlobalState.isError) {
            fetchGlobalState.refetch();
          }
          if (fetchPosition.isError) {
            fetchPosition.refetch();
          }
        }
      : undefined;

  return {
    liquidity: existingPositionDetails?.liquidity,
    isLoading: fetchGlobalState.isLoading || fetchPosition.isLoading,
    tickCurrent,
    tickLower,
    tickUpper,
    sqrtPriceX96: fetchGlobalState.data?.sqrtPriceX96,
    amount0Bg,
    amount1Bg,
    refetch: () => {
      fetchGlobalState.refetch();
      fetchPosition.refetch();
    },
    errorRefetch,
  };
}
