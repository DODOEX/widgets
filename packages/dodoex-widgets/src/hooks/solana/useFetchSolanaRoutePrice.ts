import { chainIdToShortName } from '@dodoex/api';
import { t } from '@lingui/macro';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  VersionedMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import React from 'react';
import { APIServiceKey } from '../../constants/api';
import { toWei } from '../../utils';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useGetAPIService } from '../setting/useGetAPIService';
import { useSubmission } from '../Submission';
import { MetadataFlag } from '../Submission/types';
import { TokenInfo } from '../Token/type';

const routeApiResponseDataExample = {
  inputMint: '36LzY5yGXRvySE7safeHuLejhsg8mPjmPiitAQr3Axva',
  inAmount: '1000000',
  inputMintDecimal: 9,
  outputMint: 'GLfqSuSUUB6mTA4rfk5BHYbRjQHxYknJu8pSHcMnYgzE',
  outAmount: '5898322',
  outputMintDecimal: 9,
  minOutAmount: '5868831',
  inAmountWithOutDecimals: 1,
  outAmountWithOutDecimals: 0.005898322,
  slippageBps: 50,
  routePlan: [
    {
      swapInfo: {
        ammKey: '83v8iPyZihDEjDdY8RdZddyZNyUtXngz69Lgo9Kt5d6d',
        label: 'RaydiumCp',
        inputMint: '36LzY5yGXRvySE7safeHuLejhsg8mPjmPiitAQr3Axva',
        outputMint: 'GLfqSuSUUB6mTA4rfk5BHYbRjQHxYknJu8pSHcMnYgzE',
        inAmount: '1000000',
        outAmount: '5898322',
        feeAmount: '13',
        feeMint: '36LzY5yGXRvySE7safeHuLejhsg8mPjmPiitAQr3Axva',
      },
      percent: 100,
    },
  ],
  resAmount: 0.005898322,
  priceImpact: 0.00008281330617418546,
  useSource: 'DODO',
  data: 'AIABAAULuydQRcXU37XeaJa5h85M36w0Ie7/oNQLDewqgUx7z/iPg7v3hY0apuzdtJg7FQPmAazPCgjtqZznAL44q5iItA1lk/FWGfnV3E5/Bei7+5nfAOOK8jg6wUf+dWq20bI2UH7YCPOr8hHisO0wLtjecFxaY78Rl7pnO9QY6tgdR6X1+h97kIigK9hi+gaz8ElnFEbCmfVTBFvl3MagA5twSg+qbrJWWPBwc17ojOJB4BNOD4XaIV+ts2R3uzZ/6CzCjJclj04kifG7PRApFI4NgwtaE5na/xCEBI572Nvp+FkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR51VvyMcBu7nTFbs5oFQf9sbLeo/SOUQKxzaJWvBOPtD/6J/XX9kp0wJsfKVh53ksJqzbfyd1RSzIap7OM5ehynzuLbKQ30Ca3pj/0Wq5lWzvmdbFt2OddEbICsJmWX5oMR6KiUGPCAEEfcQha8z+zjKvOCficaRTwSroyyOD+AQohAA8QAgERBgcRAAIBCBAICQgSERETAAsQDwEMAg0DBAUOSeGvNUnULzTtQEIPAAAAAABSAFoAAAAAAB+NWQAAAAAAJQAAAOUXy5d6460qAQAAAC8AAGQAAUBCDwAAAAAAUgBaAAAAAAAyAAABeWUSc/alLjcLiYWttW7ElnjgwKUHBiufBJJdlBG4VVAEkGltbAVqEhUAEA==',
  lastValidBlockHeight: 300085127,
};

const routeApiResponseExample = {
  status: 200,
  data: routeApiResponseDataExample,
};

export type IRouteResponseData = typeof routeApiResponseExample;

export type IRouteResponse = typeof routeApiResponseDataExample | undefined;

