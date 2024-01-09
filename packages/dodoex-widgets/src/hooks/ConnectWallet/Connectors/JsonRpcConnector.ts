import { JsonRpcProvider } from '@ethersproject/providers';
import {
  Actions,
  Connector,
  Provider,
  ProviderConnectInfo,
  ProviderRpcError,
} from '@web3-react/types';

function parseChainId(chainId: string) {
  return Number.parseInt(chainId, 16);
}

export default class JsonRpcConnector extends Connector {
  customProvider: JsonRpcProvider;
  constructor(
    actions: Actions,
    customProvider: JsonRpcProvider,
    onError?: (error: Error) => void,
  ) {
    super(actions, onError);
    this.customProvider = customProvider;
    const provider = (customProvider as any)?.provider as Provider;
    if (provider) {
      this.provider = provider;
    }
    const eventProvider = provider ?? customProvider;
    eventProvider
      .on('connect', ({ chainId }: ProviderConnectInfo): void => {
        setTimeout(() => {
          this.actions.update({ chainId: parseChainId(chainId) });
        });
      })
      .on('disconnect', (error: ProviderRpcError): void => {
        setTimeout(() => {
          this.onError?.(error);
          this.actions.resetState();
        });
      })
      .on('chainChanged', (chainId: string): void => {
        setTimeout(() => {
          this.actions.update({ chainId: parseChainId(chainId) });
        });
      })
      .on('accountsChanged', (accounts: string[]): void => {
        setTimeout(() => {
          this.actions.update({ accounts });
        });
      });
  }

  private async activateAccounts(): Promise<void> {
    const cancelActivation = this.actions.startActivation();

    try {
      // Wallets may resolve eth_chainId and hang on eth_accounts pending user interaction, which may include changing
      // chains; they should be requested serially, with accounts first, so that the chainId can settle.
      const accounts = await this.customProvider.listAccounts();
      const { chainId } = await this.customProvider.getNetwork();
      this.actions.update({ chainId, accounts });
    } catch (error) {
      cancelActivation();
      throw error;
    }
  }

  async connectEagerly() {
    return this.activateAccounts();
  }

  async activate() {
    return this.activateAccounts();
  }
}
