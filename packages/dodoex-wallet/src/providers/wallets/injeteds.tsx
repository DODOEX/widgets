import { ReactComponent as HuobiWalletLogo } from './logos/huobiWallet.svg';
import { ReactComponent as MathLogo } from './logos/math.svg';
import { ReactComponent as Coin98Logo } from './logos/Coin98.svg';
import { ReactComponent as TokenPocketLogo } from './logos/tokenPocket.svg';
import CoinbaseLogo from './logos/coinbase.png';
import GameStopLogo from './logos/gameStop.png';
import { ReactComponent as TrustLogo } from './logos/trust.svg';
import { ReactComponent as ImTokenLogo } from './logos/imtoken.svg';
import { ReactComponent as BraveLogo } from './logos/brave.svg';
import { Wallet, WalletType } from './types';
import { registerNetworkWithMetamask } from '../connector';
import { isMobile } from '../../helpers/devices';

export const Coinbase: Wallet = {
  type: WalletType.injected,
  showName: 'Coinbase Wallet',
  logo: <img src={CoinbaseLogo} />,
  supportMobile: false,
  switchChain: registerNetworkWithMetamask,
  checked: () =>
    isMobile &&
    window.ethereum &&
    (window.ethereum.isWalletLink || window.ethereum.isToshi),
  mobileAndroidDeepLink: 'https://go.cb-w.com/dapp?cburl=$formattedAPPUrl',
  mobileIOSDeepLink: 'cbwallet://dapp?url=$formattedAPPUrl',
};

export const TokenPocket: Wallet = {
  type: WalletType.injected,
  showName: 'TokenPocket',
  logo: <TokenPocketLogo />,
  link: 'https://www.tokenpocket.pro/',
  supportMobile: true,
  switchChain: registerNetworkWithMetamask,
  checked: () => window.ethereum && window.ethereum.isTokenPocket,
  mobileDeepLink: `tpdapp://open?params=${encodeURI(`{
    "url": "$APP_URL"
  }`)}`,
};

export const Trust: Wallet = {
  type: WalletType.injected,
  showName: 'TrustWallet',
  logo: <TrustLogo />,
  link: 'https://trustwallet.com/',
  supportMobile: true,
  switchChain: registerNetworkWithMetamask,
  checked: () => window.ethereum?.isTrust,
  mobileDeepLink: 'https://link.trustwallet.com/open_url?url=$APP_URL',
};

export const ImToken: Wallet = {
  type: WalletType.injected,
  showName: 'ImToken',
  logo: <ImTokenLogo />,
  link: 'https://token.im/',
  supportMobile: true,
  switchChain: registerNetworkWithMetamask,
  checked: () => window.ethereum?.isImToken,
  mobileDeepLink: 'imtokenv2://navigate/DappView?url=$formattedAPPUrl',
};

export const Math: Wallet = {
  type: WalletType.injected,
  showName: 'Math Wallet',
  logo: <MathLogo />,
  link: 'https://mathwallet.org',
  supportMobile: true,
  switchChain: registerNetworkWithMetamask,
  checked: () => window.ethereum && window.ethereum.isMathWallet,
};

export const GameStop: Wallet = {
  type: WalletType.injected,
  showName: 'GameStop Wallet',
  logo: <img src={GameStopLogo} />,
  checked: () => window.ethereum?.isGamestop,
  supportMobile: false,
  switchChain: registerNetworkWithMetamask,
  link: 'https://wallet.gamestop.com/',
};

export const Brave: Wallet = {
  type: WalletType.injected,
  showName: 'Brave',
  logo: <BraveLogo />,
  checked: () => window.ethereum?.isBraveWallet,
  supportMobile: false,
  switchChain: registerNetworkWithMetamask,
  link: 'https://wallet-docs.brave.com/',
};

export const Huobi: Wallet = {
  type: WalletType.injected,
  showName: 'Huobi Wallet',
  logo: <HuobiWalletLogo />,
  supportMobile: false,
  switchChain: registerNetworkWithMetamask,
  checked: () => window.ethereum && window.ethereum.isHbWallet,
};

export const Coin98: Wallet = {
  type: WalletType.injected,
  showName: 'Coin98',
  logo: <Coin98Logo />,
  supportMobile: false,
  switchChain: registerNetworkWithMetamask,
  checked: () => window.ethereum && window.ethereum.isCoin98,
};
