import { Pair } from '@uniswap/v2-sdk';
import { CurrencyAmount, Percent, Price, Token } from '@uniswap/sdk-core';
import { TokenInfo } from '../../../hooks/Token';
import React from 'react';
import { basicTokenMap, ChainId, contractConfig } from '@dodoex/api';
import { computePairAddress, toWei } from '../../../utils';
import { uniPoolV2Api } from '../utils';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
export function useUniV2Pairs({
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

  const reserveQuery = useQuery({
    ...uniPoolV2Api.getReserves(baseToken?.chainId, pairAddress),
    retry: false,
  });
  const totalSupplyQuery = useQuery({
    ...uniPoolV2Api.getTotalSupply(baseToken?.chainId, pairAddress),
    retry: false,
  });
  const isExists = React.useMemo(
    () =>
      reserveQuery.isFetched &&
      !!reserveQuery.data &&
      totalSupplyQuery.isFetched &&
      !!totalSupplyQuery.data,
    [
      reserveQuery.isFetched,
      reserveQuery.data,
      totalSupplyQuery.isFetched,
      totalSupplyQuery.data,
    ],
  );

  const [pair, price] = React.useMemo(() => {
    if (!token0 || !token1 || !isExists) return [null, null];
    const { _reserve0, _reserve1 } = reserveQuery.data ?? {
      _reserve0: 0,
      _reserve1: 0,
    };
    const currency0Amount = CurrencyAmount.fromRawAmount(
      token0,
      _reserve0.toString(),
    );
    const currency1Amount = CurrencyAmount.fromRawAmount(
      token1,
      _reserve1.toString(),
    );
    let currencyAAmount = currency0Amount;
    let currencyBAmount = currency1Amount;
    if (isRearTokenA) {
      currencyAAmount = currency1Amount;
      currencyBAmount = currency0Amount;
    }
    const pair = new Pair(currencyAAmount, currencyBAmount);
    if (!_reserve0 && !_reserve1) return [pair, null];
    const value = currencyBAmount.divide(currencyAAmount);
    const price = new Price(
      currencyAAmount.currency,
      currencyBAmount.currency,
      value.denominator,
      value.numerator,
    );
    return [pair, price];
  }, [token0, token1, reserveQuery.data, isRearTokenA]);

  const totalSupplyStr = isExists ? totalSupplyQuery.data?.toString() : '0';
  let poolTokenPercentage: BigNumber | undefined;
  let liquidityMinted: CurrencyAmount<Token> | undefined;
  if (
    pair?.liquidityToken &&
    totalSupplyStr &&
    tokenA &&
    tokenB &&
    Number(baseAmount) &&
    Number(quoteAmount)
  ) {
    const totalSupply = CurrencyAmount.fromRawAmount(
      pair?.liquidityToken,
      totalSupplyStr,
    );
    const tokenAmountA = CurrencyAmount.fromRawAmount(
      tokenA,
      toWei(baseAmount, tokenA.decimals).toString(),
    );
    const tokenAmountB = CurrencyAmount.fromRawAmount(
      tokenB,
      toWei(quoteAmount, tokenB.decimals).toString(),
    );
    liquidityMinted = pair?.getLiquidityMinted(
      totalSupply,
      tokenAmountA,
      tokenAmountB,
    );

    const percent = new Percent(
      liquidityMinted.quotient,
      totalSupply.add(liquidityMinted).quotient,
    );
    poolTokenPercentage = new BigNumber(percent.toSignificant());
  } else if (!isExists) {
    poolTokenPercentage = new BigNumber(100);
  }

  const [priceBg, invertedPriceBg] = React.useMemo(() => {
    if (isExists) {
      if (price) {
        return [
          new BigNumber(price.toSignificant()),
          new BigNumber(price.invert().toSignificant()),
        ];
      }
      return [null, null];
    }
    if (!baseAmount || !quoteAmount) return [null, null];
    return [
      new BigNumber(quoteAmount).div(baseAmount),
      new BigNumber(baseAmount).div(quoteAmount),
    ];
  }, [price, isExists, baseAmount, quoteAmount]);

  return {
    pairAddress,
    pair,
    isInvalidPair,
    price: priceBg,
    invertedPrice: invertedPriceBg,
    priceLoading: reserveQuery.isLoading,
    liquidityMinted: liquidityMinted
      ? new BigNumber(liquidityMinted.toSignificant())
      : undefined,
    poolTokenPercentage,
    isExists,
  };
}
