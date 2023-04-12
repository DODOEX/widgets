import { JsonRpcProvider } from '@ethersproject/providers';
import { proxy, ref } from 'valtio';
import { devtools } from 'valtio/utils';
import { WalletType, Wallet } from './providers';

const walletState = proxy({
  chainId: 1,
  account: undefined as string | undefined,
  accounts: undefined as string[] | undefined,
  provider: undefined as JsonRpcProvider | undefined,
  walletType: undefined as WalletType | undefined,
  connected: false,
  walletList: ref([]) as Array<Wallet>,
  disabledWalletTypeSet: new Set() as Set<string>,
});

devtools(walletState, { name: 'dodo-wallet', enabled: true });

export default walletState;
