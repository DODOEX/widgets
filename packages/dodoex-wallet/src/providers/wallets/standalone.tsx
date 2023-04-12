import { Wallet, WalletType, ChainId } from './types';
import CoinbaseLogo from './logos/coinbase.png';
import { ReactComponent as BinanceChainLogo } from './logos/binance-chain.svg';
import { ReactComponent as WalletConnectLogo } from './logos/walletconnect.svg';
import { ReactComponent as GnosisSafeLogo } from './logos/gnosis-safe.svg';
import { ReactComponent as PortisLogo } from './logos/portis.svg';
import { ReactComponent as LedgerLogo } from './logos/ledger.svg';
import { ReactComponent as OpenBlockLogo } from './logos/openBlock.svg';
import { ReactComponent as NaboxLogo } from './logos/nabox.svg';
import { ReactComponent as OnekeyLogo } from './logos/onekey.svg';
import { ReactComponent as BitkeepLogo } from './logos/bitkeep.svg';
import { ReactComponent as OKXWalletLogo } from './logos/okx-wallet.svg';
import { ReactComponent as KuCoinLogo } from './logos/kuCoin.svg';
import { isMobile, isSupportWebHid } from '../../helpers/devices';
import {
  getGnosisPackage,
  getLedgerUSBPackage,
  getPortisConnector,
  getUAuthPackage,
  getWalletConnectConnector,
  getWalletLinkConnector,
  injectedConnect,
  registerNetworkWithMetamask,
} from '../connector';

export const WalletLink: Wallet = {
  type: WalletType.WalletLink,
  showName: 'Coinbase Wallet',
  logo: <img src={CoinbaseLogo} />,
  supportMobile: true,
  disabled: () =>
    !(
      !window.ethereum ||
      (!window.ethereum.isWalletLink &&
        !window.ethereum.isToshi &&
        document &&
        isMobile)
    ),
  connector: getWalletLinkConnector,
};

export const BSC: Wallet = {
  type: WalletType.BinanceChain,
  showName: 'Binance Chain Wallet',
  logo: <BinanceChainLogo />,
  supportChains: [ChainId.MAINNET, ChainId.BSC],
  link: 'https://www.bnbchain.world/en/binance-wallet',
  supportMobile: true,
  disabled: () => !window.BinanceChain,
  connector: (_, events) => injectedConnect(window.BinanceChain, events),
};

export const KuCoin: Wallet = {
  type: WalletType.kuCoinWallet,
  showName: 'KuCoin Wallet',
  logo: <KuCoinLogo />,
  supportMobile: true,
  disabled: () => !window.kucoin,
  connector: (_, events) => injectedConnect(window.kucoin, events),
  switchChain: registerNetworkWithMetamask,
  link: 'https://kuwallet.com/',
};

export const Ledger: Wallet = {
  type: WalletType.LedgerUSB,
  showName: 'Ledger',
  logo: <LedgerLogo />,
  supportChains: [ChainId.MAINNET, ChainId.BSC, ChainId.POLYGON],
  disabled: () => !isSupportWebHid(),
  connector: async (params) =>
    isSupportWebHid() && params
      ? (await getLedgerUSBPackage()).default(params)
      : undefined,
};

export const OpenBlock: Wallet = {
  type: WalletType.openBlock,
  showName: 'OpenBlock',
  logo: <OpenBlockLogo />,
  supportChains: [
    ChainId.MAINNET,
    ChainId.GOERLI,
    ChainId.BSC,
    ChainId.POLYGON,
    ChainId.HECO,
    ChainId.ARBITRUM_ONE,
    ChainId.OKCHAIN,
    ChainId.OPTIMISM,
    ChainId.AVALANCHE,
  ],
  disabled: () => !window.openblock,
  connector: (_, events) => injectedConnect(window.openblock, events),
  switchChain: registerNetworkWithMetamask,
};

export const OneKey: Wallet = {
  type: WalletType.OneKey,
  showName: 'OneKey',
  logo: <OnekeyLogo />,
  link: 'https://onekey.so',
  supportMobile: true,
  disabled: () => !window.$onekey?.ethereum && !window.onekey,
  connector: (_, events) =>
    injectedConnect(window.$onekey?.ethereum || window.onekey, events),
  switchChain: registerNetworkWithMetamask,
};

