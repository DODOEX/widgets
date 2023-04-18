// https://docs.unstoppabledomains.com/login-with-unstoppable/login-integration-guides/login-with-popup/
import UAuthProvider, { UserInfo } from '@uauth/js';
import { ConnectEvents } from '../wallets/types';
import { injectedConnect } from './injected';
import { ConnectorParams } from './types';

let isConnecting = false;
let uAuth: UAuthProvider | undefined;

export default async function connector(
  connectorParams: ConnectorParams,
  events: ConnectEvents,
) {
  if (isConnecting) return undefined;
  const { uAuthParams } = connectorParams;
  if (!uAuthParams?.clientID) {
    throw new Error('uAuthParams is not valid.');
  }
  isConnecting = true;
  try {
    const options = {
      ...uAuthParams,
      redirectUri: uAuthParams.redirectUri || window.location.origin,
    };
    uAuth = new UAuthProvider(options);
    let user: UserInfo;
    try {
      user = await uAuth.user();
    } catch (error) {
      if (!uAuth.fallbackLoginOptions.scope.includes('wallet')) {
        throw new Error(
          'Must request the "wallet" scope for connector to work.',
        );
      }

      if (options.shouldLoginWithRedirect) {
        await uAuth.login();

        // NOTE: We don't want to throw because the page will take some time to
        // load the redirect page.
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await new Promise<void>(() => {});
        // We need to throw here otherwise typescript won't know that user isn't null.
        throw new Error('Should never get here.');
      } else {
        await uAuth.loginWithPopup();
        user = await uAuth.user();
      }
    }

    if (user.wallet_type_hint == null) {
      throw new Error('no wallet type present');
    }

    let provider: any;
    if (['web3', 'injected'].includes(user.wallet_type_hint)) {
      provider = injectedConnect(undefined, events);
    } else if (
      user.wallet_type_hint === 'walletconnect' &&
      options.walletConnect
    ) {
      provider = options.walletConnect();
    } else {
      throw new Error('Connector not supported');
    }
    isConnecting = false;
    return provider;
  } catch (error) {
    isConnecting = false;
  }
  return undefined;
}

export function disconnectWallet() {
  return uAuth?.logout();
}
