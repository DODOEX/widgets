import ConnectController from '../controllers/ConnectController';
import StateController from '../controllers/StateController';
import { isAndroid, isIOS } from '../helpers/devices';
import { ConnectorParams, getWalletList, WalletListParams } from '../providers';
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
  public connectController: ConnectController;

  constructor(optionsProps: ICoreOptions) {
    const options = {
      ...defaultOptions,
      ...optionsProps,
    } as ICoreOptions;
    const { providerConfig, walletListConfig, cacheKey } = options;
    this.providerConfig = providerConfig;
    const showWalletList = getWalletList({
      PORTIS_ID: providerConfig.portisParams?.id,
      chainId: providerConfig.chainId,
      ...walletListConfig,
    });
    const stateController = new StateController({
      rpcUrl: providerConfig.rpcUrl,
      walletList: showWalletList,
    });
    this.connectController = new ConnectController({
      cacheKey: cacheKey as string,
      stateController,
    });
    this.autoConnect(showWalletList);
  }

  private async autoConnect(walletList: Wallet[]) {
    const cacheType = this.connectController.getCacheType();
    if (cacheType) {
      const wallet = walletList.find((wallet) => wallet.type === cacheType);
      if (wallet) {
        return this.connectController.connectWallet(
          wallet,
          this.providerConfig,
        );
      }
    }
  }

  async connectToWallet(wallet: Wallet) {
    return this.connectController.connectWallet(wallet, this.providerConfig);
  }

  disconnectWallet() {
    return this.connectController.disconnectWallet();
  }

  clickWallet(
    wallet: Wallet,
    {
      disabled,
      active,
    }: {
      disabled: boolean;
      active: boolean;
    },
  ) {
    if (active && walletState.account) {
      return;
    }
    if (disabled) {
      let { link } = wallet;
      if (isAndroid) {
        link =
          wallet.mobileAndroidDeepLink || wallet.mobileDeepLink || wallet.link;
      } else if (isIOS) {
        link = wallet.mobileIOSDeepLink || wallet.mobileDeepLink || wallet.link;
      }
      if (link) {
        window.open(link);
      }
      return;
    }
    this.connectToWallet(wallet);
  }
}
