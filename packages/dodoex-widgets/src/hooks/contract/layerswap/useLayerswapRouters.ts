import { useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import React from 'react';
import { ChainId } from '../../../constants/chains';
import {
  BridgeRouteI,
  RoutePriceStatus,
} from '../../Bridge/useFetchRoutePriceBridge';
import { refreshTime } from '../../Swap/usePriceTimer';
import { TokenInfo } from '../../Token';
import {
  getLimits,
  getNetworks,
  getQuote,
  submitTonWalletWithdraw,
} from './data';
import { Network } from './types';

function convertAvgCompletionTime(completionTime: string) {
  const timeStr = completionTime.split('.')[0];
  const hours = parseInt(timeStr.slice(0, 2), 10);
  const minutes = parseInt(timeStr.slice(3, 5), 10);
  const seconds = parseInt(timeStr.slice(6), 10);
  return hours * 60 * 60 + minutes * 60 + seconds;
}

export function useLayerswapRouters({
  skip,
  data: { fromToken, toToken, fromAmount, fromAddress, toAddress, slippage },
}: {
  skip?: boolean;
  data: {
    fromToken: TokenInfo | null;
    toToken: TokenInfo | null;
    fromAmount: string;
    fromAddress: string | undefined;
    toAddress: string | undefined;
    slippage?: number;
  };
}) {
  const { provider: evmProvider } = useWeb3React();
  const networkQuery = useQuery({
    queryKey: ['layerSwap', 'networkQuery'],
    enabled: !skip,
    queryFn: getNetworks,
  });
  let fromNetwork = null as Network | null | undefined;
  if (fromToken) {
    if (fromToken.chainId === ChainId.TON) {
      fromNetwork = networkQuery.data?.find(
        (item) => item.name === 'TON_MAINNET',
      );
    } else {
      fromNetwork = networkQuery.data?.find(
        (item) =>
          item.chain_id === String(fromToken.chainId) && item.type === 'evm',
      );
    }
  }
  const fromNetworkName = fromNetwork?.name;
  let toNetwork = null as Network | null | undefined;
  if (toToken) {
    if (toToken.chainId === ChainId.TON) {
      toNetwork = networkQuery.data?.find(
        (item) => item.name === 'TON_MAINNET',
      );
    } else {
      toNetwork = networkQuery.data?.find(
        (item) =>
          item.chain_id === String(toToken.chainId) && item.type === 'evm',
      );
    }
  }
  const toNetworkName = toNetwork?.name;

  const limitQuery = useQuery({
    queryKey: [
      'layerSwap',
      'limitQuery',
      fromToken?.address,
      toToken?.address,
      toNetworkName,
    ],
    enabled: !skip && !!(fromToken && toToken && toNetworkName),
    queryFn: () =>
      getLimits({
        fromToken,
        toToken,
        fromNetworkName,
        toNetworkName,
      }),
  });

  const quoteQuery = useQuery({
    queryKey: [
      'layerSwap',
      'quoteQuery',
      fromToken?.address,
      toToken?.address,
      toNetworkName,
      fromAmount,
    ],
    enabled: !skip && !!(fromToken && toToken && toNetworkName && fromAmount),
    refetchInterval: refreshTime,
    queryFn: async () => {
      if (!fromToken || !toToken || !toNetworkName) return;
      const data = await getQuote({
        fromToken,
        toToken,
        fromNetworkName,
        toNetworkName,
        fromAmount,
        slippage,
      });
      if (!data) {
        throw new Error('Failed to get quote');
      }
      const { quote } = data;
      const product = 'layerswap';
      const logoURI =
        'https://images.dodoex.io/PI0Kb_gccJbkOIpRNof2CUmeiyiPof28wrEH86RAlIE/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy91cGxvYWRfaW1nXzQwMTA2NzFfMjAyMzExMTYxMTE1MTM5ODAud2VicA.webp';
      const name = product.charAt(0).toUpperCase() + product.slice(1);
      const spentTime = convertAvgCompletionTime(quote.avg_completion_time);
      return {
        key: `${product}-${quote.receive_amount}-${fromAmount}-${fromToken.address}-${toToken.address}`,
        id: product,
        product,
        fromChainId: fromToken.chainId,
        toChainId: toToken.chainId,
        fromAddress,
        toAddress,
        fromAmount,
        toTokenAmount: new BigNumber(quote.receive_amount),
        fromToken,
        toToken,
        feeUSD: String(quote.total_fee_in_usd) ?? '-',
        roundedRouteCostTime: spentTime,
        executionDuration: spentTime,
        productParams: null,
        spenderContractAddress: undefined,
        step: {
          type: 'cross',
          tool: product,
          approvalAddress: undefined,
          toolDetails: {
            key: product,
            logoURI,
            name,
          },
        },
      };
    },
  });

  const status = React.useMemo(() => {
    if (!fromAmount) return RoutePriceStatus.Initial;
    if (networkQuery.isLoading || limitQuery.isLoading || quoteQuery.isLoading)
      return RoutePriceStatus.Loading;
    if (networkQuery.isError || quoteQuery.error)
      return RoutePriceStatus.Failed;
    if (quoteQuery.data) return RoutePriceStatus.Success;
    return RoutePriceStatus.Initial;
  }, [networkQuery, limitQuery, quoteQuery, fromAmount]);

  const router = React.useMemo(() => {
    if (!quoteQuery.data) return null;
    return {
      ...quoteQuery.data,
      sendData: (params) =>
        submitTonWalletWithdraw({
          fromAddress,
          toAddress,
          fromToken,
          toToken,
          fromNetworkName,
          toNetworkName,
          fromAmount,
          provider: evmProvider,
          params,
        }),
      minAmt: limitQuery.data?.min_amount,
      maxAmt: limitQuery.data?.max_amount,
    } as BridgeRouteI;
  }, [
    limitQuery.data,
    quoteQuery.data,
    fromAddress,
    toAddress,
    fromToken,
    toToken,
    fromNetworkName,
    toNetworkName,
    fromAmount,
    evmProvider,
  ]);

  return {
    status,
    router,
    limit: limitQuery.data
      ? {
          minAmt: limitQuery.data?.min_amount,
          maxAmt: limitQuery.data?.max_amount,
        }
      : null,
  };
}
