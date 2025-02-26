import { ChainId } from '@dodoex/api';
import { PublicKey } from '@solana/web3.js';
import { scanUrlDomainMap } from '../constants/chains';

export const isSameAddress = (
  tokenAddress1: string,
  tokenAddress2: string,
): boolean => {
  try {
    // 对于 Solana 地址，使用 PublicKey 进行比较
    const pubKey1 = new PublicKey(tokenAddress1);
    const pubKey2 = new PublicKey(tokenAddress2);
    return pubKey1.equals(pubKey2);
  } catch {
    // 如果不是有效的 Solana 地址，返回 false
    return false;
  }
};

export function isAddress(value: any): boolean {
  try {
    // 尝试创建 PublicKey 实例来验证地址
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * 检查 Solana 地址是否为零地址
 * @param address Solana 地址字符串
 * @returns 如果是零地址则返回 true
 */
export default function isZero(address: string): boolean {
  if (!address) return false;
  try {
    const pubKey = new PublicKey(address);
    return pubKey.equals(PublicKey.default);
  } catch {
    return false;
  }
}
/**
 * truncate address:
 * - Solana: HN7cABqLq46Es1jh92dQQisAq662SmxGkXPnB4LZFN3 => HN7c...ZFN3
 * - EVM: 0xeBa959390016dd81419A189e5ef6F3B6720e5A90 => 0xeBa9...5A90
 * @param address wallet or token address
 */
export function truncatePoolAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  try {
    // 验证是否为 Solana 地址
    new PublicKey(address);
    // Solana 地址通常是 32-44 个字符
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  } catch {
    // 如果不是 Solana 地址，保持原有的 EVM 地址截断逻辑
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
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
