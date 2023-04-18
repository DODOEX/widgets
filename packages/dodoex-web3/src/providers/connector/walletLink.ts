import WalletLinkProvider from '@coinbase/wallet-sdk';
import type { ExternalProvider } from '@ethersproject/providers';
import { convertWeb3Provider } from '../../helpers/providers';
import { ConnectEvents } from '../wallets/types';
import { injectedConnect } from './injected';
import { ConnectorParams } from './types';

export interface WalletLinkConnectorParams extends ConnectorParams {
  appName: string;
  appLogoUrl?: string;
  darkMode?: boolean;
}

export default async function connector(
  { chainId, rpcUrl, appName, appLogoUrl, darkMode }: ConnectorParams,
  events: ConnectEvents,
) {
  // has extension
  if (
    window.ethereum &&
    (window.ethereum.isWalletLink || window.ethereum.isToshi)
  ) {
    return injectedConnect(window.ethereum, events);
  }

  if (!appName) {
    throw new Error('walletLink need appName');
  }

  const walletLink = new WalletLinkProvider({
    appName,
    appLogoUrl,
    darkMode,
  });
  const provider = walletLink.makeWeb3Provider(rpcUrl, chainId);
  await provider.enable();
  provider.on('connect', events.connect);
  provider.on('disconnect', events.disconnect);
  provider.on('accountsChanged', events.accountsChanged);
  provider.on('chainChanged', events.chainChanged);
  provider.on('message', events.message);
  return convertWeb3Provider(provider as any as ExternalProvider);
}
