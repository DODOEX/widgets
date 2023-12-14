import { Provider as Eip1193Provider } from '@web3-react/types';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId, rpcServerMap } from '../../constants/chains';
import { useMemo } from 'react';
import {
  getConnectionFromMetaMask,
  getConnectionFromProvider,
  getConnectionFromWalletConnect,
  Web3Connection,
} from './web3';
import { WalletType } from '../../constants/wallet';
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

export interface Web3ConnectorsProps {
  provider?: Eip1193Provider | JsonRpcProvider;
  jsonRpcUrlMap?: { [chainId: number]: string[] };
  defaultChainId?: ChainId;
}

const connectorCacheMap: {
  [key in WalletType]?: Web3Connection;
} = {};

export function useWeb3Connectors({
  provider,
  jsonRpcUrlMap: jsonRpcUrlMapProps,
  defaultChainId,
}: Web3ConnectorsProps) {
  const onError = useMemo(() => console.error, []);
  const integratorConnection = useMemo(
    () => getConnectionFromProvider(onError, provider),
    [onError, provider],
  );
  const metaMaskConnection = useMemo(
    () => getConnectionFromMetaMask(onError),
    [onError],
  );
  const jsonRpcUrlMap = useMemo(() => {
    if (!jsonRpcUrlMapProps) {
      return rpcServerMap;
    }
    return {
      ...rpcServerMap,
      ...jsonRpcUrlMapProps,
    };
  }, [JSON.stringify(jsonRpcUrlMapProps)]);
  const walletConnectConnectionPopup = useMemo(
    () =>
      getConnectionFromWalletConnect(
        true,
        jsonRpcUrlMap,
        defaultChainId,
        onError,
      ),
    [jsonRpcUrlMap, defaultChainId, onError],
  );

  return useMemo(() => {
    if (integratorConnection) {
      connectorCacheMap[WalletType.INTEGRATOR] = integratorConnection;
    }
    connectorCacheMap[WalletType.METAMASK] = metaMaskConnection;
    connectorCacheMap[WalletType.WALLET_CONNECT] = walletConnectConnectionPopup;

    return Object.values(connectorCacheMap);
  }, [integratorConnection, metaMaskConnection, walletConnectConnectionPopup]);
}

export async function connectToWallet(
  type: WalletType,
  chainId: number | undefined,
  onError: (error: Error) => void,
) {
  const connection = connectorCacheMap[type];
  if (!connection) {
    throw new Error(`Unknown wallet type: ${type}`);
  }
  const [connector] = connection;
  try {
    // fix wallet connect failed
    if (connector.connectEagerly) {
      await connector.connectEagerly(chainId);
    }
    // When walletConnect is connected but does not support the chain, disconnect and reconnect.
    if (
      type === WalletType.WALLET_CONNECT &&
      (connector as WalletConnectV2).provider?.chainId &&
      // @ts-ignore
      !(connector as WalletConnectV2).chains?.includes(
        (connector as WalletConnectV2).provider?.chainId,
      ) &&
      connector.deactivate
    ) {
      // @ts-ignore
      if (connector.provider?.disconnect) {
        // @ts-ignore
        await connector.provider?.disconnect();
      }
      await connector.deactivate();
    }
  } catch (error) {
    console.error(error);
  }
  await connector.activate(chainId)?.catch((e) => {
    // cancel switch chain
    if (e.code === 4001) {
      if (connector.connectEagerly) {
        connector.connectEagerly(chainId);
      } else {
        connector.activate(chainId);
      }
      return;
    }
    onError(e);
  });
}
