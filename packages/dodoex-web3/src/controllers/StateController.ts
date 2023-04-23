import { JsonRpcProvider } from '@ethersproject/providers';
import { ref } from 'valtio';
import { WalletType, allWalletList } from '../providers';
import walletState, { Connected } from '../state';

export default class StateController {
  rpcUrl: string | undefined;
  state: typeof walletState;
  constructor({ rpcUrl }: { rpcUrl?: string }) {
    this.rpcUrl = rpcUrl;
    this.state = walletState;
  }

  setConnectLoading(connectLoading: boolean) {
    walletState.connectLoading = connectLoading;
  }

  async setProvider(provider: JsonRpcProvider, walletType?: WalletType) {
    walletState.provider = ref(provider);
    const { chainId } = await provider.getNetwork();
    let accounts: string[] = [];
    if (walletType) {
      accounts = await provider.listAccounts();
    }
    walletState.chainId = chainId;
    if (walletType) {
      walletState.walletType = walletType;
      walletState.accounts = accounts;
      walletState.account = walletState.accounts[0];
    } else {
      walletState.account = undefined;
      walletState.accounts = undefined;
      walletState.walletType = undefined;
    }
  }

  getProvider() {
    return walletState.provider;
  }

  getState() {
    return walletState;
  }

  setRpcUrl(url: string) {
    this.rpcUrl = url;
    if (!walletState.provider) {
      const provider = new JsonRpcProvider(this.rpcUrl);
      this.setProvider(provider);
    }
  }

  setChainId(chainId?: number) {
    walletState.chainId = chainId ?? 1;
  }

  setAccounts(accounts: Array<string>) {
    walletState.accounts = accounts;
    walletState.account = accounts.length ? accounts[0] : undefined;
  }

  setConnected(connected: Connected | undefined) {
    walletState.connected = connected;
  }

  initialize() {
    if (this.rpcUrl) {
      const provider = new JsonRpcProvider(this.rpcUrl);
      this.setProvider(provider);
    } else {
      walletState.chainId = 1;
      walletState.account = undefined;
      walletState.accounts = undefined;
      walletState.walletType = undefined;
      walletState.provider = undefined;
    }
  }
}
