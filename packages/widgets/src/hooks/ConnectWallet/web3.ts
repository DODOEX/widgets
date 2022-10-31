import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { EIP1193 } from '@web3-react/eip1193';
import { WalletConnect } from '@web3-react/walletconnect';
import { MetaMask } from '@web3-react/metamask';
import {
  Connector,
  Provider as Eip1193Provider,
  Web3ReactStore,
} from '@web3-react/types';
import { JsonRpcProvider } from '@ethersproject/providers';
import JsonRpcConnector from './Connectors/JsonRpcConnector';
import type { ChainId } from '../../constants/chains';

export type Web3Connection = [Connector, Web3ReactHooks];

function toWeb3Connection<T extends Connector>([connector, hooks]: [
  T,
  Web3ReactHooks,
  Web3ReactStore,
]): Web3Connection {
  return [connector, hooks];
}

export function getConnectionFromProvider(
  onError: (error: Error) => void,
  provider?: JsonRpcProvider | Eip1193Provider,
) {
  if (!provider) return;
  if (JsonRpcProvider.isProvider(provider)) {
    return toWeb3Connection(
      initializeConnector((actions) => new JsonRpcConnector(actions, provider)),
    );
  } else if (JsonRpcProvider.isProvider((provider as any).provider)) {
    throw new Error(
      'Eip1193Bridge is experimental: pass your ethers Provider directly',
    );
  } else {
    return toWeb3Connection(
      initializeConnector(
        (actions) => new EIP1193({ actions, provider, onError }),
      ),
    );
  }
}

export function getConnectionFromWalletConnect(
  useDefault: boolean,
  jsonRpcUrlMap: { [chainId: number]: string[] },
  defaultChainId: ChainId | undefined,
  onError: (error: Error) => void,
) {
  return toWeb3Connection(
    initializeConnector(
      (actions) =>
        new WalletConnect({
          actions,
          options: {
            rpc: jsonRpcUrlMap,
            qrcode: useDefault,
          },
          onError,
          defaultChainId,
        }),
    ),
  );
}

export function getConnectionFromMetaMask(onError: (error: Error) => void) {
  return toWeb3Connection(
    initializeConnector((actions) => new MetaMask({ actions, onError })),
  );
}
