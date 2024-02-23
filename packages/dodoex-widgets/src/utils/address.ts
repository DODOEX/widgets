import { getAddress } from '@ethersproject/address';
import { ChainId, scanUrlDomainMap } from '../constants/chains';

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

export function isAddress(value: any): boolean {
  try {
    return !!getAddress(value);
  } catch {
    return false;
  }
}

export function isETHAddress(addr: string): boolean {
  const ETHAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  return addr.toLocaleLowerCase() === ETHAddress.toLocaleLowerCase();
}

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export default function isZero(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString);
}

/**
 * truncate pool address: 0xeBa959390016dd81419A189e5ef6F3B6720e5A90 => 0xeBa9...5A90
 * @param address pool address
 */
export function truncatePoolAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length,
  )}`;
}

export function getEtherscanPage(
  chainId: ChainId,
  id?: string | null,
  prefix = 'address',
) {
  return `https://${scanUrlDomainMap[chainId]}${id ? `/${prefix}/${id}` : ''}`;
}
