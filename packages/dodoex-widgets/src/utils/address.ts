import { getAddress } from '@ethersproject/address';

export const isSameAddress = (
  tokenAddress1: string,
  tokenAddress2: string,
): boolean => {
  if (tokenAddress1.length === 0 || tokenAddress2.length === 0) {
    return false;
  }
  if (tokenAddress2.length === tokenAddress1.length) {
    return tokenAddress1.toLowerCase() === tokenAddress2.toLowerCase();
  }
  const trimAddress1 = tokenAddress1
    .substring(2, tokenAddress1.length)
    .toLowerCase();
  const trimAddress2 = tokenAddress2
    .substring(2, tokenAddress2.length)
    .toLowerCase();
  if (trimAddress1.length > trimAddress2.length) {
    return trimAddress1.endsWith(trimAddress2);
  }
  return trimAddress2.endsWith(trimAddress1);
};

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export default function isZero(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString);
}
