import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { parseFixed } from '@ethersproject/bignumber';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { EmptyAddress } from '../../constants/address';
import { usePriceTimer } from './usePriceTimer';
import useExecuteSwap from './useExecuteSwap';
import { TokenInfo } from '../Token';
import { useGetAPIService } from '../setting/useGetAPIService';
import { APIServiceKey } from '../../constants/api';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { useSwapSettingStore } from './useSwapSettingStore';

export enum RoutePriceStatus {
  Initial = 'Initial',
  Loading = 'Loading',
  Failed = 'Failed',
  Success = 'Success',
}
export interface FetchRoutePrice {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  marginAmount?: string;
  fromAmount: string;
  toAmount: string;
  estimateGas?: boolean;
  isReverseRouting?: boolean;
  slippage?: number;
  slippageLoading?: boolean;
  pools?: string[];
}

interface IRouteResponse {
  resAmount: number;
  priceImpact: number;
  baseFeeAmount: number;
  additionalFeeAmount: number;
  resPricePerToToken: number;
  resPricePerFromToken: number;
  to: string;
  data: string;
  value: string;
  useSource: string;
  duration: number;
}

export function useFetchRoutePrice({
  toToken,
  fromToken,
  fromAmount,
  toAmount,
  marginAmount,
  estimateGas,
  isReverseRouting,
  slippage,
  slippageLoading,
  pools,
}: FetchRoutePrice) {
  const { account, chainId: walletChainId, provider } = useWeb3React();
  const { defaultChainId, feeRate, rebateTo, apikey } = useUserOptions();
  const chainId = useMemo(
    () => fromToken?.chainId || walletChainId || defaultChainId,
    [walletChainId, fromToken, defaultChainId],
  );
  const ddl = useSwapSettingStore((state) => Number(state.ddl));
  const disableIndirectRouting = useSwapSettingStore((state) =>
    Number(state.disableIndirectRouting),
  );
  const lastId = useRef(0);
  const [status, setStatus] = useState<RoutePriceStatus>(
    RoutePriceStatus.Initial,
  );
  const [rawBrief, setRawBrief] = useState<IRouteResponse | null>(null);
  const routePriceAPI = useGetAPIService(APIServiceKey.routePrice);

  const reset = useCallback(() => {
    setRawBrief(null);
  }, [rawBrief]);

  useEffect(() => {
    reset();
  }, [fromToken, toToken]);

  const refetch = useCallback(async () => {
    if (
      !chainId ||
      !fromToken ||
      !toToken ||
      fromToken.chainId !== toToken.chainId ||
      (!isReverseRouting && !Number(fromAmount)) ||
      (isReverseRouting && !toAmount)
    ) {
      setStatus(RoutePriceStatus.Initial);
      return;
    }
    lastId.current = lastId.current + 1;
    const currentId = lastId.current;
    setStatus(RoutePriceStatus.Loading);
    const apiDdl = Math.floor(Date.now() / 1000) + ddl * 60;
    const params: any = {
      chainId,
      deadLine: apiDdl,
      apikey,
      slippage,
      source: disableIndirectRouting ? 'noMaxHops' : 'dodoV2AndMixWasm',
      toTokenAddress: toToken.address,
      fromTokenAddress: fromToken.address,
      userAddr: account || EmptyAddress,
      estimateGas,
      pools: pools ? pools.join(',') : undefined,
    };

    if (isReverseRouting) {
      params.toAmount = parseFixed(
        String(toAmount || 1),
        toToken.decimals,
      ).toString();
    } else {
      params.fromAmount = parseFixed(
        String(fromAmount || 1),
        fromToken.decimals,
      ).toString();
    }

    if (rebateTo && feeRate) {
      params.rebateTo = rebateTo;
      params.fee = feeRate;
    }

    try {
      const resRoutePrice = await axios.get(routePriceAPI, { params });
      // only update last id
      if (currentId < lastId.current) return;
      const routeInfo = resRoutePrice.data.data as IRouteResponse;
      if (routeInfo?.resAmount) {
        setStatus(RoutePriceStatus.Success);
        setRawBrief(routeInfo);
      } else {
        setStatus(RoutePriceStatus.Failed);
        setRawBrief(null);
      }
    } catch (error) {
      setStatus(RoutePriceStatus.Failed);
      setRawBrief(null);
      console.error(error);
    }
  }, [
    ddl,
    account,
    chainId,
    toToken,
    feeRate,
    slippage,
    rebateTo,
    fromToken,
    provider,
    fromAmount,
    toAmount,
    apikey,
    isReverseRouting,
    routePriceAPI,
    estimateGas,
    disableIndirectRouting,
  ]);

  usePriceTimer({ refetch });

  const rawBriefResult = useMemo(() => {
    const tokenAmount = isReverseRouting ? toAmount : fromAmount;
    if (!rawBrief || status === RoutePriceStatus.Loading || !tokenAmount)
      return null;
    return rawBrief;
  }, [rawBrief, status, isReverseRouting, toAmount, fromAmount]);

  const execute = useExecuteSwap();
  const executeSwap = useCallback(
    (subtitle: React.ReactNode) => {
      if (!rawBriefResult) return;
      const { resAmount, to, data, useSource, duration, value } =
        rawBriefResult;
      const finalFromAmount = isReverseRouting ? resAmount : fromAmount;
      const finalToAmount = isReverseRouting ? fromAmount : resAmount;
      if (!fromToken || !finalFromAmount) return;
      execute({
        to,
        data,
        useSource,
        duration,
        ddl,
        value,
        subtitle,
        mixpanelProps: {
          from: account,
          fromTokenAddress: fromToken.address,
          toTokenAddress: toToken?.address,
          fromAmount: parseFixed(
            String(finalFromAmount || 1),
            fromToken.decimals,
          ).toString(),
          resAmount: finalToAmount,
          resPricePerFromToken: isReverseRouting
            ? rawBriefResult.resPricePerToToken
            : rawBriefResult.resPricePerFromToken,
          resPricePerToToken: isReverseRouting
            ? rawBriefResult.resPricePerFromToken
            : rawBriefResult.resPricePerToToken,
          fromTokenSymbol: fromToken.symbol,
          toTokenSymbol: toToken?.symbol,
          fromTokenDecimals: fromToken.decimals,
          toTokenDecimals: toToken?.decimals,
        },
      });
    },
    [
      ddl,
      account,
      fromToken,
      fromAmount,
      toToken,
      isReverseRouting,
      rawBriefResult,
    ],
  );

  return {
    status,
    rawBrief: rawBriefResult,
    refetch,
    executeSwap,
    reset,
  };
}