export const Bitkeep: Wallet = {
  type: WalletType.Bitkeep,
  showName: 'Bitkeep',
  logo: <BitkeepLogo />,
  link: 'https://bitkeep.com/download?type=2',
  mobileDeepLink: 'https://bkcode.vip?action=dapp&url=$APP_URL',
  supportMobile: true,
  disabled: () => !window.bitkeep?.ethereum,
  connector: (_, events) => injectedConnect(window.bitkeep?.ethereum, events),
  switchChain: registerNetworkWithMetamask,
};

export const Nabox: Wallet = {
  type: WalletType.Nabox,
  showName: 'Nabox',
  logo: <NaboxLogo />,
  link: 'https://nabox.io/',
  supportMobile: true,
  disabled: () => !window.NaboxWallet,
  connector: (_, events) => injectedConnect(window.NaboxWallet, events),
  switchChain: registerNetworkWithMetamask,
};

export const OKXWallet: Wallet = {
  type: WalletType.OKX,
  showName: 'OKX Wallet',
  logo: <OKXWalletLogo />,
  supportMobile: false,
  link: 'https://www.okx.com/',
  disabled: () => !window.okxwallet,
  connector: (_, events) => injectedConnect(window.okxwallet, events),
  switchChain: registerNetworkWithMetamask,
};

export const WalletConnect: Wallet = {
  type: WalletType.WalletConnect,
  showName: 'WalletConnect',
  logo: <WalletConnectLogo />,
  supportMobile: true,
  connector: (params, events) => getWalletConnectConnector(params, events),
};

export const Portis: Wallet = {
  type: WalletType.Portis,
  showName: 'Portis',
  logo: <PortisLogo />,
  supportChains: [ChainId.MAINNET, ChainId.GOERLI],
  checked: ({ PORTIS_ID }) => !!PORTIS_ID,
  connector: (params, events) => getPortisConnector(params, events),
};

export const Gnosis: Wallet = {
  type: WalletType.Gnosis,
  showName: 'Gnosis',
  logo: <GnosisSafeLogo />,
  supportChains: [
    ChainId.MAINNET,
    ChainId.GOERLI,
    ChainId.BSC,
    ChainId.POLYGON,
    ChainId.ARBITRUM_ONE,
    ChainId.AURORA,
    ChainId.AVALANCHE,
    ChainId.OPTIMISM,
  ],
  disabled: async () => !(await (await getGnosisPackage()).getConnectedSafe()),
  connector: async (_, events) => (await getGnosisPackage()).default(events),
};

export const UAuth: Wallet = {
  type: WalletType.uAuth,
  showName: 'Unstoppable',
  logo: (
    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIyLjczMTkgMi4wNjkzNFY5Ljg3MjI5TDAgMTkuMDk0TDIyLjczMTkgMi4wNjkzNFoiIGZpbGw9IiMyRkU5RkYiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE4LjQ2OTYgMS43MTM4N1YxNS4xOTE3QzE4LjQ2OTYgMTkuMTA5NCAxNS4yODkyIDIyLjI4NTMgMTEuMzY1OSAyMi4yODUzQzcuNDQyNjUgMjIuMjg1MyA0LjI2MjIxIDE5LjEwOTQgNC4yNjIyMSAxNS4xOTE3VjkuNTE2ODJMOC41MjQ0MyA3LjE3NTk0VjE1LjE5MTdDOC41MjQ0MyAxNi41NjI5IDkuNjM3NTkgMTcuNjc0NSAxMS4wMTA3IDE3LjY3NDVDMTIuMzgzOSAxNy42NzQ1IDEzLjQ5NyAxNi41NjI5IDEzLjQ5NyAxNS4xOTE3VjQuNDQ0OUwxOC40Njk2IDEuNzEzODdaIiBmaWxsPSIjNEM0N0Y3Ii8+PC9zdmc+" />
  ),
  connector: async (params, events) =>
    (await getUAuthPackage()).default(
      {
        ...params,
        uAuthParams: {
          walletConnect: () => {
            if (WalletConnect.connector) {
              return WalletConnect.connector(params, events);
            }
            return Promise.resolve(undefined);
          },
          ...params.uAuthParams,
          clientID: params.uAuthParams?.clientID as string,
        },
      },
      events,
    ),
  disconnect: async () => {
    const { disconnectWallet } = await getUAuthPackage();
    await disconnectWallet();
  },
};
