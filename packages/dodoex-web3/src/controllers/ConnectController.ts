import { watch } from 'valtio/utils';
import { ConnectorParams, WalletType } from '../providers';
import { Wallet } from '../providers/wallets/types';
import walletState from '../state';
import StateController from './StateController';
export default class ConnectController {
  private _wallet: Wallet | undefined;
  private cacheKey: string;
  stateController: StateController;
  constructor({
    cacheKey,
    stateController,
  }: {
    cacheKey: string;
    stateController: StateController;
  }) {
    this.cacheKey = cacheKey;
    this.stateController = stateController;
  }

  private setCacheType(type: WalletType) {
    localStorage.setItem(this.cacheKey, type);
  }

  private removeCache() {
    localStorage.removeItem(this.cacheKey);
  }

  getCacheType() {
    return localStorage.getItem(this.cacheKey) as WalletType;
  }

  async getConnectedWallet() {
    if (walletState.connectLoading) {
      let time: NodeJS.Timeout | undefined;
      let stopWatch: ReturnType<typeof watch> | undefined;
      await Promise.race([
        new Promise((resolve) => {
          stopWatch = watch((get) => {
            if (get(walletState).connectLoading === false) {
              resolve(true);
            }
          });
        }),
        new Promise((resolve) => {
          time = setTimeout(() => {
            resolve(false);
          }, 4000);
        }),
      ]);
      clearTimeout(time);
      if (stopWatch) {
        stopWatch();
      }
    }
    return this._wallet;
  }

  async connectWallet(
    wallet: Wallet,
    providerConfig: ConnectorParams,
    {
      isAutoConnect,
    }: {
      isAutoConnect?: boolean;
    } = {},
  ) {
    if (!wallet) {
      throw new Error('wallet is not valid.');
    }
    if (!wallet.connector) {
      throw new Error(`${wallet.showName} is not valid.`);
    }
    this.stateController.setConnectLoading(true);
    const { type, connector } = wallet;
    const provider = await connector(providerConfig, {
      connect: ({ chainId }) => {
        const chainIdNumber = parseInt(chainId, 16);
        if (chainIdNumber) {
          this.stateController.setChainId(chainIdNumber);
        }
        this.stateController.setConnected({
          isAutoConnect: !!isAutoConnect,
          wallet,
        });
      },
      accountsChanged: (accounts) => {
        this.stateController.setAccounts(accounts);
      },
      chainChanged: (chainId) => {
        const chainIdNumber = parseInt(chainId, 16);
        if (chainIdNumber) {
          this.stateController.setChainId(chainIdNumber);
        }
      },
      message: () => {
        // empty
      },
      disconnect: (error) => {
        this.stateController.setConnected(undefined);
      },
    });
    if (provider) {
      this.setCacheType(type);
      this._wallet = wallet;
      this.stateController.setProvider(provider, type);
    }
    this.stateController.setConnectLoading(false);
    return provider;
  }

  async disconnectWallet() {
    const connectType = this.getCacheType();
    if (!connectType) return;
    if (this._wallet?.disconnect) {
      await this._wallet.disconnect();
    }
    this._wallet = undefined;
    this.removeCache();
    this.stateController.initialize();
  }
}
