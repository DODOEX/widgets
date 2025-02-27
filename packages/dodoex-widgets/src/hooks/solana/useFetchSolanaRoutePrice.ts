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
import { toWei } from '../../utils/formatter';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useGetAPIService } from '../setting/useGetAPIService';
import { useSubmission } from '../Submission';
import { MetadataFlag } from '../Submission/types';
import { TokenInfo } from '../Token/type';

const routeApiResponseDataExample = {
  resAmount: 1.254571586,
  priceImpact: 0.0009264805074319024,
  useSource: 'DODORoute',
  resPricePerToToken: 0.7970848464600887,
  resPricePerFromToken: 1.254571586,
  inputMint: '36LzY5yGXRvySE7safeHuLejhsg8mPjmPiitAQr3Axva',
  inAmount: '1000000000',
  inputMintDecimal: 9,
  outputMint: 'GLfqSuSUUB6mTA4rfk5BHYbRjQHxYknJu8pSHcMnYgzE',
  outAmount: '1254571586',
  outputMintDecimal: 9,
  minOutAmount: '1251435157',
  inAmountWithOutDecimals: 1,
  outAmountWithOutDecimals: 1.254571586,
  slippageBps: 25,
  routePlan: [
    {
      swapInfo: {
        ammKey: 'B3TmxwexWbYnEMiBpsoBs5vbZkKYWKiP5CjbSSdGGgHe',
        label: 'RaydiumCp',
        inputMint: '36LzY5yGXRvySE7safeHuLejhsg8mPjmPiitAQr3Axva',
        outputMint: 'GLfqSuSUUB6mTA4rfk5BHYbRjQHxYknJu8pSHcMnYgzE',
        inAmount: '1000000000',
        outAmount: '1254571586',
        feeAmount: '0',
        feeMint: '',
      },
      percent: 100,
    },
  ],
  data: 'AAEAChSuXV09eQi5aHNhWEW1jFv4lDcahmpramrXhtbQTnas4kvWXPWG6Vbxf/7q70hi0s8DDWusnKeAXu90htwFOA8OvnoPe+TUBp5lvnXY9y0yMD31eXg794Yg90em44X28tDKSW1py+24aIFgVQ9a9XrctHUb6/NJmrqg3oyn1V+ZroUvQIBGTxik6sB74VvnfvcammtP9ceYIoHVN6MehteoSaT9rMtgHNg7Ie9LrrVSMh+CMrQ+cicOzg0+Nnlq1PGVNk5F4bURcl3AiWo8Qr5DYu4GOVOg77z5Vorbd/rPyQUznmWVtrvlWmaL1b7JGvN4GOM7tn+GXMcADjaUSt+ycCcJyfK/xs90vGGpM1m9E0iwTQAbNDSnxyrvvof9n8vSE/Lm85RnFwaIr5jr/IEahuI6+aJaCvp4mreIAmdnXh8V4gdKzcSFCVQAieAc3mg9Q7q/lTDHwXKzcDemu4dH4+lAHo6TPQk9tjLV6S/fsWhkRwrNS/HycJkGtZkfAlsG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqYyXJY9OJInxuz0QKRSODYMLWhOZ2v8QhASOe9jb6fhZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiyedrj0oRQl48d87XdZR/4JkGNuN0fmy6Kukj5DHqJ6ZarZoprWqOL40g90xCJe6Uz+PmiDfiqqufmr9+Ai7hp4/UvNGy9E7ywCHgAB4UHLaZdDegVfOxDEMlFbRGXbFynzuLbKQ30Ca3pj/0Wq5lWzvmdbFt2OddEbICsJmWXwMGRm/lIRcy/+ytunLDm+e8jOW7xfcSayxDmzpAAAAAq9rG8Y6kKJejJQyUmvIihA9hnWR1OmTRgu1jZfB2klACEwAFApxAEAASGgAKCwECAwQFDA0ODwMQEQYEBQcIDAwKCwkSKNCFXXgQcCFCAMqaOwAAAABCPsdKAAAAAJVil0oAAAAAAQAAAABkAAE=',
  lastValidBlockHeight: 2378132,
};

const routeApiResponseExample = {
  status: 200 | -1,
  data: routeApiResponseDataExample,
};

export type IRouteResponseData = typeof routeApiResponseExample;

export type IRouteResponse = typeof routeApiResponseDataExample | null;

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
        return null;
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
            user: account || 'CjeWeg7Pfyq5VcakxaUwBHCZoEePKYuZTYgfkXaaiCw3',
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
      return null;
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
