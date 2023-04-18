import { convertWeb3Provider } from '../../helpers/providers';
import { ConnectEvents } from '../wallets/types';

export async function injectedConnect(
  providerProps: any = null,
  events: ConnectEvents,
) {
  let provider = providerProps || window.ethereum;
  if (provider) {
    await provider.request({ method: 'eth_requestAccounts' });
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else if (window.celo) {
    provider = window.celo;
  } else {
    throw new Error('No Web3 Provider found');
  }
  provider.on('connect', events.connect);
  provider.on('disconnect', events.disconnect);
  provider.on('accountsChanged', events.accountsChanged);
  provider.on('chainChanged', events.chainChanged);
  provider.on('message', events.message);
  return convertWeb3Provider(provider);
}

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
// Ethereum chain
interface AddEthereumChainParameter {
  // Ethereum | Rinkeby | Goerli | optimistic kovan | boba rinkeby | 97 |
  chainId: '0x1' | '0x4' | '0x5' | '0x45' | '0x1c' | '0x61';
}

export interface RegisterNetworkWithMetamaskParams {
  addChainParameters: AddChainParameter | AddEthereumChainParameter;
  provider?: any;
}

/**
 * switch wallet chain
 *  @see https://docs.metamask.io/guide/rpc-api.html#usage-with-wallet-switchethereumchain
 */
export async function registerNetworkWithMetamask({
  addChainParameters,
  provider = window.ethereum,
}: RegisterNetworkWithMetamaskParams): Promise<{
  result: boolean;
  failMsg?: string;
}> {
  if (!provider) {
    return {
      result: false,
    };
  }
  const { chainId } = addChainParameters;
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    return {
      result: true,
    };
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask. -32603 from mobile
    const { code } = switchError as { code: number };
    if (code === 4902 || code === -32603) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [addChainParameters],
        });
        return {
          result: true,
        };
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
  return {
    result: false,
  };
}
