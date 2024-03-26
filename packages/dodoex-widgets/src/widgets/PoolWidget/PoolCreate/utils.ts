import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../hooks/Token';
import { formatTokenAmountNumber } from '../../../utils/formatter';
import { Version } from './types';

export const DEFAULT_FEE_RATE = '0.3';
export const MIN_FEE_RATE = 0.01;
export const MAX_FEE_RATE = 10;
export const DEFAULT_INIT_PRICE = '1';
export const DEFAULT_INIT_PRICE_STANDARD = '0.0000000000001';
export const MAX_INIT_PRICE = 100000000;
export const DEFAULT_SLIPPAGE_COEFFICIENT = '1';
export const DEFAULT_SLIPPAGE_COEFFICIENT_PEGGED = '0.0001';
export const MAX_SLIPPAGE_COEFFICIENT_PEGGED = '0.1';

export function computeInitPriceText({
  selectedVersion,
  quoteToken,
  initPrice,
  midPrice,
}: {
  selectedVersion: Version;
  quoteToken: TokenInfo;
  initPrice: string;
  midPrice?: BigNumber;
}) {
  if (selectedVersion === Version.standard) {
    if (!midPrice || midPrice.isZero()) {
      return null;
    }
    return formatTokenAmountNumber({
      input: midPrice,
      decimals: quoteToken.decimals,
    });
  }
  return formatTokenAmountNumber({
    input: initPrice,
    decimals: quoteToken.decimals,
  });
}
