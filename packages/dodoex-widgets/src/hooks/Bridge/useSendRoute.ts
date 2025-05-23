import {
  ChainId,
  Cross_Chain_Swap_Zetachain_TransactionEncodeQuery,
  Cross_Chain_Swap_ZetachaintransactionEncodeParams,
  SwapApi,
} from '@dodoex/api';
import { t } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { BridgeTXRequest } from '../../components/Bridge/BridgeSummaryDialog';
import { basicTokenMap } from '../../constants/chains';
import { byWei, formatTokenAmountNumber } from '../../utils';
import { getEstimateGas } from '../contract/wallet';
import { useGraphQLRequests } from '../useGraphQLRequests';
import { BridgeRouteI } from './useFetchRoutePriceBridge';

export function useSendRoute() {
  const graphQLRequests = useGraphQLRequests();
  const { provider } = useWeb3React();

  const [bridgeOrderTxRequest, setBridgeOrderTxRequest] = useState<
    BridgeTXRequest | undefined
  >();
  const [sendRouteLoading, setSendRouteLoading] = useState(false);
  const [sendRouteError, setSendRouteError] = useState('');

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
      if (!selectedRoute || !fromEtherTokenBalance) {
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

        const encodeResult = await graphQLRequests.getData<
          Cross_Chain_Swap_Zetachain_TransactionEncodeQuery,
          {
            data: Cross_Chain_Swap_ZetachaintransactionEncodeParams;
          }
        >(
          SwapApi.graphql.cross_chain_swap_zetachain_transactionEncode.toString(),
          {
            data: {
              interfaceParams: encodeParams.interfaceParams,
            },
          },
        );

        if (
          !encodeResult ||
          !encodeResult.cross_chain_swap_zetachain_transactionEncode
        ) {
          throw new Error('cross_chain_swap_transactionEncode is null');
        }

        const {
          data: txData,
          to,
          value,
          from,
          chainId,
        } = encodeResult.cross_chain_swap_zetachain_transactionEncode;

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
        const gasLimit = provider
          ? await getEstimateGas(
              {
                from,
                to,
                value,
                data: txData,
              },
              provider,
            )
          : null;
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
    [graphQLRequests, provider],
  );

  return {
    sendRouteLoading,
    sendRouteError,
    setSendRouteError,
    bridgeOrderTxRequest,

    handleClickSend,
  };
}
