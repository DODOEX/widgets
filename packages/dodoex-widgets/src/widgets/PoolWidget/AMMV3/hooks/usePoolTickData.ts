import {
  AMMV3Api,
  ChainId,
  chainIdShortNameEnum,
  chainIdToShortName,
  CLMM,
  TickData,
  Ticks,
} from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../../hooks/Token/type';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';
import { FeeAmount, TICK_SPACINGS } from '../sdks/v3-sdk/constants';
import { getTickPrice } from '../utils/getTickPrice';
import { PoolState, usePool } from './usePool';

const PRICE_FIXED_DIGITS = 8;

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tick: number;
  liquidityActive: number;
  liquidityNet: number;
  price0: string;
  sdkPrice: BigNumber | undefined;
}

const getActiveTick = (
  tickCurrent: number | undefined,
  feeAmount: FeeAmount | undefined,
) =>
  tickCurrent && feeAmount
    ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) *
      TICK_SPACINGS[feeAmount]
    : undefined;

const MAX_TICK_FETCH_VALUE = 1000;

function usePaginatedTickQuery(
  poolAddress: string | null,
  skip = 0,
  chainId: ChainId,
) {
  const graphQLRequests = useGraphQLRequests();

  const query = graphQLRequests.getQuery(AMMV3Api.graphql.AllV3TicksDocument, {
    skip,
    first: MAX_TICK_FETCH_VALUE,
    where: {
      chain: chainId
        ? chainIdToShortName[chainId]
        : chainIdShortNameEnum.SOON_TESTNET,
      poolAddress: poolAddress ?? '',
      pairType: CLMM,
    },
  });

  const result = useQuery({
    ...query,
    enabled: !!poolAddress,
  });
  return result;
}

// Fetches all ticks for a given pool
function useAllV3Ticks(
  poolAddress: string | null,
  chainId: ChainId,
): {
  isLoading: boolean;
  error: unknown;
  ticks?: TickData[];
} {
  const [skipNumber, setSkipNumber] = useState(0);
  const [tickData, setTickData] = useState<Ticks>([]);
  const { data, error, isLoading } = usePaginatedTickQuery(
    poolAddress,
    skipNumber,
    chainId,
  );
  const ticks: Ticks = data?.amm_getTicksData.ticks as Ticks;

  useEffect(() => {
    if (ticks?.length) {
      setTickData((tickData) => [...tickData, ...ticks]);
      if (ticks?.length === MAX_TICK_FETCH_VALUE) {
        setSkipNumber((skipNumber) => skipNumber + MAX_TICK_FETCH_VALUE);
      }
    }
  }, [ticks]);

  return {
    isLoading: isLoading || ticks?.length === MAX_TICK_FETCH_VALUE,
    error,
    ticks: tickData,
  };
}

export function usePoolActiveLiquidity(
  mint1: Maybe<TokenInfo>,
  mint2: Maybe<TokenInfo>,
  feeAmount: FeeAmount | undefined,
  chainId?: ChainId,
): {
  isLoading: boolean;
  error: any;
  data?: TickProcessed[];
} {
  const { chainId: defaultChainId } = useWalletInfo();
  const [poolState, poolInfo, poolId] = usePool(
    mint1?.address,
    mint2?.address,
    feeAmount,
    defaultChainId,
  );

  const currentTick = poolInfo?.computePoolInfo?.tickCurrent;
  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(
    () => getActiveTick(currentTick, feeAmount),
    [currentTick, feeAmount],
  );

  const { isLoading, error, ticks } = useAllV3Ticks(
    poolId,
    chainId ?? defaultChainId,
  );

  return useMemo(() => {
    if (
      !mint1 ||
      !mint2 ||
      activeTick === undefined ||
      poolState !== PoolState.EXISTS ||
      !ticks ||
      ticks.length === 0 ||
      isLoading
    ) {
      return {
        isLoading: isLoading || poolState === PoolState.LOADING,
        error,
        activeTick,
        data: undefined,
      };
    }

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot =
      ticks.findIndex(
        (tickData) => tickData?.tickIdx && tickData.tickIdx > activeTick,
      ) - 1;

    if (pivot < 0) {
      // consider setting a local error
      console.log(
        'usePoolTickData',
        'usePoolActiveLiquidity',
        'TickData pivot not found',
        {
          mint1: mint1.address,
          mint2: mint2.address,
          chainId: mint1.chainId,
        },
      );
      return {
        isLoading,
        error,
        activeTick,
        data: undefined,
      };
    }

    const sdkPrice = getTickPrice({
      decimalsA: mint1.decimals,
      decimalsB: mint2.decimals,
      tick: activeTick,
    });
    const activeTickProcessed: TickProcessed = {
      liquidityActive: poolInfo?.computePoolInfo?.liquidity.toNumber() ?? 0,
      tick: activeTick,
      liquidityNet:
        Number(ticks[pivot]?.tickIdx) === activeTick
          ? Number(ticks[pivot]?.liquidityNet ?? 0)
          : 0,
      price0: sdkPrice?.toFixed(PRICE_FIXED_DIGITS) ?? '',
      sdkPrice,
    };

    const subsequentTicks: TickProcessed[] = [];
    // const subsequentTicks = computeSurroundingTicks(
    //   token0,
    //   token1,
    //   activeTickProcessed,
    //   ticks,
    //   pivot,
    //   true,
    // );

    const previousTicks: TickProcessed[] = [];
    // const previousTicks = computeSurroundingTicks(
    //   token0,
    //   token1,
    //   activeTickProcessed,
    //   ticks,
    //   pivot,
    //   false,
    // );

    const ticksProcessed = previousTicks
      .concat(activeTickProcessed)
      .concat(subsequentTicks);

    return {
      isLoading,
      error,
      data: ticksProcessed,
    };
  }, [
    activeTick,
    error,
    isLoading,
    mint1,
    mint2,
    poolInfo?.computePoolInfo?.liquidity,
    poolState,
    ticks,
  ]);
}
