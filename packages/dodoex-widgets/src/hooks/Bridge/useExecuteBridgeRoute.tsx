import { Box } from '@dodoex/components';
import { DoubleRight } from '@dodoex/icons';
import {
  PublicKey,
  SendTransactionError,
  TransactionExpiredBlockheightExceededError,
} from '@solana/web3.js';
import { Address, beginCell, Cell, storeStateInit, toNano } from '@ton/core';
import { BigNumber } from 'bignumber.js';
import { useCallback } from 'react';
import { BridgeTXRequest } from '../../components/Bridge/BridgeSummaryDialog';
import TokenLogo from '../../components/TokenLogo';
import { chainListMap } from '../../constants/chainList';
import { transferBitcoin } from '../../utils/btc';
import { CROSS_CHAIN_TEXT } from '../../utils/constants';
import { formatTokenAmountNumber } from '../../utils/formatter';
import { constructSolanaBridgeRouteTransaction } from '../../utils/solana';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { ExecutionProps, useSubmission } from '../Submission';
import { OpCode } from '../Submission/spec';
import { Metadata, MetadataFlag } from '../Submission/types';
import { useGraphQLRequests } from '../useGraphQLRequests';
import { createBridgeOrder } from './createBridgeOrder';
import { BridgeRouteI } from './useFetchRoutePriceBridge';
import { normalizedExtHashFromBoc, waitForTransaction } from '../../utils/ton';
import { TonClient } from '@ton/ton';
import { ChainId, tonEndpointByChain } from '@dodoex/api';

export default function useExecuteBridgeRoute({
  route,
  bridgeOrderTxRequest,
}: {
  route?: BridgeRouteI;
  bridgeOrderTxRequest?: BridgeTXRequest;
}) {
  const graphQLRequests = useGraphQLRequests();
  const {
    solanaWalletProvider,
    solanaConnection,
    bitcoinWalletProvider,
    tonConnectUI,
  } = useWalletInfo();

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
        fees,
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
          brief: CROSS_CHAIN_TEXT,
          subtitle,
          metadata,
          mixpanelProps,
          successBack,
          handler: async (params) => {
            try {
              const btcDepositFee = fees.find(
                (fee) => fee.type === 'btcDepositFee',
              )?.amount;

              const tx = await transferBitcoin({
                toAddress: bridgeOrderTxRequest.to,
                amount: new BigNumber(bridgeOrderTxRequest.value).toNumber(),
                calldata: bridgeOrderTxRequest.data,
                btcWallet: bitcoinWalletProvider,
                btcDepositFee: btcDepositFee ? Number(btcDepositFee) : 450,
                isTestNet: fromChain.isTestNet,
              });

              params.onSubmit(tx);
              params.onSuccess(tx);
            } catch (error) {
              console.error('wallet.signPSBT execute:', error);
              params.onError(error);
            }
          },
        });
      }

      if (fromChain.isSolanaChain) {
        if (!solanaWalletProvider || !solanaConnection) {
          console.error(
            'solanaWalletProvider or solanaConnection is null',
            solanaWalletProvider,
            solanaConnection,
          );
          throw new Error('solanaWalletProvider or solanaConnection is null');
        }

        return submission.executeCustom({
          brief: CROSS_CHAIN_TEXT,
          subtitle,
          metadata,
          mixpanelProps,
          successBack,
          handler: async (params) => {
            try {
              const transaction = constructSolanaBridgeRouteTransaction({
                data: bridgeOrderTxRequest.data,
              });

              const latestBlockhash =
                await solanaConnection.getLatestBlockhash();
              transaction.recentBlockhash = latestBlockhash.blockhash;
              transaction.feePayer = new PublicKey(bridgeOrderTxRequest.from);

              const signedTransaction =
                await solanaWalletProvider.signTransaction(transaction);
              const signature = await solanaConnection.sendRawTransaction(
                signedTransaction.serialize(),
              );
              params.onSubmit(signature);
              params.onSuccess(signature);

              // const confirmResult = await solanaConnection.confirmTransaction(
              //   {
              //     signature,
              //     blockhash: latestBlockhash.blockhash,
              //     lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
              //   },
              //   'processed',
              // );

              // if (confirmResult.value.err) {
              //   params.onError(confirmResult.value.err);
              //   return;
              // }
              // params.onSuccess(signature);
            } catch (error) {
              if (error instanceof TransactionExpiredBlockheightExceededError) {
                // 重新获取 blockhash，重新签名、发送
              }

              if (error instanceof SendTransactionError) {
                const logs = await error.getLogs(solanaConnection);
                console.log('logs:', logs);
              }
              console.error('wallet.sendTransaction execute:', error);
              params.onError(error);
            }
          },
        });
      }

      if (fromChain.isTONChain) {
        if (!tonConnectUI) {
          throw new Error('tonConnectUI is null');
        }

        return submission.executeCustom({
          brief: CROSS_CHAIN_TEXT,
          subtitle,
          metadata,
          mixpanelProps,
          successBack,
          handler: async (params) => {
            try {
              // https://docs.ton.org/v3/guidelines/ton-connect/cookbook/ton-transfer#transfer-with-a-comment

              const payload = Cell.fromBoc(
                Buffer.from(bridgeOrderTxRequest.data, 'hex'),
              )[0]
                .toBoc()
                .toString('base64');

              const myTransaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [
                  {
                    address: Address.parse(bridgeOrderTxRequest.to).toString(),
                    amount: Number(bridgeOrderTxRequest.value).toString(),
                    payload,
                    // payload with the comment in body
                  },
                ],
              };

              const { boc } = await tonConnectUI.sendTransaction(myTransaction);

              // const client = new TonClient({
              //   endpoint:
              //     tonEndpointByChain[
              //       fromChain.chainId as ChainId.TON | ChainId.TON_TESTNET
              //     ],
              // });

              // const tx = await waitForTransaction(
              //   boc,
              //   client,
              //   10, // retries
              //   1000, // timeout before each retry
              // );

              //           const extmsghash = Cell.fromBase64(boc).hash();
              // console.log('Full message hash:', extmsghash.toString('hex'));

              const tx = normalizedExtHashFromBoc(boc);

              console.log('Normalized hash:', tx);

              params.onSubmit(tx);
              params.onSuccess(tx);
            } catch (error) {
              console.error('tonConnectUI.sendTransaction:', error);
              params.onError(error);
            }
          },
        });
      }

      if (fromChain.isSUIChain) {
        throw new Error('SUI is not supported');
      }

      return submission.execute(
        CROSS_CHAIN_TEXT,
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
    bitcoinWalletProvider,
    solanaWalletProvider,
    solanaConnection,
  ]);

  return execute;
}
