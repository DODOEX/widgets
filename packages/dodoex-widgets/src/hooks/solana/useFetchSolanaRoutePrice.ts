import React from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { FetchRoutePrice } from '../Swap/useFetchRoutePrice';
import { useMutation, useQuery } from '@tanstack/react-query';
import idl from '../../contract/solana/idl/DODOStablePool.json';
import {
  getBaseVaultAddress,
  getPoolAddress,
  getQuoteVaultAddress,
  sortsBeforeToken,
} from '../../contract/solana/helper';
import { STABLE_POOL_PROGRAM_ADDRESS } from '../../constants/solana';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { basicTokenMap, ChainId } from '@dodoex/api';
import { byWei, toWei } from '../../utils';
import BigNumber from 'bignumber.js';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { useSubmission } from '../Submission';
import { t } from '@lingui/macro';
import { MetadataFlag } from '../Submission/types';
import { wrappedSOL } from '../../contract/solana/transaction';

export function useFetchSolanaRoutePrice({
  toToken,
  fromToken,
  fromAmount,
  slippage,
}: FetchRoutePrice) {
  const { connection } = useConnection();
  const submission = useSubmission();

  const { account } = useWalletInfo();
  const wallet = useWallet();
  const { onlySolana } = useUserOptions();
  const anchorWallet = useAnchorWallet();

  const fetchRouteQuery = useQuery({
    enabled: !!(onlySolana && fromToken && toToken && fromAmount),
    queryKey: [
      'useFetchSolanaRoutePrice',
      fromToken,
      toToken,
      fromAmount,
      account,
    ],
    refetchInterval: 15000,
    queryFn: async () => {
      if (!fromToken || !toToken || !fromAmount) return;

      const swapAmount = toWei(fromAmount, fromToken.decimals);
      let fromAddress = fromToken.address;
      let toAddress = toToken.address;
      const etherToken = basicTokenMap[fromToken.chainId as ChainId];
      const etherAddressLow = etherToken.address.toLowerCase();
      const isFromEther = fromAddress.toLowerCase() === etherAddressLow;
      const isToEther = toAddress.toLowerCase() === etherAddressLow;
      let isWrappedOrUnWrapped = false;
      if (isFromEther) {
        fromAddress = etherToken.wrappedTokenAddress;
        isWrappedOrUnWrapped =
          toAddress.toLowerCase() ===
          etherToken.wrappedTokenAddress.toLowerCase();
      } else if (isToEther) {
        toAddress = etherToken.wrappedTokenAddress;
        isWrappedOrUnWrapped =
          fromAddress.toLowerCase() ===
          etherToken.wrappedTokenAddress.toLowerCase();
      }
      if (isWrappedOrUnWrapped) {
        return {
          resAmount: Number(fromAmount),
          baseFeeAmount: 0,
          additionalFeeAmount: 0,
          priceImpact: null,
          resPricePerToToken: 1,
          resPricePerFromToken: 1,
        };
      }

      const baseTokenPublicKey = new PublicKey(fromAddress);
      const quoteTokenPublicKey = new PublicKey(toAddress);
      const programId = new PublicKey(STABLE_POOL_PROGRAM_ADDRESS);
      const [poolAddress] = await getPoolAddress(
        baseTokenPublicKey,
        quoteTokenPublicKey,
        programId,
      );
      try {
        const provider = anchorWallet
          ? new AnchorProvider(
              connection,
              anchorWallet,
              AnchorProvider.defaultOptions(),
            )
          : undefined;
        if (!provider) return null;
        // @ts-ignore
        const stablePoolProgram = new Program(idl, provider);
        const view = await stablePoolProgram.methods
          .querySwap(new BN(swapAmount.toString()))
          .accounts({
            poolState: poolAddress,
            tokenMint: baseTokenPublicKey,
          })
          .view();
        const {
          0: resAmountWeiBN,
          1: lpFeeRateWeiBN,
          2: mtFeeRateWeiBN,
        } = view;
        const decimals = toToken.decimals;
        const fromAmountBg = new BigNumber(fromAmount);
        const resAmountBg = byWei(resAmountWeiBN.toString(), decimals);
        const fee = byWei(
          lpFeeRateWeiBN.add(mtFeeRateWeiBN).toNumber(),
          decimals,
        );
        const isValidResAmount = resAmountBg.gt(0);
        return {
          resAmount: resAmountBg.toNumber(),
          baseFeeAmount: fee.toNumber(),
          additionalFeeAmount: 0,
          priceImpact: null,
          resPricePerToToken: isValidResAmount
            ? fromAmountBg.div(resAmountBg).toNumber()
            : 0,
          resPricePerFromToken: isValidResAmount
            ? resAmountBg.div(fromAmountBg).toNumber()
            : 0,
        };
      } catch (e) {
        console.error('querySwap:', e);
        throw e;
      }
    },
  });

  const execute = useMutation({
    mutationFn: async ({
      resAmount,
      subtitle,
    }: {
      resAmount: number;
      subtitle: React.ReactNode;
    }) => {
      if (
        !fromToken ||
        !toToken ||
        !fromAmount ||
        !wallet.publicKey ||
        !wallet.wallet
      )
        return;

      const fromAmountWeiBN = new BN(
        toWei(fromAmount, fromToken.decimals).toString(),
      );
      let fromAddress = fromToken.address;
      let toAddress = toToken.address;
      const etherToken = basicTokenMap[fromToken.chainId as ChainId];
      const etherAddressLow = etherToken.address.toLowerCase();
      const isFromEther = fromAddress.toLowerCase() === etherAddressLow;
      const isToEther = toAddress.toLowerCase() === etherAddressLow;
      const swapTransaction = new Transaction();
      const programId = new PublicKey(STABLE_POOL_PROGRAM_ADDRESS);
      let isNotSwap = false;
      if (isFromEther) {
        fromAddress = etherToken.wrappedTokenAddress;
        await wrappedSOL(
          swapTransaction,
          connection,
          wallet.publicKey,
          fromAmountWeiBN.toString(),
        );
        isNotSwap =
          toAddress.toLowerCase() ===
          etherToken.wrappedTokenAddress.toLowerCase();
      } else if (isToEther) {
        toAddress = etherToken.wrappedTokenAddress;
        isNotSwap =
          fromAddress.toLowerCase() ===
          etherToken.wrappedTokenAddress.toLowerCase();
      }
      if (!isNotSwap) {
        const provider = anchorWallet
          ? new AnchorProvider(
              connection,
              anchorWallet,
              AnchorProvider.defaultOptions(),
            )
          : undefined;
        if (!provider) return;
        const stablePoolProgram = new Program(idl as any, provider);
        const baseTokenPublicKey = new PublicKey(fromAddress);
        const quoteTokenPublicKey = new PublicKey(toAddress);
        const [poolAddress] = await getPoolAddress(
          baseTokenPublicKey,
          quoteTokenPublicKey,
          programId,
        );
        const baseTokenATA = await getAssociatedTokenAddress(
          baseTokenPublicKey,
          wallet.publicKey,
        );
        const quoteTokenATA = await getAssociatedTokenAddress(
          quoteTokenPublicKey,
          wallet.publicKey,
        );
        const quoteTokenAccounts =
          await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
            mint: quoteTokenPublicKey,
          });
        // need create ATA
        if (!quoteTokenAccounts.value.length) {
          swapTransaction.add(
            createAssociatedTokenAccountInstruction(
              wallet.publicKey,
              quoteTokenATA,
              wallet.publicKey,
              quoteTokenPublicKey,
            ),
          );
        }
        const swapAmount = toWei(fromAmount, fromToken.decimals);
        const minReceiveAmount = slippage
          ? toWei(
              new BigNumber(resAmount)
                .multipliedBy(1 - slippage / 100)
                .dp(toToken.decimals, BigNumber.ROUND_FLOOR),
              toToken.decimals,
            )
          : swapAmount;
        const [baseVault] = await getBaseVaultAddress(poolAddress, programId);
        const [quoteVault] = await getQuoteVaultAddress(poolAddress, programId);
        // const [authority] = await getAuthAddress(programId);
        const poolStateFetch =
          // @ts-ignore
          await stablePoolProgram.account.poolState.fetch(poolAddress);
        try {
          const isBaseBefore = sortsBeforeToken(
            baseTokenPublicKey,
            quoteTokenPublicKey,
          );
          const swapExecuteTransacation = await stablePoolProgram.methods
            .swap(fromAmountWeiBN, new BN(minReceiveAmount.toString()))
            .accounts({
              user: wallet.publicKey,
              poolState: poolAddress,
              userSourceToken: baseTokenATA,
              userDestinationToken: quoteTokenATA,
              baseVault,
              quoteVault,
              // authority,
              mtFeeBaseAccount: poolStateFetch.mtFeeBaseAccount,
              mtFeeQuoteAccount: poolStateFetch.mtFeeQuoteAccount,
              baseTokenMint: isBaseBefore
                ? baseTokenPublicKey
                : quoteTokenPublicKey,
              quoteTokenMint: isBaseBefore
                ? quoteTokenPublicKey
                : baseTokenPublicKey,
            })
            .transaction();
          swapTransaction.add(swapExecuteTransacation);
        } catch (error) {
          console.error('swapExecute:', error);
          throw error;
        }
      }

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();
      // https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md
      return submission.executeCustom({
        brief: t`Swap`,
        subtitle,
        metadata: {
          [MetadataFlag.swap]: true,
        },
        handler: async (params) => {
          const signature = await wallet.sendTransaction(
            swapTransaction,
            connection,
            { minContextSlot },
          );
          params.onSubmit(signature);
          const result = await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature,
          });
          if (result.value.err) {
            params.onError(result.value.err);
            return;
          }
          params.onSuccess(signature);
        },
      });
    },
  });

  return {
    fetchRouteQuery,
    execute,
  };
}
