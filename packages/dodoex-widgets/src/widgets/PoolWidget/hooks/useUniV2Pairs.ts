import React from 'react';
import { TokenInfo } from '../../../hooks/Token';
import { CurrencyAmount, Percent, Price, Token } from '@uniswap/sdk-core';
import { basicTokenMap, ChainId, PoolType } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { poolApi } from '../utils';
import { Pair } from '@uniswap/v2-sdk';
import BigNumber from 'bignumber.js';
import { byWei, formatReadableNumber, toWei } from '../../../utils';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';

export function useUniV2Pairs({
  pool,
  baseAmount,
  quoteAmount,
}: {
  pool?: {
    type: string;
    address: string;
    baseToken: TokenInfo;
    quoteToken: TokenInfo;
  };
  baseAmount?: string;
  quoteAmount?: string;
}) {
  const [chainId, type, address, token0, token1, isRearTokenA] =
    React.useMemo(() => {
      const { baseToken, quoteToken } = pool || {};
      let isRearTokenA = false;
      if (!baseToken || !quoteToken)
        return [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          isRearTokenA,
        ];
      const chainId = baseToken.chainId as ChainId;
      const etherToken = basicTokenMap[chainId];
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
      return [
        chainId,
        pool?.type as PoolType,
        pool?.address,
        token0,
        token1,
        isRearTokenA,
      ];
    }, [pool]);

  const reserveQueryParams = poolApi.getReserveLpQuery(
    chainId as number,
    address,
    type,
    token0?.decimals,
    token1?.decimals,
  );
  const isAMMV2 = type === 'AMMV2';
  const reserveQuery = useQuery({
    ...reserveQueryParams,
    enabled: !!reserveQueryParams.enabled && isAMMV2,
  });
  const totalBaseLpQueryParams = poolApi.getTotalBaseLpQuery(
    chainId as number,
    address,
    type,
    token0?.decimals,
  );
  const totalBaseLpQuery = useQuery({
    ...totalBaseLpQueryParams,
    enabled: !!totalBaseLpQueryParams.enabled && isAMMV2,
  });
  const { account } = useWalletInfo();
  const userBaseLpQueryParams = poolApi.getUserBaseLpQuery(
    chainId,
    address,
    type,
    token0?.decimals,
    account,
  );
  const userBaseLpQuery = useQuery({
    ...userBaseLpQueryParams,
    enabled: !!userBaseLpQueryParams.enabled && isAMMV2,
  });
  const isExists = React.useMemo(
    () =>
      reserveQuery.isFetched &&
      !!reserveQuery.data &&
      totalBaseLpQuery.isFetched &&
      !!totalBaseLpQuery.data,
    [
      reserveQuery.isFetched,
      reserveQuery.data,
      totalBaseLpQuery.isFetched,
      totalBaseLpQuery.data,
    ],
  );

  const [pair, price] = React.useMemo(() => {
    if (!token0 || !token1 || isExists === false) return [null, null];
    const { baseReserve: _reserve0, quoteReserve: _reserve1 } =
      reserveQuery.data ?? {
        baseReserve: 0,
        quoteReserve: 0,
      };
    const currency0Amount = CurrencyAmount.fromRawAmount(
      token0,
      toWei(_reserve0, token0.decimals).toString(),
    );
    const currency1Amount = CurrencyAmount.fromRawAmount(
      token1,
      toWei(_reserve1, token1.decimals).toString(),
    );
    let currencyAAmount = currency0Amount;
    let currencyBAmount = currency1Amount;
    if (isRearTokenA) {
      currencyAAmount = currency1Amount;
      currencyBAmount = currency0Amount;
    }
    const pair = new Pair(currencyAAmount, currencyBAmount);
    if (currencyAAmount.equalTo(0) || currencyBAmount.equalTo(0))
      return [pair, null];
    const value = currencyBAmount.divide(currencyAAmount);
    const price = new Price(
      currencyAAmount.currency,
      currencyBAmount.currency,
      value.denominator,
      value.numerator,
    );
    return [pair, price];
  }, [token0, token1, reserveQuery.data, isRearTokenA]);

  const [priceBg, invertedPriceBg] = React.useMemo(() => {
    if (isExists) {
      if (price) {
        return [
          new BigNumber(price.toSignificant()),
          new BigNumber(price.invert().toSignificant()),
        ];
      }
      return [undefined, undefined];
    }
    if (!baseAmount || !quoteAmount) return [undefined, undefined];
    return [
      new BigNumber(quoteAmount).div(baseAmount),
      new BigNumber(baseAmount).div(quoteAmount),
    ];
  }, [price, isExists, baseAmount, quoteAmount]);

  const totalSupplyBg = totalBaseLpQuery.data;
  const totalSupplyStr = isExists
    ? totalBaseLpQuery.data && token0
      ? toWei(totalBaseLpQuery.data, token0?.decimals).toString()
      : ''
    : '0';
  let poolTokenPercentage: BigNumber | undefined;
  let liquidityMintedBg: BigNumber | undefined;
  const tokenA = isRearTokenA ? token1 : token0;
  const tokenB = isRearTokenA ? token0 : token1;
  if (
    pair?.liquidityToken &&
    totalSupplyStr &&
    totalSupplyBg &&
    tokenA &&
    tokenB
  ) {
    const totalSupply = CurrencyAmount.fromRawAmount(
      pair?.liquidityToken,
      totalSupplyStr,
    );
    if (baseAmount !== undefined && quoteAmount !== undefined) {
      if (Number(baseAmount) && Number(quoteAmount)) {
        const tokenAmountA = CurrencyAmount.fromRawAmount(
          tokenA,
          toWei(baseAmount as string, tokenA.decimals).toString(),
        );
        const tokenAmountB = CurrencyAmount.fromRawAmount(
          tokenB,
          toWei(quoteAmount as string, tokenB.decimals).toString(),
        );
        const liquidityMinted = pair?.getLiquidityMinted(
          totalSupply,
          tokenAmountA,
          tokenAmountB,
        );
        liquidityMintedBg = byWei(
          liquidityMinted.quotient.toString(),
          tokenA?.decimals,
        );
        poolTokenPercentage = liquidityMintedBg
          .div(totalSupplyBg.plus(liquidityMintedBg))
          .times(100);
      }
    } else {
      liquidityMintedBg = userBaseLpQuery.data || undefined;
      if (liquidityMintedBg) {
        poolTokenPercentage = liquidityMintedBg.div(totalSupplyBg).times(100);
      }
    }
  } else if (!isExists) {
    poolTokenPercentage = new BigNumber(100);
  }
  let shareOfPool = '-';
  if (pool?.baseToken && pool.quoteToken) {
    shareOfPool = poolTokenPercentage
      ? `${formatReadableNumber({
          input: poolTokenPercentage,
          showDecimals: 2,
          roundingMode: BigNumber.ROUND_HALF_UP,
        })}%`
      : '0%';
  }

  return {
    isRearTokenA,
    pair,
    price: priceBg,
    invertedPrice: invertedPriceBg,
    reserveQuery,
    totalBaseLpQuery,
    liquidityMinted: liquidityMintedBg,
    poolTokenPercentage,
    shareOfPool,
    isExists,
  };
}
