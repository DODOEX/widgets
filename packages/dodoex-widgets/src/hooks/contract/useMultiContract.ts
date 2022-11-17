import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { useCallback, useMemo, useState } from 'react';
import multiABI from './abis/multicallABI';
import { ChainId } from '../../constants/chains';
import contractConfig from './contractConfig';
import { BatchThunk, runAll } from './batch';
import { isAddress } from '../../utils';

// account is not optional
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
  ABI: any,
  provider: JsonRpcProvider,
  account?: string,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(provider, account) as any,
  );
}

export default function useMultiContract() {
  const { provider, account, chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const currentContractConfig = useMemo(
    () => contractConfig[chainId as ChainId],
    [chainId],
  );

  const getContractRes = useCallback(
    (contractAddress: string, ABI: any) => {
      if (!provider) return undefined;

      return getContract(contractAddress, ABI, provider, account);
    },
    [provider, account],
  );

  const call = useCallback(
    <T>(thunk: BatchThunk<T>) => {
      if (!currentContractConfig) return;
      const { MULTI_CALL } = currentContractConfig;
      const multiContract = getContractRes(MULTI_CALL, multiABI);
      const computed = async () => {
        if (!multiContract) return;
        setLoading(true);
        try {
          const [r] = await runAll(multiContract, MULTI_CALL, thunk);
          return r;
        } catch (e) {
          console.error('Contract: useMultiContract is error', e);
        }
        setLoading(false);
      };
      return computed();
    },
    [currentContractConfig, getContractRes],
  );

  return {
    getContract: getContractRes,
    contractConfig: currentContractConfig,
    call,
    loading,
  };
}
