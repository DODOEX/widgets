import { Box } from '@dodoex/components';
import { DoubleRight } from '@dodoex/icons';
import { t } from '@lingui/macro';
import { useCallback } from 'react';
import { BridgeTXRequest } from '../../components/Bridge/BridgeSummaryDialog';
import TokenLogo from '../../components/TokenLogo';
import { formatTokenAmountNumber } from '../../utils/formatter';
import { ExecutionProps, useSubmission } from '../Submission';
import { OpCode } from '../Submission/spec';
import { Metadata, MetadataFlag } from '../Submission/types';
import { useGraphQLRequests } from '../useGraphQLRequests';
import { createBridgeOrder } from './createBridgeOrder';
import { BridgeRouteI } from './useFetchRoutePriceBridge';

export default function useExecuteBridgeRoute({
  route,
  bridgeOrderTxRequest,
}: {
  route?: BridgeRouteI;
  bridgeOrderTxRequest?: BridgeTXRequest;
}) {
  const graphQLRequests = useGraphQLRequests();

  const submission = useSubmission();

  const execute = useCallback(
    (metadata?: Metadata) => {
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

        const successBack = async (
          tx: string,
          onTxSuccess?: ExecutionProps['onTxSuccess'],
        ) => {
          const orderId = await createBridgeOrder({
            graphQLRequests,
            tx,
            route,
            encodeId: bridgeOrderTxRequest.encodeId,
          });
          if (onTxSuccess) {
            onTxSuccess(tx, {
              orderId,
            });
          }
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
          t`Cross Chain`,
          {
            opcode: OpCode.TX,
            ...bridgeOrderTxRequest,
          },
          {
            subtitle,
            metadata: {
              [MetadataFlag.crossChain]: true,
              ...metadata,
            },
            mixpanelProps: {
              ...bridgeOrderTxRequest,
              fromToken,
              toToken,
              pay,
              receive,
              ...params,
            },
            successBack,
          },
        );
      } catch (error) {
        console.error(error);
      }
    },
    [bridgeOrderTxRequest, route, submission, graphQLRequests],
  );

  return execute;
}
