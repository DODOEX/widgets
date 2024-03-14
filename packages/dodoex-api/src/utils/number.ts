import { BigNumber } from 'bignumber.js';
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';

export const byWei = (
  amount: BigNumber | EthersBigNumber | string | number,
  decimals: number,
) => {
  return new BigNumber(
    EthersBigNumber.isBigNumber(amount) ? amount.toString() : amount,
  ).div(10 ** decimals);
};
