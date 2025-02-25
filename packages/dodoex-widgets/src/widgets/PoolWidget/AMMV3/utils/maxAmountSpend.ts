import BigNumber from 'bignumber.js';

const MIN_NATIVE_CURRENCY_FOR_GAS: BigNumber = new BigNumber(0.01); // .01 ETH

/**
 * Given some token amount, return the max that can be spent of it
 * @param amount to return max of
 */
export function maxAmountSpend(amount?: BigNumber): BigNumber | undefined {
  if (!amount) {
    return undefined;
  }

  if (amount.gt(MIN_NATIVE_CURRENCY_FOR_GAS)) {
    return amount.minus(MIN_NATIVE_CURRENCY_FOR_GAS);
  }

  return new BigNumber(0);
}
