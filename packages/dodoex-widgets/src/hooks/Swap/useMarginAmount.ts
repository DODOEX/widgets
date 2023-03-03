import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../Token';
import { toWei } from '../../utils';

export interface MarginAmountProps {
  token: TokenInfo | null,
  fiatPrice: string,
}
export function useMarginAmount({ token, fiatPrice }: MarginAmountProps) {

  const marginAmt = useMemo(() => {
    const decimals = token?.decimals ?? 6;
    const marginAmount =
      fiatPrice != null ? new BigNumber(500).div(fiatPrice) : new BigNumber(0);
    const marginAmountWei = toWei(marginAmount, decimals);
    const marginAmountString = marginAmountWei.lt(
      new BigNumber(1).times(new BigNumber(10).pow(decimals - 3)),
    )
      ? new BigNumber(0)
      : marginAmountWei;
    return marginAmountString.toString(10);
  }, [token?.decimals, fiatPrice]);

  return {
    marginAmount: marginAmt,
  };
}

