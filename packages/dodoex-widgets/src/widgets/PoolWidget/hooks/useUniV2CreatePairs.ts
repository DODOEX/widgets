import { Token } from '@uniswap/sdk-core';
import { TokenInfo } from '../../../hooks/Token';
import React from 'react';
import { basicTokenMap, ChainId, contractConfig } from '@dodoex/api';
import { computePairAddress } from '../../../utils';
import { useUniV2Pairs } from './useUniV2Pairs';
export function useUniV2CreatePairs({
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  fee,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  baseAmount: string;
  quoteAmount: string;
  fee: number;
}) {
  const [tokenA, tokenB, token0, token1, isRearTokenA, isInvalidPair] =
    React.useMemo(() => {
      let isRearTokenA = false;
      if (!baseToken || !quoteToken)
        return [null, null, null, null, isRearTokenA, false];
      const etherToken = basicTokenMap[baseToken.chainId as ChainId];
      const isBaseTokenEther =
        etherToken.address?.toLowerCase() === baseToken.address.toLowerCase();
      const isQuoteTokenEther =
        etherToken.address?.toLowerCase() === quoteToken.address.toLowerCase();
      const baseTokenAddress = isBaseTokenEther
        ? etherToken.wrappedTokenAddress
        : baseToken.address;
      const quoteTokenAddress = isQuoteTokenEther
        ? etherToken.wrappedTokenAddress
        : quoteToken.address;

      const isInvalidPair =
        baseTokenAddress.toLowerCase() === quoteTokenAddress.toLowerCase();
      if (isInvalidPair) {
        return [null, null, null, null, isRearTokenA, true];
      }
      const tokenA = new Token(
        baseToken.chainId,
        baseTokenAddress,
        baseToken.decimals,
        baseToken.symbol,
        baseToken.name,
      );
      const tokenB = new Token(
        quoteToken.chainId,
        quoteTokenAddress,
        quoteToken.decimals,
        quoteToken.symbol,
        quoteToken.name,
      );
      isRearTokenA = !tokenA.sortsBefore(tokenB);
      const [token0, token1] = !isRearTokenA
        ? [tokenA, tokenB]
        : [tokenB, tokenA];
      return [tokenA, tokenB, token0, token1, isRearTokenA, isInvalidPair];
    }, [baseToken, quoteToken]);

  const pairAddress = React.useMemo(() => {
    if (!tokenA || !tokenB || fee === undefined) return undefined;
    const chainId = tokenA.chainId;
    const factoryAddress = chainId
      ? contractConfig[chainId as ChainId]?.AMM_V2_FACTORY_ADDRESS
      : undefined;
    if (!factoryAddress) return undefined;
    return computePairAddress({
      factoryAddress,
      tokenA: tokenA as TokenInfo,
      tokenB: tokenB as TokenInfo,
      fee,
    });
  }, [tokenA, tokenB, fee]);

  const {
    pair,
    price,
    invertedPrice,
    reserveQuery,
    liquidityMinted,
    shareOfPool,
    isExists,
  } = useUniV2Pairs({
    pool:
      baseToken && quoteToken && pairAddress
        ? {
            baseToken,
            quoteToken,
            type: 'AMMV2',
            address: pairAddress,
          }
        : undefined,
    baseAmount,
    quoteAmount,
  });

  return {
    pairAddress,
    pair,
    isInvalidPair,
    price,
    invertedPrice,
    priceLoading: reserveQuery.isLoading,
    liquidityMinted,
    shareOfPool,
    isExists,
  };
}
