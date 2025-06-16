import BigNumber from 'bignumber.js';
import { Dispatch, useLayoutEffect, useMemo } from 'react';
import { useFetchFiatPriceBatch } from '../../../../hooks/useFetchFiatPriceBatch';
import { Actions, StateProps, Types } from '../reducer';

export function usePriceInit({
  isSingleTokenVersion,
  leftTokenAddress,
  baseToken,
  quoteToken,
  dispatch,
  isInitPrice,
}: {
  isSingleTokenVersion: boolean;
  leftTokenAddress: StateProps['leftTokenAddress'];
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  dispatch: Dispatch<Actions>;
  isInitPrice?: boolean;
}) {
  const tokens = useMemo(() => {
    if (baseToken && quoteToken) {
      return [baseToken, quoteToken];
    }
    return [];
  }, [baseToken, quoteToken]);
  const fiatPriceQuery = useFetchFiatPriceBatch({
    tokens,
  });

  const isForward = leftTokenAddress === baseToken?.address;

  const baseTokenFiatPrice = baseToken
    ? fiatPriceQuery.data?.get(baseToken.address)
    : undefined;
  const quoteTokenFiatPrice = quoteToken
    ? fiatPriceQuery.data?.get(quoteToken.address)
    : undefined;
  const currentPrice = useMemo(() => {
    const base2QuotePrice =
      baseTokenFiatPrice && quoteTokenFiatPrice
        ? new BigNumber(baseTokenFiatPrice).div(quoteTokenFiatPrice)
        : undefined;
    const quote2basePrice =
      baseTokenFiatPrice && quoteTokenFiatPrice
        ? new BigNumber(quoteTokenFiatPrice).div(baseTokenFiatPrice)
        : undefined;
    return isForward ? base2QuotePrice : quote2basePrice;
  }, [baseTokenFiatPrice, isForward, quoteTokenFiatPrice]);

  const isNullPrice = !currentPrice || currentPrice.isNaN();
  const isErrorPrice =
    !fiatPriceQuery.isLoading && !fiatPriceQuery.isPending && isNullPrice;

  // If the initial fiat currency price query fails, the user is allowed to enter the price and the checkbox is hidden.
  useLayoutEffect(() => {
    if (isErrorPrice) {
      dispatch({
        type: Types.UpdateIsFixedRatio,
        payload: false,
      });
    }
  }, [dispatch, isErrorPrice]);

  // The initial legal currency price query is successful, and fixedRatioPrice is initialized using this price.
  useLayoutEffect(() => {
    if (isSingleTokenVersion) {
      return;
    }
    if (baseTokenFiatPrice && isInitPrice) {
      dispatch({
        type: Types.InitFixedRatioPrice,
        payload: {
          baseTokenFiatPrice,
          quoteTokenFiatPrice,
        },
      });
    }
  }, [
    baseTokenFiatPrice,
    dispatch,
    isSingleTokenVersion,
    quoteTokenFiatPrice,
    isInitPrice,
  ]);

  return {
    fiatPriceLoading: fiatPriceQuery.isLoading || fiatPriceQuery.isPending,
    currentPrice,
    isErrorPrice,
    isNullPrice,
  };
}
