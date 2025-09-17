import { CoinBalance } from '@mysten/sui/client';
import { MIST_PER_SUI } from '@mysten/sui/utils';

// Convert MIST to Sui
export const convertMISTToSui = (balance: CoinBalance) => {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};
