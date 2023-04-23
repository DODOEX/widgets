import { JsonRpcProvider } from '@ethersproject/providers';
import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';
import { Wallet, WalletType } from './providers';

export interface Connected {
  isAutoConnect: boolean;
  wallet: Wallet;
}

const walletState = proxy({
  chainId: 1,
  account: undefined as string | undefined,
  accounts: undefined as string[] | undefined,
  provider: undefined as JsonRpcProvider | undefined,
  walletType: undefined as WalletType | undefined,
  connectLoading: false,
  connected: undefined as Connected | undefined,
});

devtools(walletState, { name: 'dodo-wallet', enabled: true });

export default walletState;
