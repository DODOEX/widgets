import BigNumber from 'bignumber.js';
import { CoinBalance } from '@mysten/sui/client';

export const formatSuiCoinBalance = (
  balance: CoinBalance,
  decimals: number,
) => {
  const divisor = new BigNumber(10).pow(decimals);
  return new BigNumber(balance.totalBalance).div(divisor);
};
