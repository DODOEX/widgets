import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import {
  BigNumber as EthersBigNumber,
  parseFixed,
} from '@ethersproject/bignumber';
import React, { useCallback, useMemo, useState } from 'react';
import { getEstimateGas } from '../contract/wallet';
import { RoutePriceAPI } from '../../constants/api';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../store/selectors/globals';
import { DEFAULT_SWAP_DDL } from '../../constants/swap';
import { getSlippage, getTxDdl } from '../../store/selectors/settings';
import { EmptyAddress } from '../../constants/address';
import { usePriceTimer } from './usePriceTimer';
import { getDefaultChainId } from '../../store/selectors/wallet';
import useExecuteSwap from './useExecuteSwap';
import { TokenInfo } from '../Token';
import { useDefaultSlippage } from '../setting/useDefaultSlippage';

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
}
export function useFetchRoutePrice({
  toToken,
  fromToken,
  fromAmount,
  toAmount,
  marginAmount,
}: FetchRoutePrice) {
  const { account, chainId: walletChainId, provider } = useWeb3React();
  const defaultChainId = useSelector(getDefaultChainId);
  const chainId = useMemo(
    () => walletChainId || defaultChainId,
    [walletChainId, defaultChainId],
  );
  const defaultSlippage = useDefaultSlippage(false);
  const slippage = useSelector(getSlippage) || defaultSlippage;
  const ddl = useSelector(getTxDdl) || DEFAULT_SWAP_DDL;
  const { feeRate, rebateTo, apikey, isReverseRouting } =
    useSelector(getGlobalProps);
  const apiDdl = useMemo(() => Math.floor(Date.now() / 1000) + ddl * 60, [ddl]);
  const [status, setStatus] = useState<RoutePriceStatus>(
    RoutePriceStatus.Initial,
  );
  const [resAmount, setResAmount] = useState<number | null>(null);
  const [resValue, setResValue] = useState<string>('');
  const [baseFeeAmount, setBaseFeeAmount] = useState<number | null>(null);
  const [additionalFeeAmount, setAdditionalFeeAmount] =
    useState<number | null>(null);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [resCostGas, setResCostGas] = useState<EthersBigNumber>(
    EthersBigNumber.from(0),
  );
  const [resPricePerFromToken, setResPricePerFromToken] =
    useState<number | null>(null);
  const [resPricePerToToken, setResPricePerToToken] =
    useState<number | null>(null);

  const [to, setTo] = useState<string>('');
  const [data, setData] = useState<string>('');
  const [useSource, setUseSource] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);

  const refetch = useCallback(async () => {
    if (
      !chainId ||
      !fromToken ||
      !toToken ||
      fromToken.chainId !== toToken.chainId
    ) {
      setStatus(RoutePriceStatus.Initial);
      return;
    }
    if (!isReverseRouting && !fromAmount) return;
    if (isReverseRouting && !toAmount) return;
    setStatus(RoutePriceStatus.Loading);
    const params: any = {
      chainId,
      deadLine: apiDdl,
      apikey,
      slippage,
      source: 'dodoV2AndMixWasm',
      toTokenAddress: toToken.address,
      toTokenDecimals: toToken.decimals,
      fromTokenAddress: fromToken.address,
      fromTokenDecimals: fromToken.decimals,
      userAddr: account || EmptyAddress,
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
      const resRoutePrice = await axios.get(RoutePriceAPI, { params });
      const routeInfo = resRoutePrice.data.data;
      if (routeInfo?.resAmount) {
        setStatus(RoutePriceStatus.Success);
        setResAmount(routeInfo.resAmount);
        setPriceImpact(routeInfo.priceImpact);
        setResPricePerFromToken(routeInfo.resPricePerFromToken);
        setResPricePerToToken(routeInfo.resPricePerToToken);
        setBaseFeeAmount(routeInfo.baseFeeAmount);
        setAdditionalFeeAmount(routeInfo.additionalFeeAmount);

        setTo(routeInfo.to);
        setData(routeInfo.data);
        setResValue(routeInfo.value);
        setUseSource(routeInfo.useSource);
        setDuration(routeInfo.duration);
      } else {
        setStatus(RoutePriceStatus.Failed);
      }

      if (!account || !provider) return;

      const gasLimit = await getEstimateGas(
        {
          from: account,
          to: routeInfo.to,
          value: routeInfo.value,
          data: routeInfo.data,
        },
        provider,
      );

      if (gasLimit) {
        setResCostGas(gasLimit);
      }
    } catch (error) {
      setStatus(RoutePriceStatus.Failed);
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
  ]);

  usePriceTimer({ refetch });

  const resAmt = useMemo(() => {
    const tokenAmount = isReverseRouting ? toAmount : fromAmount;
    return status !== RoutePriceStatus.Loading && tokenAmount
      ? resAmount
      : null;
  }, [status, isReverseRouting, toAmount, fromAmount, resAmount]);

  const execute = useExecuteSwap();
  const executeSwap = useCallback(
    (subtitle: React.ReactNode) => {
      const finalFromAmount = isReverseRouting ? resAmount : fromAmount;
      if (!fromToken || !finalFromAmount) return;
      execute({
        to,
        data,
        useSource,
        duration,
        ddl,
        value: resValue,
        // gasLimit: resCostGas,
        subtitle,
      });
    },
    [
      to,
      ddl,
      data,
      duration,
      useSource,
      fromToken,
      fromAmount,
      resCostGas,
      resAmount,
      resValue,
      isReverseRouting,
    ],
  );

  return {
    status,
    refetch,
    priceImpact,
    executeSwap,
    baseFeeAmount,
    resAmount: resAmt,
    additionalFeeAmount,
    resPricePerToToken,
    resPricePerFromToken,
  };
}