export function useFetchSolanaRoutePrice({
  toToken,
  fromToken,
  fromAmount,
  slippage,
}: {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  fromAmount: string;
  slippage: number;
}) {
  const { connection } = useConnection();
  const submission = useSubmission();

  const { account } = useWalletInfo();
  const wallet = useWallet();

  const routePriceAPI = useGetAPIService(APIServiceKey.routePrice);

  const fetchRouteQuery = useQuery<IRouteResponse>({
    enabled: !!(fromToken && toToken && fromAmount),
    queryKey: ['route-price', fromToken, toToken, fromAmount, account],
    // refetchInterval: 15000,
    refetchInterval: 60000,
    queryFn: async () => {
      if (!fromToken || !toToken || !fromAmount) {
        return undefined;
      }

      const swapAmount = toWei(fromAmount, fromToken.decimals);
      let fromAddress = fromToken.address;
      let toAddress = toToken.address;

      // const etherToken = basicTokenMap[fromToken.chainId as ChainId];
      // const etherAddressLow = etherToken.address.toLowerCase();
      // const isFromEther = fromAddress.toLowerCase() === etherAddressLow;
      // const isToEther = toAddress.toLowerCase() === etherAddressLow;
      // let isWrappedOrUnWrapped = false;
      // if (isFromEther) {
      //   fromAddress = etherToken.wrappedTokenAddress;
      //   isWrappedOrUnWrapped =
      //     toAddress.toLowerCase() ===
      //     etherToken.wrappedTokenAddress.toLowerCase();
      // } else if (isToEther) {
      //   toAddress = etherToken.wrappedTokenAddress;
      //   isWrappedOrUnWrapped =
      //     fromAddress.toLowerCase() ===
      //     etherToken.wrappedTokenAddress.toLowerCase();
      // }
      // if (isWrappedOrUnWrapped) {
      //   return {
      //     resAmount: Number(fromAmount),
      //     baseFeeAmount: 0,
      //     additionalFeeAmount: 0,
      //     priceImpact: null,
      //     resPricePerToToken: 1,
      //     resPricePerFromToken: 1,
      //   };
      // }

      const baseTokenPublicKey = new PublicKey(fromAddress);
      const quoteTokenPublicKey = new PublicKey(toAddress);
      // const programId = new PublicKey(STABLE_POOL_PROGRAM_ADDRESS);
      // const [poolAddress] = await getPoolAddress(
      //   baseTokenPublicKey,
      //   quoteTokenPublicKey,
      //   programId,
      // );

      try {
        /**
         * 入参和之前路由接口差不多，svm版本接口参数区别：
         * inputMint、outputMint是源token和目标token
         * slippageBps 滑点的整数表示，取值范围 0--10000
         * 返回里面路径信息 routePlan 和之前路由接口字段区别较大，路径是图结构，不过当前只支持线形路由，把路径按照先后顺序串起来表示就行了
         */
        const res = await axios.get<IRouteResponseData>(routePriceAPI, {
          params: {
            inputMint: baseTokenPublicKey.toBase58(),
            outputMint: quoteTokenPublicKey.toBase58(),
            amount: swapAmount.toString(),
            userAddr: account || 'CjeWeg7Pfyq5VcakxaUwBHCZoEePKYuZTYgfkXaaiCw3',
            chainId:
              chainIdToShortName[
                fromToken.chainId as keyof typeof chainIdToShortName
              ],
            slippageBps: new BigNumber(slippage)
              .multipliedBy(10000)
              .div(100)
              .dp(0)
              .toString(),
          },
        });

        if (
          res.data.status !== 200 ||
          !res.data.data ||
          !res.data.data.resAmount
        ) {
          console.error('Route price API error', res.data);
          throw new Error('Route price API error');
        }

        // const provider = anchorWallet
        //   ? new AnchorProvider(
        //       connection,
        //       anchorWallet,
        //       AnchorProvider.defaultOptions(),
        //     )
        //   : undefined;
        // if (!provider) return null;
        // // @ts-ignore
        // const stablePoolProgram = new Program(idl, provider);
        // const view = await stablePoolProgram.methods
        //   .querySwap(new BN(swapAmount.toString()))
        //   .accounts({
        //     poolState: poolAddress,
        //     tokenMint: baseTokenPublicKey,
        //   })
        //   .view();
        // const {
        //   0: resAmountWeiBN,
        //   1: lpFeeRateWeiBN,
        //   2: mtFeeRateWeiBN,
        // } = view;
        // const decimals = toToken.decimals;
        // const fromAmountBg = new BigNumber(fromAmount);
        // const resAmountBg = byWei(resAmountWeiBN.toString(), decimals);
        // const fee = byWei(
        //   lpFeeRateWeiBN.add(mtFeeRateWeiBN).toNumber(),
        //   decimals,
        // );
        // const isValidResAmount = resAmountBg.gt(0);
        return res.data.data;
      } catch (e) {
        console.error('querySwap:', e);
      }
      return undefined;
    },
  });

  const execute = useMutation({
    mutationFn: async ({
      rawBrief,
      subtitle,
    }: {
      rawBrief: IRouteResponse;
      subtitle: React.ReactNode;
    }) => {
      if (!rawBrief || !rawBrief.data || !wallet.publicKey) {
        return;
      }

      // const fromAmountWeiBN = new BN(
      //   toWei(fromAmount, fromToken.decimals).toString(),
      // );
      // let fromAddress = fromToken.address;
      // let toAddress = toToken.address;
      // const etherToken = basicTokenMap[fromToken.chainId as ChainId];
      // const etherAddressLow = etherToken.address.toLowerCase();
      // const isFromEther = fromAddress.toLowerCase() === etherAddressLow;
      // const isToEther = toAddress.toLowerCase() === etherAddressLow;
      // const swapTransaction = new Transaction();
      // const programId = new PublicKey(STABLE_POOL_PROGRAM_ADDRESS);
      // let isNotSwap = false;
      // if (isFromEther) {
      //   fromAddress = etherToken.wrappedTokenAddress;
      //   await wrappedSOL(
      //     swapTransaction,
      //     connection,
      //     wallet.publicKey,
      //     fromAmountWeiBN.toString(),
      //   );
      //   isNotSwap =
      //     toAddress.toLowerCase() ===
      //     etherToken.wrappedTokenAddress.toLowerCase();
      // } else if (isToEther) {
      //   toAddress = etherToken.wrappedTokenAddress;
      //   isNotSwap =
      //     fromAddress.toLowerCase() ===
      //     etherToken.wrappedTokenAddress.toLowerCase();
      // }
      // if (!isNotSwap) {
      //   const provider = anchorWallet
      //     ? new AnchorProvider(
      //         connection,
      //         anchorWallet,
      //         AnchorProvider.defaultOptions(),
      //       )
      //     : undefined;
      //   if (!provider) return;
      //   const stablePoolProgram = new Program(idl as any, provider);
      //   const baseTokenPublicKey = new PublicKey(fromAddress);
      //   const quoteTokenPublicKey = new PublicKey(toAddress);
      //   const [poolAddress] = await getPoolAddress(
      //     baseTokenPublicKey,
      //     quoteTokenPublicKey,
      //     programId,
      //   );
      //   const baseTokenATA = await getAssociatedTokenAddress(
      //     baseTokenPublicKey,
      //     wallet.publicKey,
      //   );
      //   const quoteTokenATA = await getAssociatedTokenAddress(
      //     quoteTokenPublicKey,
      //     wallet.publicKey,
      //   );
      //   const quoteTokenAccounts =
      //     await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
      //       mint: quoteTokenPublicKey,
      //     });
      //   // need create ATA
      //   if (!quoteTokenAccounts.value.length) {
      //     swapTransaction.add(
      //       createAssociatedTokenAccountInstruction(
      //         wallet.publicKey,
      //         quoteTokenATA,
      //         wallet.publicKey,
      //         quoteTokenPublicKey,
      //       ),
      //     );
      //   }
      //   const swapAmount = toWei(fromAmount, fromToken.decimals);
      //   const minReceiveAmount = slippage
      //     ? toWei(
      //         new BigNumber(resAmount)
      //           .multipliedBy(1 - slippage / 100)
      //           .dp(toToken.decimals, BigNumber.ROUND_FLOOR),
      //         toToken.decimals,
      //       )
      //     : swapAmount;
      //   const [baseVault] = await getBaseVaultAddress(poolAddress, programId);
      //   const [quoteVault] = await getQuoteVaultAddress(poolAddress, programId);
      //   // const [authority] = await getAuthAddress(programId);
      //   const poolStateFetch =
      //     // @ts-ignore
      //     await stablePoolProgram.account.poolState.fetch(poolAddress);
      //   try {
      //     const isBaseBefore = sortsBeforeToken(
      //       baseTokenPublicKey,
      //       quoteTokenPublicKey,
      //     );
      //     const swapExecuteTransacation = await stablePoolProgram.methods
      //       .swap(fromAmountWeiBN, new BN(minReceiveAmount.toString()))
      //       .accounts({
      //         user: wallet.publicKey,
      //         poolState: poolAddress,
      //         userSourceToken: baseTokenATA,
      //         userDestinationToken: quoteTokenATA,
      //         baseVault,
      //         quoteVault,
      //         // authority,
      //         mtFeeBaseAccount: poolStateFetch.mtFeeBaseAccount,
      //         mtFeeQuoteAccount: poolStateFetch.mtFeeQuoteAccount,
      //         baseTokenMint: isBaseBefore
      //           ? baseTokenPublicKey
      //           : quoteTokenPublicKey,
      //         quoteTokenMint: isBaseBefore
      //           ? quoteTokenPublicKey
      //           : baseTokenPublicKey,
      //       })
      //       .transaction();
      //     swapTransaction.add(swapExecuteTransacation);
      //   } catch (error) {
      //     console.error('swapExecute:', error);
      //     throw error;
      //   }
      // }

      // const {
      //   context: { slot: minContextSlot },
      //   value: { blockhash, lastValidBlockHeight },
      // } = await connection.getLatestBlockhashAndContext();
      try {
        // 解码 base64 数据
        const serializedTransaction = Buffer.from(rawBrief.data, 'base64');

        // 使用 VersionedMessage 反序列化
        const message = VersionedMessage.deserialize(serializedTransaction);
        const transaction = new VersionedTransaction(message);

        // Remove transaction.sign() since wallet adapter handles signing

        return submission.executeCustom({
          brief: t`Swap`,
          subtitle,
          metadata: {
            [MetadataFlag.swap]: true,
          },
          handler: async (params) => {
            // const signature = await wallet.sendTransaction(
            //   swapTransaction,
            //   connection,
            //   { minContextSlot },
            // );
            try {
              // 发送交易
              const signature = await wallet.sendTransaction(
                transaction,
                connection,
              );
              params.onSubmit(signature);

              // 等待交易确认
              const latestBlockhash = await connection.getLatestBlockhash();
              const confirmResult = await connection.confirmTransaction({
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
              console.error('execute:', error);
              params.onError(error);
            }
          },
        });
      } catch (error) {
        console.error('execute:', error);
      }
    },
  });

  return {
    fetchRouteQuery,
    execute,
  };
}
