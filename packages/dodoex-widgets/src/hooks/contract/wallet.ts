import { JsonRpcProvider } from '@ethersproject/providers';
import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import isZero from '../../utils/address';
import { t } from '@lingui/macro';
import { TokenApi } from '@dodoex/api';
import { TokenInfo } from '../Token';

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
    console.error(error);
    try {
      await provider.call(estimateTarget);
      if (process.env.NODE_ENV !== 'test') {
        throw new Error(
          'Unexpected issue with estimating the gas. Please try again.',
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        throw error;
      }
    }
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
) => {
  const data = await TokenApi.encode.approveABI(contractAddress, allowance);
  const params = {
    from: accountAddress,
    to: tokenAddress,
    data,
    value: '0x0',
    gasLimit: undefined as EthersBigNumber | undefined,
  };

  const gasLimit = await getEstimateGas(params, provider);
  if (gasLimit) {
    params.gasLimit = gasLimit;
  }
  return await sendTransaction(params, provider);
};

/**
 * Add custom token to metamask
 * https://docs.metamask.io/guide/registering-your-token.html#registering-tokens-with-users
 */
export async function registerTokenWithMetamask(
  provider: JsonRpcProvider | undefined,
  token: TokenInfo,
): Promise<{ result: boolean; failMsg?: string }> {
  if (!provider) return { result: false };
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await provider.send('wallet_watchAsset', {
      // @ts-ignore
      type: 'ERC20', // Initially only supports ERC20, but eventually more!
      options: {
        address: token.address, // The address that the token is at.
        symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
        decimals: token.decimals, // The number of decimals in the token
        image: token.logoURI, // A string url of the token logo
      },
    });

    return {
      result: wasAdded,
    };
  } catch (error) {
    console.error(error);
    return {
      result: false,
      // @ts-ignore
      failMsg: error?.message,
    };
  }
}
