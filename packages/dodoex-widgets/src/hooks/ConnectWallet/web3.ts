import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { EIP1193 } from '@web3-react/eip1193';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { MetaMask } from '@web3-react/metamask';
import {
  Connector,
  Provider as Eip1193Provider,
  Web3ReactStore,
} from '@web3-react/types';
import { JsonRpcProvider } from '@ethersproject/providers';
import JsonRpcConnector from './Connectors/JsonRpcConnector';
import { ChainId } from '@dodoex/api';

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
      initializeConnector(
        (actions) => new JsonRpcConnector(actions, provider, onError),
      ),
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
    initializeConnector<WalletConnectV2>(
      (actions) =>
        new WalletConnectV2({
          actions,
          options: {
            rpcMap: defaultChainId
              ? {
                  [defaultChainId as number]:
                    jsonRpcUrlMap[defaultChainId as number],
                }
              : jsonRpcUrlMap,
            projectId: '59e050d1f27ed617e65bb9637c9498d6',
            chains: defaultChainId ? [defaultChainId] : [],
            showQrModal: useDefault,
            qrModalOptions: {
              desktopWallets: [],
            },
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
