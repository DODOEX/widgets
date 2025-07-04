import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { chainListMap } from '../../constants/chainList';
import {
  basicTokenMap,
  rpcServerMap,
  scanUrlDomainMap,
} from '../../constants/chains';
import { ChainId } from '@dodoex/api';

interface AddChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

const PHAROS_TESTNET_SWITCHED = 'DODO_WIDGET_PHAROS_TESTNET_SWITCHED';
export function getPharosTestnetSwitched() {
  const storage = localStorage.getItem(PHAROS_TESTNET_SWITCHED);
  return storage === '1';
}
export function setPharosTestnetSwitched(isSwitched: boolean) {
  localStorage.setItem(PHAROS_TESTNET_SWITCHED, isSwitched ? '1' : '0');
}

export async function updatePharosTestnetRpc(chainId: ChainId, provider?: any) {
  if (
    !provider ||
    chainId !== ChainId.PHAROS_TESTNET ||
    getPharosTestnetSwitched()
  )
    return false;
  const chainIdStr = `0x${chainId.toString(16)}`;
  const basicToken = basicTokenMap[chainId];
  if (!basicToken) {
    throw new Error(`Chain ${chainId} does not exist`);
  }
  const addChainParameters = {
    chainId: chainIdStr,
    chainName: chainListMap.get(chainId)?.name,
    rpcUrls: [...rpcServerMap[chainId]],
    nativeCurrency: {
      name: basicToken.name,
      symbol: basicToken.symbol,
      decimals: basicToken.decimals,
    },
    blockExplorerUrls: [`https://${scanUrlDomainMap[chainId]}/`],
  } as AddChainParameter;
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [addChainParameters],
    });
    setPharosTestnetSwitched(true);
    return true;
  } catch (addError: any) {
    // If the native configuration of the wallet is inconsistent, try using ETH
    if (addError.code === -32602) {
      addChainParameters.nativeCurrency.symbol = 'ETH';
      addChainParameters.nativeCurrency.name = 'ETH';
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [addChainParameters],
        });
        setPharosTestnetSwitched(true);
        return true;
      } catch (addError2) {
        // handle "add" error
        console.error(
          `[failed to add ${chainId} with ETH]: `,
          addChainParameters,
          addError2,
        );
      }
    }
    // handle "add" error
    console.error(`[failed to add ${chainId}]: `, addChainParameters, addError);
  }
}

/**
 * switch wallet chain
 *  @see https://docs.metamask.io/guide/rpc-api.html#usage-with-wallet-switchethereumchain
 */
export async function registerNetworkWithMetamask({
  chainId,
  provider,
}: {
  chainId: ChainId;
  provider?: any;
}): Promise<boolean> {
  if (!provider) return false;
  const chainIdStr = `0x${chainId.toString(16)}`;

  // pharos testnet update rpc
  await updatePharosTestnetRpc(chainId, provider);

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdStr }],
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask. -32603 from mobile
    const { code } = switchError as { code: number };
    const basicToken = basicTokenMap[chainId];
    if (!basicToken) {
      throw new Error(`Chain ${chainId} does not exist`);
    }
    const addChainParameters = {
      chainId: chainIdStr,
      chainName: chainListMap.get(chainId)?.name,
      rpcUrls: [...rpcServerMap[chainId]],
      nativeCurrency: {
        name: basicToken.name,
        symbol: basicToken.symbol,
        decimals: basicToken.decimals,
      },
      blockExplorerUrls: [`https://${scanUrlDomainMap[chainId]}/`],
    } as AddChainParameter;
    if (code === 4902 || code === -32603) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [addChainParameters],
        });
        return true;
      } catch (addError) {
        // handle "add" error
        console.error(
          `[failed to add ${chainId}]: `,
          addChainParameters,
          addError,
        );
      }
    }
    // handle other "switch" errors
    console.error(
      `[failed to switch ${chainId}]: `,
      addChainParameters,
      switchError,
    );
  }
  return false;
}

export function useSwitchChain(chainId?: ChainId) {
  const { provider } = useWeb3React();

  const switchChain = useMemo(() => {
    const providerResult: any = provider?.provider ?? provider;
    if (!chainId || !providerResult?.isMetaMask) {
      return undefined;
    }
    return () => {
      return registerNetworkWithMetamask({
        chainId,
        provider: providerResult,
      });
    };
  }, [chainId, provider]);

  return switchChain;
}
