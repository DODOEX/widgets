import SafeAppsSDK, { SafeInfo } from '@safe-global/safe-apps-sdk';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';
import { convertWeb3Provider } from '../../helpers/providers';
import { ConnectEvents } from '../wallets/types';

let safe: SafeInfo | undefined;
let sdk: SafeAppsSDK | undefined;

export async function getConnectedSafe() {
  if (!sdk) {
    sdk = new SafeAppsSDK();
  }
  if (safe === undefined) {
    safe = await Promise.race([
      sdk.safe.getInfo(),
      // eslint-disable-next-line no-promise-executor-return
      new Promise<undefined>((resolve) => setTimeout(resolve, 200)),
    ]);
  }
  return safe;
}

export default async function connector(events: ConnectEvents) {
  const currentSafe = await getConnectedSafe();
  if (!currentSafe) throw Error('Could not load Safe information');
  // @ts-ignore
  const provider = new SafeAppProvider(currentSafe, sdk as SafeAppsSDK);
  provider.on('connect', events.connect);
  provider.on('disconnect', events.disconnect);
  provider.on('accountsChanged', events.accountsChanged);
  provider.on('chainChanged', events.chainChanged);
  provider.on('message', events.message);
  return convertWeb3Provider(provider);
}
