import { JsonRpcProvider } from '@ethersproject/providers';
import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import isZero from '../../utils/address';
import { t } from '@lingui/macro';
import erc20ABI from './abis/erc20ABI';
import { getContract } from './useMultiContract';

export type Deferrable<T> = {
  [K in keyof T]: T[K] | Promise<T[K]>;
};
// Meow: trust web3 / etherscan result
export enum WatchResult {
  Failed = 0, // 0:Failure
  Success, // 1:Success
  Warning, // 2:Warning(Current nonce transactions are overwritten, such as user acceleration/cancellation in wallet.)
}

export const getEstimateGas = async (
  params: any,
  provider: JsonRpcProvider,
): Promise<EthersBigNumber | null> => {
  const { value, from, to, data } = params;
  const estimateTarget = {
    from,
    to,
    value,
    data,
  };
  if (!value || isZero(value)) {
    delete estimateTarget.value;
  }
  try {
    const res = await provider.estimateGas(estimateTarget);
    return res.add(50000);
  } catch (error) {
    provider
      .call(estimateTarget)
      .then((result) => {
        if (process.env.NODE_ENV !== 'test') {
          throw new Error(
            'Unexpected issue with estimating the gas. Please try again.',
          );
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== 'test') {
          throw error;
        }
      });
  }
  return null;
};

export const getGasPrice = async (
  provider: JsonRpcProvider,
): Promise<EthersBigNumber | null> => {
  try {
    const res = await provider.getGasPrice();
    return res;
  } catch (error) {
    provider
      .call({})
      .then((result) => {
        throw new Error(
          'Unexpected issue with getting the gas price. Please try again.',
        );
      })
      .catch((error) => {
        throw error;
      });
  }
  return null;
};

export const sendTransaction = async (
  params: Deferrable<TransactionRequest>,
  provider: JsonRpcProvider,
) => {
  try {
    const res = await provider.getSigner().sendTransaction(params);
    return res;
  } catch (error: any) {
    // if the user rejected the tx, pass this along
    if (error?.code === 4001) {
      throw new Error(t`Transaction rejected.`);
    } else {
      throw error;
    }
  }
};

export const approve = async (
  tokenAddress: string,
  accountAddress: string,
  contractAddress: string,
  allowance: BigNumber,
  provider: JsonRpcProvider,
  account?: string,
) => {
  const contract = getContract(tokenAddress, erc20ABI, provider, account);
  const data = contract.interface.encodeFunctionData('approve', [
    contractAddress,
    allowance.toFixed(),
  ]);
  const params = {
    from: accountAddress,
    to: tokenAddress,
    data,
    value: `0x${new BigNumber('0').toString(16)}`,
    gasLimit: undefined as EthersBigNumber | undefined,
  };

  const gasLimit = await getEstimateGas(params, provider);
  if (gasLimit) {
    params.gasLimit = gasLimit;
  }
  return await sendTransaction(params, provider);
};
