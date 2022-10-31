import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

export function toRpcQuantity(x: number | string | BigNumber): string {
  let hex: string;
  if (typeof x === 'number' || typeof x === 'bigint') {
    // TODO: check that number is safe
    hex = `0x${x.toString(16)}`;
  } else if (typeof x === 'string') {
    if (!x.startsWith('0x')) {
      throw new Error('Only 0x-prefixed hex-encoded strings are accepted');
    }
    hex = x;
  } else if ('toString' in x) {
    hex = x.toString(16);
  } else {
    throw new Error(`${x as any} cannot be converted to an RPC quantity`);
  }

  if (hex === '0x0') return hex;

  return hex.startsWith('0x') ? hex.replace(/0x0+/, '0x') : `0x${hex}`;
}

export async function setBalance(balance: number) {
  const account = hardhat.account.address;
  const balanceBigInt = ethers.utils.parseEther(String(balance));
  const balanceHex = ethers.utils.hexValue(balanceBigInt);
  await hardhat.hre.network.provider.request({
    method: 'hardhat_setBalance',
    params: [account, balanceHex],
  });
}

export async function mineUpToNext() {
  await hardhat.hre.network.provider.request({
    method: 'hardhat_mine',
    params: [toRpcQuantity(1)],
  });
}

export async function getLatestBlock() {
  const height = await hardhat.hre.network.provider.request({
    method: 'eth_blockNumber',
    params: [],
  });

  return parseInt(height as string, 16);
}
