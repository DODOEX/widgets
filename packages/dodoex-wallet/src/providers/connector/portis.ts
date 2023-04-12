import Portis from '@portis/web3';
import { convertWeb3Provider } from '../../helpers/providers';
import { ConnectEvents } from '../wallets/types';
import { ConnectorParams } from './types';

export default async function connector(
  { chainId, portisParams }: ConnectorParams,
  events: ConnectEvents,
) {
  if (!portisParams?.id) {
    throw new Error('uAuthParams is not valid.');
  }
  // https://docs.portis.io/#/configuration
  let network = '';
  switch (chainId) {
    case 1:
      network = 'mainnet';
      break;
    case 5:
      network = 'goerli';
      break;

    default:
      network = 'mainnet';
      break;
  }
  const pt = new Portis(portisParams.id, network, portisParams.config);
  await pt.provider.enable();
  // eslint-disable-next-line no-underscore-dangle
  pt.provider._portis = pt;
  pt.provider.on('connect', events.connect);
  pt.provider.on('disconnect', events.disconnect);
  pt.provider.on('accountsChanged', events.accountsChanged);
  pt.provider.on('chainChanged', events.chainChanged);
  pt.provider.on('message', events.message);
  return convertWeb3Provider(pt.provider);
}
