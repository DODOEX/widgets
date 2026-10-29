import { ReactComponent as MetamaskIcon } from '../assets/logo/metamask.svg';
import { ReactComponent as WalletConnectIcon } from '../assets/logo/walletConnect.svg';

import { ReactComponent as OathWalletIcon } from '../assets/logo/oathWallet.svg';

export enum WalletType {
  OATH = 'oath',
  INTEGRATOR = 'integrator',
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletConnect',
}

export const WalletMap = {
  [WalletType.OATH]: {
    name: 'Oath Wallet',
    type: WalletType.OATH,
    icon: OathWalletIcon,
    link: 'https://oathwallet.org',
  },
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
