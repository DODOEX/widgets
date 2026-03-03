import { useQuery } from '@tanstack/react-query';
import { getFetchCPGetSettleResultQueryOptions } from '@dodoex/dodo-contract-request';
import { formatFixed } from '@ethersproject/bignumber';
import { PmmModelParams } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { poolApi } from '../../../PoolWidget/utils';

export function solveQuadraticFunctionForTarget(
  V1: BigNumber,
  delta: BigNumber,
  i: BigNumber,
  k: BigNumber,
): BigNumber {
  if (delta.isZero()) {
    return V1;
  }
  if (k.isZero()) {
    return V1.plus(i.times(delta));
  }
  const V0V0V1V2 = V1.times(V1).plus(V1.times(delta).times(k).times(4));
  const numerator = V0V0V1V2.sqrt().minus(V1);
  const denominator = k.times(2);
  return i.times(numerator).div(denominator);
}

interface UseCPPmmStateParams {
  chainId: number;
  poolAddress?: string;
  totalBase?: number;
  baseDecimals?: number;
  quoteDecimals?: number;
  isSettled?: boolean;
}

export function useCPPmmState({
  chainId,
  poolAddress,
  totalBase,
  baseDecimals,
  quoteDecimals,
  isSettled = false,
}: UseCPPmmStateParams) {
  // For unsettled CP pools, get settle result
  const { data: settleResult, isLoading: settleResultLoading } = useQuery({
    ...getFetchCPGetSettleResultQueryOptions(chainId, poolAddress),
    enabled:
      !isSettled &&
      !!poolAddress &&
      !!baseDecimals &&
      !!quoteDecimals &&
      totalBase !== undefined,
  });

  // For settled CP pools (DVM), get PMM state
  const dvmPmmStateQueryConfig = poolApi.getPMMStateQuery(
    chainId,
    poolAddress,
    'DVM', // Settled CP becomes DVM
    baseDecimals,
    quoteDecimals,
  );
  const { data: dvmPmmState, isLoading: dvmPmmStateLoading } = useQuery({
    ...dvmPmmStateQueryConfig,
    enabled: isSettled && dvmPmmStateQueryConfig.enabled,
  });

  const pmmStateFromSettleResult = useMemo(() => {
    if (
      isSettled ||
      !settleResult ||
      !baseDecimals ||
      !quoteDecimals ||
      totalBase === undefined
    ) {
      return undefined;
    }

    const unUsedBase = parseFloat(
      formatFixed(settleResult.unUsedBase, baseDecimals),
    );
    let poolBase: number;
    let poolQuote: number;
    let poolI: number;
    let isReturn: boolean;

    if (unUsedBase > totalBase / 2) {
      // 反向
      poolQuote = parseFloat(formatFixed(settleResult.poolBase, baseDecimals));
      poolBase = parseFloat(formatFixed(settleResult.poolQuote, quoteDecimals));
      poolI = parseFloat(
        formatFixed(settleResult.poolI, 18 - quoteDecimals + baseDecimals),
      );
      isReturn = true;
    } else {
      poolBase = parseFloat(formatFixed(settleResult.poolBase, baseDecimals));
      poolQuote = parseFloat(
        formatFixed(settleResult.poolQuote, quoteDecimals),
      );
      poolI = parseFloat(
        formatFixed(settleResult.poolI, 18 - baseDecimals + quoteDecimals),
      );
      isReturn = false;
    }

    const B0 = parseFloat(
      solveQuadraticFunctionForTarget(
        new BigNumber(poolBase),
        new BigNumber(poolQuote),
        new BigNumber(1).div(poolI),
        new BigNumber(1),
      ).toString(),
    );

    const pmm: PmmModelParams = {
      i: poolI,
      k: 1,
      b: poolBase,
      q: poolQuote,
      b0: B0,
      q0: 0,
      R: 1,
    };

    return { pmm, isReturn };
  }, [settleResult, baseDecimals, quoteDecimals, totalBase, isSettled]);

  const pmmStateFromDVM = useMemo(() => {
    if (!isSettled || !dvmPmmState?.pmmParamsBG) {
      return undefined;
    }

    const { pmmParamsBG } = dvmPmmState;
    const pmm: PmmModelParams = {
      i: pmmParamsBG.i.toNumber(),
      k: pmmParamsBG.k.toNumber(),
      b: pmmParamsBG.b.toNumber(),
      b0: pmmParamsBG.b0.toNumber(),
      q: pmmParamsBG.q.toNumber(),
      q0: pmmParamsBG.k.isEqualTo(0)
        ? pmmParamsBG.q.toNumber()
        : pmmParamsBG.q0.toNumber(),
      R: pmmParamsBG.k.isEqualTo(0) ? 0 : pmmParamsBG.R,
    };

    return { pmm, isReturn: false };
  }, [isSettled, dvmPmmState]);

  const finalPmmState = isSettled ? pmmStateFromDVM : pmmStateFromSettleResult;

  return {
    pmmState: finalPmmState?.pmm,
    isReturn: finalPmmState?.isReturn ?? false,
    isLoading: isSettled ? dvmPmmStateLoading : settleResultLoading,
  };
}
