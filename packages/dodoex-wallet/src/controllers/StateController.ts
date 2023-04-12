import { JsonRpcProvider } from '@ethersproject/providers';
import { ref } from 'valtio';
import { WalletType, Wallet } from '../providers';
import walletState from '../state';

export default class StateController {
  rpcUrl: string | undefined;
  state: typeof walletState;
  constructor({
    rpcUrl,
    walletList,
  }: {
    rpcUrl?: string;
    walletList: Array<Wallet>;
  }) {
    this.rpcUrl = rpcUrl;
    if (!walletState.provider) {
      this.initialize();
    }
    this.state = walletState;
    walletState.walletList = ref(walletList);
    const disabledPromiseList: Array<() => Promise<void>> = [];
    const syncDisabledWalletTypeSet = new Set<WalletType>();
    walletList.forEach((item) => {
      if (item.disabled) {
        const disabledPromise = item.disabled();
        if (typeof disabledPromise === 'boolean') {
          if (disabledPromise) {
            walletState.disabledWalletTypeSet.add(item.type);
          }
        } else {
          disabledPromiseList.push(async () => {
            const disabled = await disabledPromise;
            if (disabled) {
              syncDisabledWalletTypeSet.add(item.type);
            }
          });
        }
      }
    });
    Promise.all(disabledPromiseList.map((item) => item())).then(() => {
      walletState.disabledWalletTypeSet = new Set([
        ...walletState.disabledWalletTypeSet,
        ...syncDisabledWalletTypeSet,
      ]);
    });
  }

  async setProvider(provider: JsonRpcProvider, walletType?: WalletType) {
    walletState.provider = ref(provider);
    if (walletType) {
      walletState.walletType = walletType;
      walletState.accounts = await provider.listAccounts();
      walletState.account = walletState.accounts[0];
    } else {
      walletState.account = undefined;
      walletState.accounts = undefined;
      walletState.walletType = undefined;
    }
    const { chainId } = await provider.getNetwork();
    walletState.chainId = chainId;
  }

  getProvider() {
    return walletState.provider;
  }

  getState() {
    return walletState;
  }

  setChainId(chainId?: number) {
    walletState.chainId = chainId ?? 1;
  }

  setAccounts(accounts: Array<string>) {
    walletState.accounts = accounts;
    walletState.account = accounts.length ? accounts[0] : undefined;
  }

  setConnected(connected: boolean) {
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
