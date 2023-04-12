import type { JsonRpcProvider } from '@ethersproject/providers';
import type { IOptions as PortisConfig } from '@portis/web3';
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
    qrcodeModalOptions?: any;
  };
  ledgerParams?: {
    path: string;
    account: string;
  };
};
