import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../Token';
import { toWei } from '../../utils';

export interface MarginAmountProps {
  fromToken: TokenInfo | null,
  fromFiatPrice: string,
}
export function useMarginAmount({ fromToken, fromFiatPrice }: MarginAmountProps) {

  const marginAmt = useMemo(() => {
    const fiatPrice = fromFiatPrice;
    const decimals = fromToken?.decimals ?? 6;
    const marginAmount =
      fiatPrice != null ? new BigNumber(500).div(fiatPrice) : new BigNumber(0);
    const marginAmountWei = toWei(marginAmount, decimals);
    const marginAmountString = marginAmountWei.lt(
      new BigNumber(1).times(new BigNumber(10).pow(decimals - 3)),
    )
      ? new BigNumber(0)
      : marginAmountWei;
    return marginAmountString.toString(10);
  }, [fromToken?.decimals, fromFiatPrice]);

  return {
    marginAmount: marginAmt,
  };
}

