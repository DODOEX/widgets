import axios from 'axios';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { t } from '@lingui/macro';
import { BridgeEncodeAPI } from '../../constants/api';
import { basicTokenMap, ChainId } from '../../constants/chains';
import { byWei, formatTokenAmountNumber } from '../../utils';
import { BridgeRouteI } from './useFetchRoutePriceBridge';
import { useWeb3React } from '@web3-react/core';
import { getEstimateGas } from '../contract/wallet';
import { BridgeTXRequest } from '../../components/Bridge/BridgeSummaryDialog';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../store/selectors/globals';

export function useSendRoute() {
  const { provider } = useWeb3React();
  const [bridgeOrderTxRequest, setBridgeOrderTxRequest] =
    useState<BridgeTXRequest | undefined>();
  const [sendRouteLoading, setSendRouteLoading] = useState(false);
  const [sendRouteError, setSendRouteError] = useState('');
  const { apikey } = useSelector(getGlobalProps);
  const handleClickSend = useCallback(
    async ({
      selectedRoute,
      fromEtherTokenBalance,
      goNext,
    }: {
      selectedRoute?: BridgeRouteI;
      fromEtherTokenBalance: BigNumber | null;
      goNext: () => void;
    }) => {
      if (!selectedRoute || !provider || !fromEtherTokenBalance) {
        return;
      }
      const { encodeParams } = selectedRoute;
      if (!encodeParams) {
        return;
      }
      setSendRouteError('');
      setSendRouteLoading(true);
      // 1. encode params
      // 2. send encode params
      // 3. get gas price
      // 3.1 insufficient balance，disabled button
      // 4. go next
      try {
        const { fromToken, fromAmount, product } = selectedRoute;
        const data = {
          product,
          encodeParams,
        };
        const result = await axios.post(
          `${BridgeEncodeAPI}${apikey ? `?apikey=${apikey}` : ''}`,
          {
            data,
          },
        );
        const encodeResultData = result.data.data;

        const { data: txData, to, value, from, chainId } = encodeResultData;
        if (!txData || !to || !value || !from || !chainId) {
          throw new Error('cross_chain_swap_transactionEncode is null');
        }

        const etherToken = basicTokenMap[chainId as ChainId];

        // value is the amount of transaction transfer, including the cross-chain fee. If fromToken is a native token, value also includes the number of transactions from Token; Some cross-chain products use the token of the transaction to charge a handling fee, value=0
        const transferValue = byWei(value, 18);
        const isEtherToken =
          etherToken &&
          fromToken.address.toLowerCase() === etherToken.address.toLowerCase();
        const bridgeFee = transferValue.minus(isEtherToken ? fromAmount : 0);

        // If the balance of native token is less than value, an error will be reported by estimateGas. Make judgment in advance.
        if (
          !transferValue.isNaN() &&
          transferValue.gt(0) &&
          fromEtherTokenBalance.lt(transferValue)
        ) {
          setSendRouteError(
            t`Insufficient cross-chain fees, need at least ${formatTokenAmountNumber(
              {
                input: bridgeFee,
                decimals: etherToken?.decimals ?? 18,
              },
            )} ${etherToken?.symbol ?? '-'}`,
          );
          setSendRouteLoading(false);
          return;
        }

        // gaslimit(number)
        const gasLimit = await getEstimateGas(
          {
            from,
            to,
            value,
            data: txData,
          },
          provider,
        );
        if (!gasLimit) {
          throw new Error('failed to estimate gas');
        }

        setBridgeOrderTxRequest({
          data: txData,
          to,
          value,
          from,
          chainId,
        });
        goNext();
      } catch (error) {
        console.error('[failed to construct transaction request]: ', error);
        const { message } = error as { message: string };
        setSendRouteError(message);
      }

      setSendRouteLoading(false);
    },
    [setBridgeOrderTxRequest, setSendRouteLoading, provider],
  );

  return {
    apikey,
    sendRouteLoading,
    sendRouteError,
    setSendRouteError,
    bridgeOrderTxRequest,

    handleClickSend,
  };
}
