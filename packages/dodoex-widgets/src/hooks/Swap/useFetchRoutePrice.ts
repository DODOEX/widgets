import { ChainId } from '@dodoex/api';
import { parseFixed } from '@ethersproject/bignumber';
import { t } from '@lingui/macro';
import {
  Transaction,
  VersionedMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { EmptyAddress } from '../../constants/address';
import { APIServiceKey, getAPIService } from '../../constants/api';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useSubmission } from '../Submission';
import { MetadataFlag } from '../Submission/types';
import { TokenInfo } from '../Token';
import useExecuteSwap from './useExecuteSwap';
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

interface ISolanaRouteResponse {
  resAmount: number;
  priceImpact: number;
  useSource: string;
  inputMint: string;
  inAmount: string;
  inputMintDecimal: number;
  outputMint: string;
  outAmount: string;
  outputMintDecimal: number;
  minOutAmount: string;
  inAmountWithOutDecimals: number;
  outAmountWithOutDecimals: number;
  slippageBps: number;
  routePlan: [
    {
      swapInfo: {
        ammKey: string;
        label: string;
        inputMint: string;
        outputMint: string;
        inAmount: string;
        outAmount: string;
        feeAmount: string;
        feeMint: string;
      };
      percent: number;
    },
  ];
  data: string;
  lastValidBlockHeight: number;
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
  const { getAppKitAccountByChainId, solanaWalletProvider, solanaConnection } =
    useWalletInfo();

  const submission = useSubmission();

  const { feeRate, rebateTo, apikey, apiServices } = useUserOptions();

  const ddl = useSwapSettingStore((state) => Number(state.ddl));
  const disableIndirectRouting = useSwapSettingStore((state) =>
    Number(state.disableIndirectRouting),
  );

  const { isSolanaChain, isSolanaMainnet, account } = useMemo(() => {
    if (!fromToken) {
      return {
        isSolanaChain: false,
        isSolanaMainnet: false,
        account: null,
      };
    }
    const appKitAccount = getAppKitAccountByChainId(fromToken.chainId);
    if (!appKitAccount?.chain) {
      return {
        isSolanaChain: false,
        isSolanaMainnet: false,
        account: null,
      };
    }
    const { address: account } = appKitAccount.appKitAccount;
    const { isSolanaChain, chainId } = appKitAccount.chain;

    return {
      isSolanaChain,
      isSolanaMainnet: chainId === ChainId.SOLANA,
      account,
    };
  }, [getAppKitAccountByChainId, fromToken]);

  const { data, isLoading, error } = useQuery<{
    status: RoutePriceStatus;
    rawBrief: IRouteResponse | null;
  }>({
    queryKey: [
      'route-price',
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      estimateGas,
      isReverseRouting,
      slippage,
      feeRate,
      rebateTo,
      apikey,
      apiServices,
      ddl,
      disableIndirectRouting,
      isSolanaChain,
      isSolanaMainnet,
      account,
    ],
    queryFn: async () => {
      if (
        !fromToken ||
        !toToken ||
        fromToken.chainId !== toToken.chainId ||
        (!isReverseRouting && !fromAmount) ||
        (isReverseRouting && !toAmount) ||
        slippage == null
      ) {
        return {
          status: RoutePriceStatus.Initial,
          rawBrief: null,
        };
      }

      const apiDdl = Math.floor(Date.now() / 1000) + ddl * 60;

      const params: any = isSolanaChain
        ? {
            // apikey=d5f476a6fd58e5e989&inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputMint=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB&amount=1000000&user=CjeWeg7Pfyq5VcakxaUwBHCZoEePKYuZTYgfkXaaiCw3&chainId=solana-mainnet&slippageBps=32&source=jupiter
            apikey,
            inputMint: fromToken.address,
            outputMint: toToken.address,
            amount: parseFixed(
              String(fromAmount || 1),
              fromToken.decimals,
            ).toString(),
            user: account,
            chainId: isSolanaMainnet ? 'solana-mainnet' : 'solana-devnet',
            slippageBps: new BigNumber(slippage)
              .dividedBy(100)
              .multipliedBy(10000)
              .dp(0, BigNumber.ROUND_DOWN)
              .toString(),
            source: 'jupiter',
          }
        : {
            chainId: fromToken.chainId,
            deadLine: apiDdl,
            apikey,
            slippage,
            source: disableIndirectRouting ? 'noMaxHops' : 'dodoMix',
            toTokenAddress: toToken.address,
            fromTokenAddress: fromToken.address,
            userAddr: account || EmptyAddress,
            estimateGas,
            rebateTo: rebateTo || undefined,
            fee: feeRate || undefined,
            ...(isReverseRouting
              ? {
                  toAmount: parseFixed(
                    String(toAmount || 1),
                    toToken.decimals,
                  ).toString(),
                }
              : {
                  fromAmount: parseFixed(
                    String(fromAmount || 1),
                    fromToken.decimals,
                  ).toString(),
                }),
          };

      const routePriceAPI = getAPIService(
        isSolanaChain
          ? APIServiceKey.solanaRoutePrice
          : APIServiceKey.routePrice,
        apiServices,
      );
      const resRoutePrice = await axios.get(routePriceAPI, { params });

      const routeInfo = resRoutePrice.data.data as IRouteResponse;
      if (!routeInfo?.resAmount) {
        return {
          status: RoutePriceStatus.Failed,
          rawBrief: null,
        };
      }

      return {
        status: RoutePriceStatus.Success,
        rawBrief: {
          ...routeInfo,
          resPricePerToToken: isSolanaChain
            ? new BigNumber(fromAmount)
                .dividedBy(routeInfo.resAmount)
                .dp(toToken.decimals, BigNumber.ROUND_DOWN)
                .toNumber()
            : routeInfo.resPricePerToToken,
          resPricePerFromToken: isSolanaChain
            ? new BigNumber(routeInfo.resAmount)
                .dividedBy(fromAmount)
                .dp(fromToken.decimals, BigNumber.ROUND_DOWN)
                .toNumber()
            : routeInfo.resPricePerFromToken,
        },
      };
    },
    refetchInterval: 15 * 1000,
    initialData: {
      status: RoutePriceStatus.Initial,
      rawBrief: null,
    },
  });

