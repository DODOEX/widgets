import BigNumber from 'bignumber.js';
import { toWei } from './formatter';

export function NumberToHex(number?: number | string | BigNumber) {
  if (!number && typeof number !== 'number') return number;
  let value = '';
  if (BigNumber.isBigNumber(number)) {
    value = number.toString(16);
  } else {
    value = new BigNumber(number).toString(16);
  }
  if (value.length % 2) { return ("0x0" + value); }
  return "0x" + value;
}

export function getEthersValue(number: number | string | BigNumber) {
  const value = toWei(number, 18);
  return NumberToHex(value);
}