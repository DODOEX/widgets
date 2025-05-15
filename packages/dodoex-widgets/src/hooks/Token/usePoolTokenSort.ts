import React from 'react';
import { basicTokenMap, ChainId } from '@dodoex/api';
import { TokenInfo } from './type';
import { sortsBefore } from '../../utils';

export function usePoolTokenSort({
  baseToken,
  quoteToken,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
}) {
  return React.useMemo(() => {
    let isRearTokenA = false;
    let isBaseTokenNative = false;
    let isQuoteTokenNative = false;
    if (!baseToken || !quoteToken)
      return {
        chainId: undefined,
        isRearTokenA: false,
        token0: undefined,
        token1: undefined,
        token0Wrapped: undefined,
        token1Wrapped: undefined,
        isBaseTokenNative,
        isQuoteTokenNative,
      };
    const chainId = baseToken.chainId as ChainId;
    const etherToken = basicTokenMap[chainId];
    isBaseTokenNative =
      etherToken.address?.toLowerCase() === baseToken.address.toLowerCase();
    isQuoteTokenNative =
      etherToken.address?.toLowerCase() === quoteToken.address.toLowerCase();
    const baseTokenWrapped = isBaseTokenNative
      ? {
          ...baseToken,
          address: etherToken.wrappedTokenAddress,
          symbol: etherToken.wrappedTokenSymbol,
        }
      : baseToken;
    const quoteTokenWrapped = isQuoteTokenNative
      ? {
          ...quoteToken,
          address: etherToken.wrappedTokenAddress,
          symbol: etherToken.wrappedTokenSymbol,
        }
      : quoteToken;

    isRearTokenA = !sortsBefore(baseTokenWrapped, quoteTokenWrapped);
    const [token0, token1, token0Wrapped, token1Wrapped] = !isRearTokenA
      ? [baseToken, quoteToken, baseTokenWrapped, quoteTokenWrapped]
      : [quoteToken, baseToken, quoteTokenWrapped, baseTokenWrapped];

    return {
      chainId,
      isRearTokenA,
      token0,
      token1,
      token0Wrapped,
      token1Wrapped,
      isBaseTokenNative,
      isQuoteTokenNative,
    };
  }, [baseToken, quoteToken]);
}
