import WalletConnectProvider from '@walletconnect/web3-provider';
import { convertWeb3Provider } from '../../helpers/providers';
import { ConnectEvents } from '../wallets/types';
import { ConnectorParams } from './types';

export default async function connector(
  { chainId, rpcUrl, walletConnectParams }: ConnectorParams,
  events: ConnectEvents,
) {
  let bridge = 'https://bridge.walletconnect.org';
  let qrcode = true;
  let infuraId = '';
  let rpc;
  let qrcodeModalOptions;

  if (walletConnectParams) {
    bridge = walletConnectParams.bridge || bridge;
    qrcode =
      typeof walletConnectParams.qrcode !== 'undefined'
        ? walletConnectParams.qrcode
        : qrcode;
    infuraId = walletConnectParams.infuraId || '';
    qrcodeModalOptions = walletConnectParams.qrcodeModalOptions || undefined;
  }
  rpc = rpcUrl || undefined;

  const provider = new WalletConnectProvider({
    bridge,
    qrcode,
    infuraId,
    rpc,
    chainId,
    qrcodeModalOptions,
  });
  await provider.enable();
  provider.on('connect', events.connect);
  provider.on('disconnect', (e: any) => {
    events.disconnect(e);
    events.accountsChanged([]);
  });
  provider.on('accountsChanged', events.accountsChanged);
  provider.on('chainChanged', events.chainChanged);
  provider.on('message', events.message);
  return convertWeb3Provider(provider);
}
