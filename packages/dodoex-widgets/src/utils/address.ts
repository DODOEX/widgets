import { getAddress, getCreate2Address } from '@ethersproject/address';
import { ChainId } from '@dodoex/api';
import { scanUrlDomainMap } from '../constants/chains';
import { keccak256, pack } from '@ethersproject/solidity';
import { TokenInfo } from '../hooks/Token';
import { toWei } from './formatter';

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

export function sortsAddress(address0: string, address1: string): boolean {
  // invariant(address0 !== address1, 'ADDRESSES')
  return address0.toLowerCase() < address1.toLowerCase();
}

export function getEtherscanPage(
  chainId: ChainId,
  id?: string | null,
  prefix = 'address',
) {
  return `https://${scanUrlDomainMap[chainId]}${id ? `/${prefix}/${id}` : ''}`;
}

export async function openEtherscanPage(
  path: string | undefined,
  chainId: ChainId,
  customUrl?: string,
): Promise<void> {
  const scanUrlDomain = scanUrlDomainMap[chainId];

  window.open(
    `https://${customUrl ?? scanUrlDomain}${path ? `/${path}` : ''}`,
    '_blank',
    'noopener,noreferrer',
  );
}

export const UNI_INIT_CODE_HASH =
  '0x62543e8738c2449ea6d378de41d932dc92a6fabeb3cc19b8e4f05af1582b238c';

export function sortsBefore(tokenA: TokenInfo, tokenB: TokenInfo): boolean {
  if (tokenA.chainId !== tokenB.chainId) {
    throw new Error('token is not in the same chain');
  }
  return tokenA.address.toLowerCase() < tokenB.address.toLowerCase();
}

// https://github.com/Uniswap/sdks/blob/8b2649bf956f0cae69d58b8e3a4fd4cc8f164756/sdks/v2-sdk/src/entities/pair.ts#L24
export const computePairAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
}: {
  factoryAddress: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  fee: number;
}): string => {
  const [token0, token1] = sortsBefore(tokenA, tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]; // does safety checks
  return getCreate2Address(
    factoryAddress,
    keccak256(
      ['bytes'],
      [
        pack(
          ['address', 'address', 'uint256'],
          [token0.address, token1.address, toWei(fee, 18).toString()],
        ),
      ],
    ),
    UNI_INIT_CODE_HASH,
  );
};
