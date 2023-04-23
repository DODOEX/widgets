import ConnectController from '../controllers/ConnectController';
import StateController from '../controllers/StateController';
import { getIsAndroid, getIsIOS } from '../helpers/devices';
import {
  ConnectorParams,
  getWalletList,
  getIsolatedEnvironmentWallet,
  WalletListParams,
} from '../providers';
import { Wallet } from '../providers/wallets/types';
import walletState from '../state';

export interface ICoreOptions {
  providerConfig: ConnectorParams;
  walletListConfig?: WalletListParams;
  cacheKey?: string;
}

const defaultOptions: Partial<ICoreOptions> = {
  cacheKey: 'DODO-WALLET-CACHED-PROVIDER',
};

export default class Core {
  private providerConfig: ConnectorParams;
  private walletListConfig: WalletListParams | undefined;
  private stateController: StateController;
  public connectController: ConnectController;
  public isOpenBlockIframe = false;
  public isSafeIframe = false;

  constructor(optionsProps: ICoreOptions) {
    const options = {
      ...defaultOptions,
      ...optionsProps,
    } as ICoreOptions;
    const { providerConfig, walletListConfig, cacheKey } = options;
    this.providerConfig = providerConfig;
    const showWalletList = getWalletList({
      PORTIS_ID: providerConfig.portisParams?.id,
      ...walletListConfig,
    });
    this.walletListConfig = walletListConfig;
    const stateController = new StateController({
      rpcUrl: providerConfig.rpcUrl,
    });
    this.stateController = stateController;
    this.connectController = new ConnectController({
      cacheKey: cacheKey as string,
      stateController,
    });
    this.autoConnect(showWalletList);
  }

  private async autoConnect(walletList: Wallet[]) {
    try {
      const connectWallet = (wallet: Wallet) => {
        return this.connectToWallet(wallet, undefined, {
          isAutoConnect: true,
        });
      };
      const isolatedEnvironmentWallet = await getIsolatedEnvironmentWallet();
      if (isolatedEnvironmentWallet) {
        return connectWallet(isolatedEnvironmentWallet);
      }
      const cacheType = this.connectController.getCacheType();
      if (cacheType) {
        const wallet = walletList.find((wallet) => wallet.type === cacheType);
        if (wallet) {
          return connectWallet(wallet);
        }
      }
    } catch (e) {
      console.error(e);
    }
    this.stateController.initialize();
  }

  setRpcUrl(url: string) {
    this.stateController.setRpcUrl(url);
  }

  getWalletList(chainId: number, walletListConfig?: WalletListParams) {
    return getWalletList({
      PORTIS_ID: this.providerConfig.portisParams?.id,
      chainId,
      ...this.walletListConfig,
      ...walletListConfig,
    });
  }

  async connectToWallet(
    wallet: Wallet,
    providerConfig?: Partial<ConnectorParams>,
    params: {
      isAutoConnect?: boolean;
    } = {},
  ) {
    if (providerConfig) {
      this.providerConfig = {
        ...this.providerConfig,
        ...providerConfig,
      };
    }
    return this.connectController.connectWallet(
      wallet,
      this.providerConfig,
      params,
    );
  }

  disconnectWallet() {
    return this.connectController.disconnectWallet();
  }

  connectWalletBefore(wallet: Wallet, disabled?: boolean) {
    const active = walletState.walletType === wallet.type;
    if (active && walletState.account) {
      return false;
    }
    if (disabled) {
      let { link } = wallet;
      if (getIsAndroid()) {
        link =
          wallet.mobileAndroidDeepLink || wallet.mobileDeepLink || wallet.link;
      } else if (getIsIOS()) {
        link = wallet.mobileIOSDeepLink || wallet.mobileDeepLink || wallet.link;
      }
      if (link) {
        window.open(link);
      }
      return false;
    }
    return true;
  }

  clickWallet(wallet: Wallet, providerConfig?: Partial<ConnectorParams>) {
    if (!this.connectWalletBefore(wallet)) return;
    this.connectToWallet(wallet, providerConfig);
  }
}
