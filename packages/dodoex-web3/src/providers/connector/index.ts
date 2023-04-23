import { ConnectEvents } from '../wallets/types';
import { ConnectorParams } from './types';

export type { ConnectorParams } from './types';
export type { WalletLinkConnectorParams } from './walletLink';

export { injectedConnect, registerNetworkWithMetamask } from './injected';

export { HD_PATH_LIST } from './ledgerUSB/constants';
export function getLedgerUSBPackage() {
  return import(/* webpackChunkName: "LedgerUSBPackage" */ './ledgerUSB');
}

export function getGnosisPackage() {
  return import(/* webpackChunkName: "GnosisPackage" */ './gnosis');
}

export function getUAuthPackage() {
  return import(/* webpackChunkName: "UAuthPackage" */ './uAuth');
}

export async function getPortisConnector(
  params: ConnectorParams,
  events: ConnectEvents,
) {
  return (
    await import(/* webpackChunkName: "PortisConnector" */ './portis')
  ).default(params, events);
}

export async function getWalletLinkConnector(
  params: ConnectorParams,
  events: ConnectEvents,
) {
  return (
    await import(/* webpackChunkName: "WalletLinkConnector" */ './walletLink')
  ).default(params, events);
}

export async function getWalletConnectConnector(
  params: ConnectorParams,
  events: ConnectEvents,
) {
  return (
    await import(
      /* webpackChunkName: "WalletConnectConnector" */ './walletConnect'
    )
  ).default(params, events);
}

export {
  default as getOpenBlockIframeConnector,
  getIsOpenBlockIframe,
} from './openBlockIframe';
