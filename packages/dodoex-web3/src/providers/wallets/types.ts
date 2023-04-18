import type { JsonRpcProvider } from '@ethersproject/providers';
import type { ConnectorParams } from '../connector';
import {
  RegisterNetworkWithMetamaskParams,
  registerNetworkWithMetamask,
} from '../connector/injected';

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,

  BSC = 56,

  HECO = 128,

  POLYGON = 137,

  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,

  AURORA = 1313161554,

  MOONRIVER = 1285,

  OKCHAIN = 66,

  OPTIMISM = 10,

  BOBA = 288,

  AVALANCHE = 43114,

  CRONOS = 25,
}

export enum WalletType {
  injected = 'injected',
  BinanceChain = 'custom-bsc-injected',
  WalletConnect = 'walletconnect',
  Portis = 'portis',
  Gnosis = 'custom-gnosis',
  WalletLink = 'custom-walletlink',
  LedgerUSB = 'custom-ledger-usb',
  Ledger = 'custom-ledger',
  openBlock = 'custom-open-block',
  openBlockIframe = 'custom-open-block-iframe',
  Nabox = 'custom-nabox',
  Bitkeep = 'custom-bitkeep',
  OneKey = 'custom-onekey',
  OKX = 'custom-okx',
  uAuth = 'custom-uauth',
  kuCoinWallet = 'custom-kucoin-wallet',
  frontier = 'custom-frontier',
}

export type ConnectEvents = {
  connect: ({ chainId }: { chainId: string }) => void;
  accountsChanged: (accounts: Array<string>) => void;
  chainChanged: (chainId: string) => void;
  message: (type: string, data: unknown) => void;
  disconnect: (error: ProviderRpcError) => void;
};

export interface Wallet {
  type: WalletType;
  showName: string;
  logo: JSX.Element;
  switchChain?: (
    params: RegisterNetworkWithMetamaskParams,
  ) => ReturnType<typeof registerNetworkWithMetamask>;
  /** default is all */
  supportChains?: Array<ChainId>;
  /** prompt for download */
  link?: string;
  mobileDeepLink?: string;
  mobileAndroidDeepLink?: string;
  mobileIOSDeepLink?: string;
  supportExtension?: boolean;
  supportMobile?: boolean;
  disabled?: () => boolean | Promise<boolean>;
  /** if return false, not display */
  checked?: (params: { PORTIS_ID?: string }) => boolean;
  connector?: (
    params: ConnectorParams,
    events: ConnectEvents,
  ) => Promise<JsonRpcProvider | undefined>;
  disconnect?: () => Promise<void>;
}
