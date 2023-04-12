import { Wallet, WalletType } from './types';
import { ReactComponent as MetamaskLogo } from './logos/metamask.svg';
import { registerNetworkWithMetamask } from '../connector';

const MetamaskWallet: Wallet = {
  type: WalletType.injected,
  showName: 'MetaMask',
  link: 'https://metamask.io',
  logo: <MetamaskLogo />,
  supportMobile: true,
  mobileDeepLink: 'https://metamask.app.link/dapp/$host',
  switchChain: registerNetworkWithMetamask,
  checked: () => !!window.ethereum,
};

export default MetamaskWallet;
