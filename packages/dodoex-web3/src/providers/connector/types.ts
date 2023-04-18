import type { JsonRpcProvider } from '@ethersproject/providers';
import type { IOptions as PortisConfig } from '@portis/web3';
import type { IQRCodeModalOptions } from '@walletconnect/types';
import { FetchGasPrice } from '../../helpers/transactions';

export type ConnectorParams = {
  chainId?: number;
  rpcUrl?: string;
  appName?: string;
  appLogoUrl?: string;
  darkMode?: boolean;
  fetchGasPrice?: FetchGasPrice;
  portisParams?: {
    id: string;
    config?: PortisConfig;
  };
  uAuthParams?: {
    clientID: string;
    redirectUri?: string;
    shouldLoginWithRedirect?: boolean;
    walletConnect?: () => Promise<JsonRpcProvider | undefined>;
  };
  walletConnectParams?: {
    bridge?: string;
    qrcode?: boolean;
    infuraId?: string;
    qrcodeModal?: {
      open: (
        uri: string,
        cb: any,
        qrcodeModalOptions?: IQRCodeModalOptions | undefined,
      ) => void;
      close: () => void;
    };
    qrcodeModalOptions?: IQRCodeModalOptions;
  };
  ledgerParams?: {
    path: string;
    account: string;
  };
};
