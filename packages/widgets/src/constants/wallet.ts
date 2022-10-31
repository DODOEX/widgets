import { ReactComponent as MetamaskIcon } from '../assets/logo/metamask.svg';
import { ReactComponent as WalletConnectIcon } from '../assets/logo/walletConnect.svg';

export enum WalletType {
  INTEGRATOR = 'integrator',
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletConnect',
}

export const WalletMap = {
  [WalletType.METAMASK]: {
    name: 'MetaMask',
    type: WalletType.METAMASK,
    icon: MetamaskIcon,
    link: 'https://metamask.io',
  },
  [WalletType.WALLET_CONNECT]: {
    name: 'WalletConnect',
    type: WalletType.WALLET_CONNECT,
    icon: WalletConnectIcon,
  },
};
