import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import {
  JsonRpcProvider,
  JsonRpcSigner,
  TransactionReceipt,
} from '@ethersproject/providers';
import { AddressZero } from '@ethersproject/constants';
import { Contract, ContractInterface } from '@ethersproject/contracts';
import isZero, { isAddress } from '../helpers/address';
import walletState from '../state';
import erc20ABI from './erc20ABI';

export type Deferrable<T> = {
  [K in keyof T]: T[K] | Promise<T[K]>;
};
// Meow: trust web3 / etherscan result
export enum WatchResult {
  Failed = 0, // 0:Failure
  Success, // 1:Success
  Warning, // 2:Warning(Current nonce transactions are overwritten, such as user acceleration/cancellation in wallet.)
}

function getProvider() {
  const { provider } = walletState;
  if (!provider) {
    throw new Error('provider is undefined');
  }
  return provider;
}

export const getEstimateGas = async (
  params: any,
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
  const provider = getProvider();
  try {
    const res = await provider.estimateGas(estimateTarget);
    return res.add(50000);
  } catch (error) {
    provider
      .call(params)
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

export const getGasPrice = async (): Promise<EthersBigNumber | null> => {
  const provider = getProvider();
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
) => {
  const provider = getProvider();
  try {
    const res = await provider.getSigner().sendTransaction(params);
    return res;
  } catch (error: any) {
    // if the user rejected the tx, pass this along
    if (error?.code === 4001) {
      throw new Error('Transaction rejected.');
    } else {
      throw error;
    }
  }
};

function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(
  provider: JsonRpcProvider,
  account?: string,
): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider;
}

export function getContract(
  address: string,
  ABI: ContractInterface,
  providerProps?: JsonRpcProvider,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  const provider = providerProps ?? getProvider();
  const account = walletState.account;

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(provider, account) as any,
  );
}

const providerCacheMap = new Map<number, JsonRpcProvider>();
export async function getProviderByChain(
  chainId: number,
  rpcUrl: string,
): Promise<JsonRpcProvider> {
  if (!chainId || (chainId === walletState.chainId && walletState.provider))
    return walletState.provider as JsonRpcProvider;
  if (providerCacheMap.has(chainId)) {
    return providerCacheMap.get(chainId) as JsonRpcProvider;
  }
  const result = new JsonRpcProvider(rpcUrl);
  providerCacheMap.set(chainId, result);
  return result;
}

export const approve = async (
  tokenAddress: string,
  contractAddress: string,
  allowance: string,
) => {
  const contract = getContract(tokenAddress, erc20ABI);
  const data = contract.interface.encodeFunctionData('approve', [
    contractAddress,
    allowance,
  ]);
  const params = {
    from: walletState.account,
    to: tokenAddress,
    data,
    value: '0x0',
    gasLimit: undefined as EthersBigNumber | undefined,
  };

  const gasLimit = await getEstimateGas(params);
  if (gasLimit) {
    params.gasLimit = gasLimit;
  }
  return await sendTransaction(params);
};

type WatchTxConfig = {
  interval: number;
  killSwitch: boolean;
  fastKillSwitch: boolean;
};
type GetTransactionReceipt<T> = (tx: string) => Promise<TransactionReceipt | T>;
export async function watchTx<
  T extends {
    status: boolean | number;
  } | null,
>(
  tx: string,
  config: WatchTxConfig,
  nonce?: number,
  addr?: string,
  getTransactionReceipt?: GetTransactionReceipt<T>,
): Promise<{
  status: WatchResult;
  transactionReceipt: Awaited<ReturnType<GetTransactionReceipt<T>>>;
} | null> {
  const provider = getProvider();
  while (!config.killSwitch) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const [resp, currentNonce] = await Promise.all([
        getTransactionReceipt
          ? getTransactionReceipt(tx)
          : provider.getTransactionReceipt(tx),
        provider.getTransactionCount(addr ?? ''),
      ]);
      console.log(
        '[TX Watch] Web3',
        resp,
        '/Current Nonce ',
        currentNonce,
        '/TX Nonce',
        nonce,
      );
      let status: WatchResult | undefined;
      if (resp) status = resp.status ? WatchResult.Success : WatchResult.Failed;
      if (status === undefined && nonce && currentNonce > nonce)
        status = WatchResult.Warning;
      if (status !== undefined) {
        return {
          status,
          transactionReceipt: resp,
        };
      }
    } catch (e: any) {
      console.error('[TX Watch] Error', e.message);
    }
    await new Promise((resolve) => setTimeout(resolve, config.interval));
  }
  return null;
}
