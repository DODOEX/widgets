import { ConnectorParams } from '../types';
import { createLedgerUSBProvider } from './provider';

export { HD_PATH_LIST, getAccountList } from './account';
export type { HDAccountItem } from './account';
export { getTransport } from './connect';
export type { Transport } from './connect';
export { createLedgerUSBProvider as createProvider } from './provider';

export default async function connector(params: ConnectorParams) {
  const provider = await createLedgerUSBProvider(params);
  return provider;
}
