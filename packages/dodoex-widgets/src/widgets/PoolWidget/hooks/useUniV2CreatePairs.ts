import { getCreatePoolKeys } from '@raydium-io/raydium-sdk-v2';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import React from 'react';
import {
  CREATE_CPMM_CONFIG,
  CREATE_CPMM_POOL_PROGRAM,
} from '../../../hooks/raydium-sdk-V2/common/programId';
import { TokenInfo } from '../../../hooks/Token';
import { useUniV2Pairs } from './useUniV2Pairs';

export function useUniV2CreatePairs({
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  feeIndex,
  slippage,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  baseAmount: string;
  quoteAmount: string;
  feeIndex: number;
  slippage: number;
}) {
  const [poolKeys, isInvalidPair] = React.useMemo(() => {
    if (!baseToken || !quoteToken || feeIndex == null) {
      return [undefined, true];
    }

    const isFront = new BN(new PublicKey(baseToken.address).toBuffer()).lte(
      new BN(new PublicKey(quoteToken.address).toBuffer()),
    );
    const [mintA, mintB] = isFront
      ? [baseToken, quoteToken]
      : [quoteToken, baseToken];
    const [mintAPubkey, mintBPubkey] = [
      new PublicKey(mintA.address),
      new PublicKey(mintB.address),
    ];
    return [
      getCreatePoolKeys({
        poolId: undefined,
        programId: CREATE_CPMM_POOL_PROGRAM,
        configId: new PublicKey(CREATE_CPMM_CONFIG[feeIndex].id),
        mintA: mintAPubkey,
        mintB: mintBPubkey,
      }),
      mintAPubkey.toBase58() === mintBPubkey.toBase58(),
    ];
  }, [feeIndex, baseToken, quoteToken]);

  const {
    price,
    invertedPrice,
    poolInfoQuery,
    lpBalanceQuery,
    lpBalance,
    lpBalancePercentage,
    lpToAmountA,
    lpToAmountB,
    liquidityMinted,
    pairMintAAmount,
    pairMintBAmount,
    isExists,
  } = useUniV2Pairs({
    pool:
      baseToken && quoteToken && poolKeys
        ? {
            baseToken,
            quoteToken,
            address: poolKeys.poolId.toBase58(),
          }
        : undefined,
    baseAmount,
    quoteAmount,
    slippage,
  });

  return {
    poolKeys: poolInfoQuery.data?.poolKeys,
    poolInfo: poolInfoQuery.data?.poolInfo,
    pairAddress: poolKeys?.poolId?.toBase58(),
    isInvalidPair,
    price,
    invertedPrice,
    poolInfoLoading: poolInfoQuery.isLoading,
    lpBalanceLoading: lpBalanceQuery.isLoading,
    lpBalance,
    lpBalancePercentage,
    lpToAmountA,
    lpToAmountB,
    liquidityMinted,
    pairMintAAmount,
    pairMintBAmount,
    isExists,
  };
}
