import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { t } from '@lingui/macro';
import { DoubleRight } from '@dodoex/icons';
import { BridgeTXRequest } from '../../components/Bridge/BridgeSummaryDialog';
import { formatTokenAmountNumber } from '../../utils/formatter';
import { useSubmission } from '../Submission';
import { createBridgeOrder } from './createBridgeOrder';
import { BridgeRouteI } from './useFetchRoutePriceBridge';
import { OpCode } from '../Submission/spec';
import { Box } from '@dodoex/components';
import TokenLogo from '../../components/TokenLogo';

export default function useExecuteBridgeRoute({
  route,
  bridgeOrderTxRequest,
}: {
  route?: BridgeRouteI;
  bridgeOrderTxRequest?: BridgeTXRequest;
}) {
  const { chainId, account } = useWeb3React();
  const submission = useSubmission();

  const execute = useCallback(() => {
    if (!bridgeOrderTxRequest || !route) {
      return;
    }
    try {
      const {
        fromToken,
        toToken,
        fromAmount,
        toTokenAmount,
        fromChainId,
        toChainId,
        toAddress,
        slippage,
        roundedRouteCostTime,
      } = route;
      const pay = formatTokenAmountNumber({
        input: fromAmount,
        decimals: fromToken.decimals,
      });
      const receive = formatTokenAmountNumber({
        input: toTokenAmount,
        decimals: toToken.decimals,
      });

      const subtitle = (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TokenLogo
            token={fromToken}
            sx={{
              width: 16,
              height: 16,
              mr: 6,
            }}
            chainId={fromToken.chainId}
          />
          {`${pay} ${fromToken?.symbol}`}
          <Box
            component={DoubleRight}
            sx={{
              width: 12,
              height: 12,
              mx: 16,
            }}
          />
          <TokenLogo
            token={toToken}
            sx={{
              width: 16,
              height: 16,
              mr: 6,
            }}
          />
          {`${receive} ${toToken?.symbol}`}
        </Box>
      );

      const successBack = (tx: string) => {
        createBridgeOrder({
          apikey: 'f056714b87a8ea6432',
          tx,
          route,
        });
      };

      const params = {
        fromChainId,
        toChainId,
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        fromTokenSymbol: fromToken.symbol,
        toTokenSymbol: toToken.symbol,
        fromTokenAmount: fromAmount,
        toTokenAmount: toTokenAmount.toString(),
        slippage,
        sendAccount: toAddress,
        roundedRouteCostTime,
      };
      return submission.execute(
        t`Bridge`,
        {
          opcode: OpCode.TX,
          ...bridgeOrderTxRequest,
        },
        subtitle,
        true,
        undefined,
        {
          ...bridgeOrderTxRequest,
          fromToken,
          toToken,
          pay,
          receive,
          ...params,
        },
        undefined,
        successBack,
      );
    } catch (error) {
      console.error(error);
    }
  }, [account, chainId, route, bridgeOrderTxRequest]);

  return execute;
}
