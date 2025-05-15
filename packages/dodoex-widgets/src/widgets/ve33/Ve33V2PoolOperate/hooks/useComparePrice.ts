import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../../hooks/Token';
import { useFetchFiatPrice } from '../../../../hooks/Swap';
import { formatShortNumber, getTokenPairCompareText } from '../../../../utils';

export function useDODOPrice({
  baseToken,
  quoteToken,
}: {
  baseToken?: TokenInfo;
  quoteToken?: TokenInfo;
}) {
  const { toFiatPrice, fromFiatPrice } = useFetchFiatPrice({
    fromToken: baseToken ?? null,
    toToken: quoteToken ?? null,
  });
  return getTokenPairCompareText({
    fromToken: baseToken,
    toToken: quoteToken,
    fromFiatPrice: fromFiatPrice ? new BigNumber(fromFiatPrice) : undefined,
    toFiatPrice: toFiatPrice ? new BigNumber(toFiatPrice) : undefined,
  });
}

export const lqAndDodoCompareSmallNum = 0.01;
export const lqAndDodoCompareWarningNum = 0.03;

export const useComparePrice = (
  baseToken?: TokenInfo,
  quoteToken?: TokenInfo,
  midPrice?: BigNumber,
) => {
  const { comparePrice } = useDODOPrice({
    baseToken,
    quoteToken,
  });

  const lqAndDodoCompare = useMemo(() => {
    if (
      !midPrice ||
      !comparePrice ||
      !comparePrice.toNumber() ||
      !midPrice.toNumber()
    )
      return 0;
    const difference = comparePrice.minus(midPrice);
    return Math.abs(difference.div(comparePrice).toNumber());
  }, [midPrice, comparePrice]);

  const lqAndDodoCompareText = useMemo(() => {
    return `${formatShortNumber(new BigNumber(lqAndDodoCompare).times(100))}%`;
  }, [lqAndDodoCompare]);

  return {
    lqAndDodoCompare,
    lqAndDodoCompareText,
    midPrice,
    isShowCompare: lqAndDodoCompare > lqAndDodoCompareSmallNum,
    isWarnCompare: lqAndDodoCompare > lqAndDodoCompareWarningNum,
  };
};
