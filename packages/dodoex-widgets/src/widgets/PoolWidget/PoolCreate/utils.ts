import { basicTokenMap, ChainId } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../hooks/Token';
import { isSameAddress } from '../../../utils/address';
import { formatTokenAmountNumber } from '../../../utils/formatter';
import { Version } from './types';

export const DEFAULT_FEE_RATE = '0.3';
export const MIN_FEE_RATE = 0;
export const MAX_FEE_RATE = 10;
export const DEFAULT_INIT_PRICE = '1';
/**
 * The standard pool is not necessarily fixed to this. When 18 - baseDecimals + quoteDecimals is less than the number of decimal places, use the bottom-line selection.
 */
export const DEFAULT_INIT_PRICE_STANDARD = '0.0000000000001';
export const MAX_INIT_PRICE = 100000000;
export const DEFAULT_SLIPPAGE_COEFFICIENT = '1';
export const DEFAULT_SLIPPAGE_COEFFICIENT_PEGGED = '0.0001';
export const MAX_SLIPPAGE_COEFFICIENT_PEGGED = '0.1';

export const PEGGED_RATIO_DECIMALS = 8;

export const PEGGED_MINIMUM_LOST_RATIO = '0.0000000001';

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

/**
 * Calculate the recommended liquidity ratio of the pegged pool
 */
export function computePeggedRecommendRatio({
  initPrice,
}: {
  initPrice: string;
}) {
  const initPriceBN = new BigNumber(initPrice);
  if (!initPriceBN.isFinite() || initPriceBN.lte(0)) {
    return {
      base: null,
      quote: null,
    };
  }
  const oneBN = new BigNumber(1);
  const base = oneBN
    .dividedBy(oneBN.plus(initPriceBN))
    .dp(PEGGED_RATIO_DECIMALS, BigNumber.ROUND_DOWN);
  const quote = oneBN
    .minus(base)
    .dp(PEGGED_RATIO_DECIMALS, BigNumber.ROUND_DOWN);

  return {
    base,
    quote,
  };
}

export function isGasWrapGasTokenPair({
  chainId,
  baseToken,
  quoteToken,
}: {
  chainId: number;
  baseToken: TokenInfo | null;
  quoteToken: TokenInfo | null;
}) {
  const etherToken = basicTokenMap[chainId as ChainId];
  if (!baseToken || !quoteToken) return false;
  if (
    isSameAddress(baseToken.address, etherToken.address) &&
    isSameAddress(quoteToken.address, etherToken.wrappedTokenAddress)
  ) {
    return true;
  }

  if (
    isSameAddress(baseToken.address, etherToken.wrappedTokenAddress) &&
    isSameAddress(quoteToken.address, etherToken.address)
  ) {
    return true;
  }

  return false;
}
