import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { Version, VersionItem } from '../types';
import {
  DEFAULT_SLIPPAGE_COEFFICIENT,
  MAX_SLIPPAGE_COEFFICIENT_PEGGED,
  MAX_FEE_RATE,
  MAX_INIT_PRICE,
  MIN_FEE_RATE,
} from '../utils';

export const validFeeRate = (feeRateStr?: string) => {
  if (!feeRateStr) return '';
  const feeRate = new BigNumber(feeRateStr);
  if (
    !feeRate.isNaN() &&
    (feeRate.lt(MIN_FEE_RATE) || feeRate.gt(MAX_FEE_RATE))
  ) {
    return t`The fee rate must be between 0.01% to 10%`;
  }
  return '';
};

export const validSlippageCoefficient = (
  slippageCoefficientStr: string,
  selectedVersion: Version,
) => {
  if (!slippageCoefficientStr) return '';
  const slippageCoefficient = new BigNumber(slippageCoefficientStr);
  if (
    !slippageCoefficient.isNaN() &&
    (slippageCoefficient.lt(0) ||
      slippageCoefficient.gt(
        selectedVersion === Version.pegged
          ? MAX_SLIPPAGE_COEFFICIENT_PEGGED
          : DEFAULT_SLIPPAGE_COEFFICIENT,
      ))
  ) {
    switch (selectedVersion) {
      case Version.standard:
      case Version.singleToken:
      case Version.marketMakerPool:
        return t`he slippage coefficient needs to be greater than or equal to 0, and less than or equal to 1.`;
      case Version.pegged:
        return t`The slippage coefficient needs to be greater than 0, and less than 0.1. `;
    }
  }
  return '';
};

export function validInitPrice(
  selectedVersion: Version,
  initPrice: string,
  quoteTokenDecimals: number,
) {
  if (!initPrice) {
    return '';
  }
  const initPriceBN = new BigNumber(initPrice);
  const decimalsLimit = Math.min(quoteTokenDecimals, 16);
  const minPrice = Number(`1e-${decimalsLimit}`);
  if (
    !initPriceBN.isNaN() &&
    (initPriceBN.lt(minPrice) || initPriceBN.gt(MAX_INIT_PRICE))
  ) {
    const min = minPrice.toFixed(decimalsLimit);
    switch (selectedVersion) {
      case Version.standard:
        return t`he min Price needs to be greater than ${min} and less than 100,000,000`;
      case Version.pegged:
      case Version.singleToken:
        return t`The initial price needs to be greater than ${min} and less than 100,000,000`;
      case Version.marketMakerPool:
        return t`The mid price needs to be greater than ${min} and less than 100,000,000`;
    }
  }
  return '';
}
