import { parseFixed } from '@ethersproject/bignumber';
import axios from 'axios';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { EmptyAddress } from '../../constants/address';
import { APIServiceKey } from '../../constants/api';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { TokenInfo } from '../Token';
import { useGetAPIService } from '../setting/useGetAPIService';
import { useFetchSolanaRoutePrice } from '../solana/useFetchSolanaRoutePrice';
import { usePriceTimer } from './usePriceTimer';
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
}: FetchRoutePrice) {
  const { account, chainId: walletChainId } = useWalletInfo();
  const { defaultChainId, feeRate, rebateTo, apikey, onlySolana } =
    useUserOptions();
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
      onlySolana ||
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
    onlySolana,
    ddl,
    account,
    chainId,
    toToken,
    feeRate,
    slippage,
    rebateTo,
    fromToken,
    fromAmount,
    toAmount,
    apikey,
    isReverseRouting,
    routePriceAPI,
    slippageLoading,
    estimateGas,
    disableIndirectRouting,
  ]);

  usePriceTimer({ refetch });

  const solanaRoute = useFetchSolanaRoutePrice({
    toToken,
    fromToken,
    marginAmount,
    fromAmount,
    toAmount,
    estimateGas,
    isReverseRouting,
    slippage,
  });

  const statusRes = React.useMemo(() => {
    if (onlySolana) {
      if (solanaRoute.fetchRouteQuery.isLoading)
        return RoutePriceStatus.Loading;
      if (solanaRoute.fetchRouteQuery.error) return RoutePriceStatus.Failed;
      if (solanaRoute.fetchRouteQuery.data) return RoutePriceStatus.Success;
      return RoutePriceStatus.Initial;
    }
    return status;
  }, [status, solanaRoute, onlySolana]);

  const rawBriefResult = useMemo(() => {
    const tokenAmount = isReverseRouting ? toAmount : fromAmount;
    if (statusRes === RoutePriceStatus.Loading || !tokenAmount) {
      return null;
    }
    if (onlySolana) {
      return solanaRoute.fetchRouteQuery.data;
    }
    return rawBrief;
  }, [
    rawBrief,
    statusRes,
    isReverseRouting,
    toAmount,
    fromAmount,
    solanaRoute,
    onlySolana,
  ]);

  const executeSwap = useCallback(
    (subtitle: React.ReactNode) => {
      if (!rawBriefResult) return;
      if (onlySolana) {
        return solanaRoute.execute.mutate({
          resAmount: rawBriefResult.resAmount,
          subtitle,
        });
      }
    },
    [onlySolana, rawBriefResult, solanaRoute.execute],
  );

  return {
    status: statusRes,
    rawBrief: rawBriefResult,
    refetch,
    executeSwap,
    reset,
  };
}
