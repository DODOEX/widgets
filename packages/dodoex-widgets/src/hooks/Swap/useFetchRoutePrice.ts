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
import { useSelector } from 'react-redux';
import { DEFAULT_SWAP_DDL } from '../../constants/swap';
import { getSlippage, getTxDdl } from '../../store/selectors/settings';
import { EmptyAddress } from '../../constants/address';
import { usePriceTimer } from './usePriceTimer';
import { getDefaultChainId } from '../../store/selectors/wallet';
import useExecuteSwap from './useExecuteSwap';
import { TokenInfo } from '../Token';
import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { useGetAPIService } from '../setting/useGetAPIService';
import { APIServiceKey } from '../../constants/api';
import { getGlobalProps } from '../../store/selectors/globals';

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
}: FetchRoutePrice) {
  const { account, chainId: walletChainId, provider } = useWeb3React();
  const defaultChainId = useSelector(getDefaultChainId);
  const chainId = useMemo(
    () => fromToken?.chainId || walletChainId || defaultChainId,
    [walletChainId, fromToken, defaultChainId],
  );
  const { defaultSlippage, loading: slippageLoading } =
    useDefaultSlippage(false);
  const slippage = useSelector(getSlippage) || defaultSlippage;
  const ddl = useSelector(getTxDdl) || DEFAULT_SWAP_DDL;
  const lastId = useRef(0);
  const { feeRate, rebateTo, apikey, isReverseRouting } =
    useSelector(getGlobalProps);
  const apiDdl = useMemo(() => Math.floor(Date.now() / 1000) + ddl * 60, [ddl]);
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
      (!isReverseRouting && !fromAmount) ||
      (isReverseRouting && !toAmount)
    ) {
      setStatus(RoutePriceStatus.Initial);
      return;
    }
    lastId.current = lastId.current + 1;
    const currentId = lastId.current;
    setStatus(RoutePriceStatus.Loading);
    // waiting for set auto slippage
    if (slippageLoading) return;
    const params: any = {
      chainId,
      deadLine: apiDdl,
      apikey,
      slippage,
      source: 'dodoV2AndMixWasm',
      toTokenAddress: toToken.address,
      fromTokenAddress: fromToken.address,
      userAddr: account || EmptyAddress,
      estimateGas,
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
    apiDdl,
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
    slippageLoading,
    estimateGas,
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
      if (!fromToken || !finalFromAmount) return;
      execute({
        to,
        data,
        useSource,
        duration,
        ddl,
        value,
        subtitle,
      });
    },
    [ddl, fromToken, fromAmount, isReverseRouting, rawBriefResult],
  );

  return {
    status,
    rawBrief: rawBriefResult,
    refetch,
    executeSwap,
    reset,
  };
}
