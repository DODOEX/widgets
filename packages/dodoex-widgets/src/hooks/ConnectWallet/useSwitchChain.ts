import { useMemo } from 'react';
import { chainListMap } from '../../constants/chainList';
import {
  basicTokenMap,
  ChainId,
  rpcServerMap,
  scanUrlDomainMap,
} from '../../constants/chains';
import { store } from '../../store';
import { useWalletState } from './useWalletState';

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
      rpcUrls: [
        ...rpcServerMap[chainId],
        ...(store.getState().globals.jsonRpcUrlMap?.[chainId] ?? []),
      ],
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
  const { provider } = useWalletState();

  const switchChain = useMemo(() => {
    if (!chainId || !provider?.provider?.isMetaMask) {
      return undefined;
    }
    return () => {
      return registerNetworkWithMetamask({
        chainId,
        provider: provider?.provider,
      });
    };
  }, [chainId]);

  return switchChain;
}