  const execute = useExecuteSwap();
  const executeEVMSwap = useCallback(
    (subtitle: React.ReactNode) => {
      if (!data.rawBrief || !account) {
        return;
      }
      const {
        resAmount,
        to,
        data: routeData,
        useSource,
        duration,
        value,
      } = data.rawBrief;

      const finalFromAmount = isReverseRouting ? resAmount : fromAmount;
      const finalToAmount = isReverseRouting ? fromAmount : resAmount;
      if (!fromToken || !finalFromAmount) {
        return;
      }

      execute({
        from: account,
        to,
        data: routeData,
        useSource,
        duration,
        ddl,
        value,
        subtitle,
        mixpanelProps: {
          from: account,
          fromTokenAddress: fromToken.address,
          toTokenAddress: toToken?.address,
          fromAmount: parseFixed(
            String(finalFromAmount || 1),
            fromToken.decimals,
          ).toString(),
          resAmount: finalToAmount,
          resPricePerFromToken: isReverseRouting
            ? data.rawBrief.resPricePerToToken
            : data.rawBrief.resPricePerFromToken,
          resPricePerToToken: isReverseRouting
            ? data.rawBrief.resPricePerFromToken
            : data.rawBrief.resPricePerToToken,
          fromTokenSymbol: fromToken.symbol,
          toTokenSymbol: toToken?.symbol,
          fromTokenDecimals: fromToken.decimals,
          toTokenDecimals: toToken?.decimals,
        },
      });
    },
    [
      account,
      data.rawBrief,
      ddl,
      execute,
      fromAmount,
      fromToken,
      isReverseRouting,
      toToken?.address,
      toToken?.decimals,
      toToken?.symbol,
    ],
  );

  const executeSolanaSwap = useMutation({
    mutationFn: async (subtitle: React.ReactNode) => {
      if (
        !data.rawBrief ||
        !data.rawBrief.data ||
        !solanaWalletProvider ||
        !solanaConnection
      ) {
        return;
      }

      // 解码 base64 数据
      try {
        // Ensure rawBrief.data is a valid string
        if (!data.rawBrief?.data || typeof data.rawBrief.data !== 'string') {
          throw new Error('Invalid transaction data');
        }

        // Create buffer from base64 string
        const binaryString = atob(data.rawBrief.data);
        const serializedTransaction = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          serializedTransaction[i] = binaryString.charCodeAt(i);
        }

        // Debug logging
        console.log('Transaction data length:', serializedTransaction.length);
        console.log('First few bytes:', serializedTransaction.slice(0, 10));

        // Validate buffer length
        if (serializedTransaction.length === 0) {
          throw new Error('Empty transaction buffer');
        }

        // Validate minimum transaction size
        if (serializedTransaction.length < 3) {
          throw new Error('Transaction buffer too small');
        }

        try {
          // Try to detect if this is a versioned transaction by checking the second byte
          const firstByte = serializedTransaction[0];
          const secondByte = serializedTransaction[1];

          let transaction;
          if (secondByte === 128) {
            // Versioned transaction starts with 0x80 as second byte
            // Skip the first byte (0) and deserialize the rest as a versioned transaction
            const message = VersionedMessage.deserialize(
              serializedTransaction.slice(1),
            );
            transaction = new VersionedTransaction(message);
          } else {
            // This is a legacy transaction
            transaction = Transaction.from(serializedTransaction);
          }

          // Validate the transaction
          if (!transaction) {
            throw new Error('Failed to create transaction');
          }

          // Additional validation based on transaction type
          if (transaction instanceof VersionedTransaction) {
            if (!transaction.message || !transaction.message.header) {
              throw new Error('Invalid versioned transaction structure');
            }
          } else {
            if (!transaction.recentBlockhash) {
              throw new Error('Invalid legacy transaction structure');
            }
          }

          return submission.executeCustom({
            brief: t`Swap`,
            subtitle,
            metadata: {
              [MetadataFlag.swap]: true,
            },
            handler: async (params) => {
              try {
                const signature = await solanaWalletProvider.sendTransaction(
                  transaction,
                  solanaConnection,
                );
                params.onSubmit(signature);

                const latestBlockhash =
                  await solanaConnection.getLatestBlockhash();
                const confirmResult = await solanaConnection.confirmTransaction(
                  {
                    signature,
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                  },
                );

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
        } catch (error) {
          console.error('Transaction deserialization error:', error);
          console.error('Error details:', {
            dataLength: data.rawBrief.data.length,
            bufferLength: serializedTransaction.length,
            firstBytes: serializedTransaction.slice(0, 10),
          });
          throw error;
        }
      } catch (error) {
        console.error('Buffer.from execute:', error);
      }
    },
  });

  const executeSwap = useMemo(() => {
    return isSolanaChain ? executeSolanaSwap.mutate : executeEVMSwap;
  }, [executeEVMSwap, executeSolanaSwap.mutate, isSolanaChain]);

  return {
    status: isLoading
      ? RoutePriceStatus.Loading
      : error
        ? RoutePriceStatus.Failed
        : data.status,
    rawBrief: data.rawBrief,
    executeSwap,
  };
}
