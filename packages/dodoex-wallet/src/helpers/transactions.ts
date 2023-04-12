import { TransactionParams } from '@metamask/eth-json-rpc-middleware';
import { UnsignedTransaction } from '@ethersproject/transactions';
import walletState from '../state';

const TRANSACTION_TYPES = {
  LEGACY: 0,
  ACCESS_LIST: 1,
  FEE_MARKET: 2,
};

const supportsEIP1559Cache: { [key: number]: boolean } = {};

async function getEIP1559Compatibility(chainId: number) {
  if (supportsEIP1559Cache[chainId] !== undefined) {
    return supportsEIP1559Cache[chainId];
  }
  if (!walletState.provider) return false;
  const data = await walletState.provider.getBlock('latest');
  const res = data.baseFeePerGas !== undefined;
  supportsEIP1559Cache[chainId] = res;
  return res;
}

export type FetchGasPrice = (chainId: number) => Promise<{
  gasPrice?: number;
  maxFeePerGas?: number;
  maxPriorityFeePerGas?: number;
}>;

export async function convertTransactionType(
  chainId: number,
  txParams: TransactionParams,
  fetchGasPrice?: FetchGasPrice,
) {
  const newTxData = txParams as UnsignedTransaction;
  newTxData.type = TRANSACTION_TYPES.LEGACY;
  if (!fetchGasPrice) return newTxData;
  const supportsEIP1559 = await getEIP1559Compatibility(chainId);
  if (supportsEIP1559) {
    const gasPrice = await fetchGasPrice(chainId);
    if (gasPrice?.maxFeePerGas && gasPrice?.maxPriorityFeePerGas) {
      newTxData.maxFeePerGas = gasPrice.maxFeePerGas;
      newTxData.maxPriorityFeePerGas = gasPrice.maxPriorityFeePerGas;
      newTxData.type = TRANSACTION_TYPES.FEE_MARKET;
    }
  }
  return newTxData;
}
