import { ChainId } from '@dodoex/api';
import { FetchVe33PoolItem, PoolTypeE, Ve33PoolInfoI } from './types';

import { FeeE } from './types';

export const formatFee = ({ type, fee }: { type: PoolTypeE; fee: FeeE }) => {
  if (type === PoolTypeE.Pool) {
    return `${fee / 100}%`;
  }
  return `${fee / 10000}%`;
};

export function compositePoolInfo(
  pool: NonNullable<FetchVe33PoolItem>,
  chainId: ChainId,
): Ve33PoolInfoI {
  return {
    ...pool,
    chainId,
    stable: pool.title !== 'V2.Volatile',
    fee: pool.feeRate,
    type: pool.version === 'v2' ? PoolTypeE.Pool : PoolTypeE.CLPool,
    baseToken: {
      chainId,
      address: pool.token0Address,
      name: pool.token0Name,
      decimals: pool.token0Decimals,
      symbol: pool.token0Symbol,
      logoURI: undefined,
    },
    quoteToken: {
      chainId,
      address: pool.token1Address,
      name: pool.token1Name,
      decimals: pool.token1Decimals,
      symbol: pool.token1Symbol,
      logoURI: undefined,
    },
  };
}
