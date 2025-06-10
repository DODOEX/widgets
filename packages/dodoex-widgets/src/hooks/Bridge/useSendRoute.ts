import {
  ChainId,
  Cross_Chain_Swap_Zetachain_TransactionEncodeQuery,
  Cross_Chain_Swap_ZetachaintransactionEncodeParams,
  SwapApi,
} from '@dodoex/api';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { BridgeTXRequest } from '../../components/Bridge/BridgeSummaryDialog';
import { chainListMap } from '../../constants/chainList';
import { basicTokenMap } from '../../constants/chains';
import { byWei, formatTokenAmountNumber } from '../../utils';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { getEstimateGas } from '../contract/wallet';
import { useGraphQLRequests } from '../useGraphQLRequests';
import { BridgeRouteI } from './useFetchRoutePriceBridge';

export function useSendRoute() {
  const graphQLRequests = useGraphQLRequests();
  const { evmProvider } = useWalletInfo();

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
      if (!selectedRoute) {
        return;
      }
      const { encodeParams } = selectedRoute;
      if (!encodeParams || !encodeParams.interfaceParams) {
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

        /**
         * 
         * EVM
{
    "data": {
        "cross_chain_swap_zetachain_transactionEncode": {
            "data": "0x3322cdb9000000000000000000000000816d85d853a7da1f91f427e4132056d88620e7d700000000000000000000000000000000000000000000000000000000047ab8ed0000000000000000000000001c7d4b196cb0c7b01d743fbc6116a902379c72380000000000000000000000000000000000000000000000000000000000066eee00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001e900066eee4bc32034caccc9b7e02536945edbc286bacba073001400140161001400280000f859fb7f8811a5016e9a5380b497957343f40476f859fb7f8811a5016e9a5380b497957343f40476cc683a782f4b30c138787cb5576a86af66fdc31d4bc32034caccc9b7e02536945edbc286bacba07300000000000000000000000000000000000000000000000000000000046f415200000000000000000000000000000000000000000000000000000000006eeac500000000000000000000000000000000000000000000000000000000006e5ccb0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006837f566010f9053e174c123098c17e60a2b1fab3b303f9e29014f59b88556c1b133939b2655729ad53226ed5fad024f59b88556c1b133939b2655729ad53226ed5fad026eea5c10f526153e7578e5257801f8610d11420100010000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000069b78a97f8fe43971d14626bba2cb9b6a03cef0375faf114eafb1bdbe2f0316df893fd58ce46aa4d75faf114eafb1bdbe2f0316df893fd58ce46aa4d0000000000000000000000000000000000000000000000",
            "to": "0x2405965a3cb8748d7065752adc702bb907aa2297",
            "value": "0x0",
            "from": "0xf859fb7f8811a5016e9a5380b497957343f40476",
            "chainId": 11155111
        }
    }
}


BTC

{
    "data": {
        "cross_chain_swap_zetachain_transactionEncode": {
            "data": "5a001007000000000000000000000000e70c62baf742140ed5babbcd35f15b7a9811932a0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000001d739897a5c71e217e43d69c2a4919c955beb8fe466abec1d18b8bac36d0ccd3b10cc683a782f4b30c138787cb5576a86af66fdc31d002a001474623171777471327738776d376d6c65346b657233707064736a663761787a6164617865303071757230f859fb7f8811a5016e9a5380b497957343f40476dbff6471a79e5374d771922f2194eccc42210b9fcc683a782f4b30c138787cb5576a86af66fdc31d0000000000000000000000000000000000000000000000000000000000066bbb0000000000000000000000000000000000000000000000000000000000431a1f000000000000000000000000000000000000000000000000000000000042c43b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000068382866010f9053e174c123098c17e60a2b1fab3b303f9e2901c8e06c7ac071d78bc4e26700320b054971cc7e5202c8e06c7ac071d78bc4e26700320b054971cc7e52026eea5c10f526153e7578e5257801f8610d114201000100004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a74623171777471327738776d376d6c65346b657233707064736a663761787a616461786530307175723000000000000000000000000000000000000000000000",
            "to": "tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur",
            "value": "0x693c5",
            "from": "tb1qwtq2w8wm7mle4ker3ppdsjf7axzadaxe00qur0",
            "chainId": 18333
        }
    }
}
         */
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

        const fromChain = chainListMap.get(chainId);

        if (fromChain?.isEVMChain) {
          if (!fromEtherTokenBalance) {
            throw new Error('fromEtherTokenBalance is null');
          }

          const { fromToken, fromAmount } = selectedRoute;

          const etherToken = basicTokenMap[chainId as ChainId];

          // value is the amount of transaction transfer, including the cross-chain fee. If fromToken is a native token, value also includes the number of transactions from Token; Some cross-chain products use the token of the transaction to charge a handling fee, value=0
          const transferValue = byWei(value, 18);
          const isEtherToken =
            etherToken &&
            fromToken.address.toLowerCase() ===
              etherToken.address.toLowerCase();
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
          const gasLimit = evmProvider
            ? await getEstimateGas(
                {
                  from,
                  to,
                  value,
                  data: txData,
                },
                evmProvider,
              )
            : null;
          if (!gasLimit) {
            throw new Error('failed to estimate gas');
          }
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
    [graphQLRequests, evmProvider],
  );

  return {
    sendRouteLoading,
    sendRouteError,
    setSendRouteError,
    bridgeOrderTxRequest,

    handleClickSend,
  };
}
