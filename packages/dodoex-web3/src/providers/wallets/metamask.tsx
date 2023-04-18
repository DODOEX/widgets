import { Wallet, WalletType } from './types';
import MetamaskLogo from './logos/metamask.svg';
import { registerNetworkWithMetamask } from '../connector';

const MetamaskWallet: Wallet = {
  type: WalletType.injected,
  showName: 'MetaMask',
  link: 'https://metamask.io',
  logo: <MetamaskLogo />,
  supportMobile: true,
  mobileDeepLink: 'https://metamask.app.link/dapp/$host',
  switchChain: registerNetworkWithMetamask,
  disabled: () => !window.ethereum,
};

export default MetamaskWallet;
