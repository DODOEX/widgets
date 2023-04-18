import { getWindow } from '../../../helpers/devices';
import { convertWeb3Provider } from '../../../helpers/providers';
import { ConnectEvents } from '../../wallets/types';
import { ConnectorParams } from '../types';

let isOpenBlockIframe = false;
let id = 1;
const OPENBLOCK_CONTENT = 'openblock-content-integration';
const messageCallbacks: {
  [key in number]: () => void;
} = {};
let isLoaded = false;

(() => {
  getWindow()?.addEventListener('message', (event) => {
    if (event.data.from === OPENBLOCK_CONTENT) {
      isOpenBlockIframe = true;
      Object.values(messageCallbacks).map((fc) => fc());
    }
  });

  getWindow()?.addEventListener(
    'load',
    () => {
      setTimeout(() => {
        isLoaded = true;
        Object.values(messageCallbacks).map((fc) => fc());
      }, 1000);
    },
    {
      once: true,
    },
  );
})();

export const getIsOpenBlockIframe: () => Promise<boolean> = async () => {
  return new Promise((resolve) => {
    if (isOpenBlockIframe) {
      resolve(true);
    } else if (window.parent === window || isLoaded) {
      resolve(false);
    } else {
      id++;
      messageCallbacks[id] = () => {
        resolve(isOpenBlockIframe);
        delete messageCallbacks[id];
      };
    }
  });
};

const connectOpenBlockIframe = async (
  _: ConnectorParams,
  events: ConnectEvents,
) => {
  const provider = (
    await import(
      /* webpackChunkName: "OpenBlockIframeConnector" */ './provider'
    )
  ).default();
  provider.on('connect', events.connect);
  provider.on('disconnect', events.disconnect);
  provider.on('accountsChanged', events.accountsChanged);
  provider.on('chainChanged', events.chainChanged);
  provider.on('message', events.message);
  await provider.request({ method: 'eth_requestAccounts' });
  return convertWeb3Provider(provider);
};

export default connectOpenBlockIframe;
