import { ConnectorParams, WalletType } from '../providers';
import { Wallet } from '../providers/wallets/types';
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

  async connectWallet(wallet: Wallet, providerConfig: ConnectorParams) {
    if (!wallet) {
      throw new Error('wallet is not valid.');
    }
    if (!wallet.connector) {
      throw new Error(`${wallet.showName} is not valid.`);
    }
    const { type, connector } = wallet;
    const provider = await connector(providerConfig, {
      connect: ({ chainId }) => {
        const chainIdNumber = parseInt(chainId, 16);
        if (chainIdNumber) {
          this.stateController.setChainId(chainIdNumber);
        }
        this.stateController.setConnected(true);
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
        this.stateController.setConnected(false);
      },
    });
    this.setCacheType(type);
    this._wallet = wallet;
    if (provider) {
      this.stateController.setProvider(provider, type);
    }
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
