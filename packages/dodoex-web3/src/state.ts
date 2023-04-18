import { JsonRpcProvider } from '@ethersproject/providers';
import { proxy, ref } from 'valtio';
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
  disabledWalletTypeSet: new Set() as Set<string>,
  connectLoading: false,
  connected: undefined as Connected | undefined,
});

devtools(walletState, { name: 'dodo-wallet', enabled: true });

export default walletState;
