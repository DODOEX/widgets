import { Box } from '@dodoex/components';
import { DoubleRight } from '@dodoex/icons';
import { t } from '@lingui/macro';
import { useCallback } from 'react';
import { BridgeTXRequest } from '../../components/Bridge/BridgeSummaryDialog';
import TokenLogo from '../../components/TokenLogo';
import { chainListMap } from '../../constants/chainList';
import { formatTokenAmountNumber } from '../../utils/formatter';
import { constructSolanaTransaction } from '../../utils/solana';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
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
  const { solanaWalletProvider, solanaConnection, bitcoinWalletProvider } =
    useWalletInfo();

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
            marginRight={6}
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
            marginRight={6}
            chainId={toToken.chainId}
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
          calldata: bridgeOrderTxRequest.data,
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

      const metadata: Metadata = {
        [MetadataFlag.crossChain]: true,
      };

      const mixpanelProps = {
        ...bridgeOrderTxRequest,
        fromToken,
        toToken,
        pay,
        receive,
        ...params,
      };

      const fromChain = chainListMap.get(fromChainId);
      if (!fromChain) {
        throw new Error('fromChain is null');
      }

      if (fromChain.isBTCChain) {
        if (!bitcoinWalletProvider) {
          throw new Error('bitcoinWalletProvider is null');
        }

        return submission.executeCustom({
          brief: t`Cross Chain`,
          subtitle,
          metadata,
          mixpanelProps,
          successBack,
          handler: async (params) => {
            try {
              const signature = await bitcoinWalletProvider.signPSBT({
                psbt: bridgeOrderTxRequest.data,
                signInputs: [],
                broadcast: false,
              });

              console.log('signature:', signature);

              if (!signature.txid) {
                throw new Error('signature.txid is null');
              }

              params.onSubmit(signature.txid);
              params.onSuccess(signature.txid);
            } catch (error) {
              console.error('wallet.signPSBT execute:', error);
              params.onError(error);
            }
          },
        });
      }

      if (fromChain.isSolanaChain) {
        if (!solanaWalletProvider || !solanaConnection) {
          throw new Error('solanaWalletProvider or solanaConnection is null');
        }
        const transaction = constructSolanaTransaction({
          data: bridgeOrderTxRequest.data,
        });

        return submission.executeCustom({
          brief: t`Cross Chain`,
          subtitle,
          metadata,
          mixpanelProps,
          successBack,
          handler: async (params) => {
            try {
              const signature = await solanaWalletProvider.sendTransaction(
                transaction,
                solanaConnection,
              );
              params.onSubmit(signature);

              const latestBlockhash =
                await solanaConnection.getLatestBlockhash();
              const confirmResult = await solanaConnection.confirmTransaction({
                signature,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
              });

              if (confirmResult.value.err) {
                params.onError(confirmResult.value.err);
                return;
              }
              params.onSuccess(signature);
            } catch (error) {
              console.error('wallet.sendTransaction execute:', error);
              params.onError(error);
            }
          },
        });
      }

      return submission.execute(
        t`Cross Chain`,
        {
          opcode: OpCode.TX,
          ...bridgeOrderTxRequest,
        },
        {
          subtitle,
          metadata,
          mixpanelProps,
          successBack,
        },
      );
    } catch (error) {
      console.error(error);
    }
  }, [
    bridgeOrderTxRequest,
    route,
    submission,
    graphQLRequests,
    solanaWalletProvider,
    solanaConnection,
  ]);

  return execute;
}
