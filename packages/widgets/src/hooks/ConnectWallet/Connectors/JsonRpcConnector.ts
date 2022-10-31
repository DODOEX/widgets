import { JsonRpcProvider } from '@ethersproject/providers';
import {
  Actions,
  Connector,
  ProviderConnectInfo,
  ProviderRpcError,
} from '@web3-react/types';

function parseChainId(chainId: string) {
  return Number.parseInt(chainId, 16);
}

export default class JsonRpcConnector extends Connector {
  constructor(actions: Actions, customProvider: JsonRpcProvider) {
    super(actions);
    this.customProvider = customProvider;
    customProvider
      .on('connect', ({ chainId }: ProviderConnectInfo): void => {
        this.actions.update({ chainId: parseChainId(chainId) });
      })
      .on('disconnect', (error: ProviderRpcError): void => {
        this.onError?.(error);
        this.actions.resetState();
      })
      .on('chainChanged', (chainId: string): void => {
        this.actions.update({ chainId: parseChainId(chainId) });
      })
      .on('accountsChanged', (accounts: string[]): void => {
        this.actions.update({ accounts });
      });
  }

  async activate() {
    this.actions.startActivation();
    const customProvider = this.customProvider as JsonRpcProvider;

    try {
      const [{ chainId }, accounts] = await Promise.all([
        customProvider.getNetwork(),
        customProvider.listAccounts(),
      ]);
      this.actions.update({ chainId, accounts });
    } catch (e) {
      this.actions.resetState();
      throw e;
    }
  }
}
