import { Actions, Connector } from '@web3-react/types';
import type EthereumProvider from '@walletconnect/ethereum-provider';

export const OATH_APP_STORE = 'https://apps.apple.com/app/id6780187283';
export const getOathWalletUri = (uri: string) =>
  `oathwallet://wc?uri=${encodeURIComponent(uri)}`;

export class OathConnectionCancelled extends Error {
  constructor() {
    super('Oath connection cancelled');
  }
}

// The widget has no eager Oath reconnect. Keep each pairing's SDK state in
// memory, with its own core namespace, so cancelling an older attempt cannot
// delete a newer attempt's pairing (or another widget's session).
let nextPairingId = 0;
function createPairingStorage() {
  const entries = new Map<string, unknown>();
  return {
    async getKeys() {
      return Array.from(entries.keys());
    },
    async getEntries<T>() {
      return Array.from(entries.entries()) as [string, T][];
    },
    async getItem<T>(key: string) {
      return entries.get(key) as T | undefined;
    },
    async setItem<T>(key: string, value: T) {
      entries.set(key, value);
    },
    async removeItem(key: string) {
      entries.delete(key);
    },
  };
}

type Attempt = {
  provider?: EthereumProvider;
  cancel: () => void;
  removeListeners?: () => void;
};

/** A native iOS wallet: no injected browser provider or extension detection. */
export default class OathWalletConnector extends Connector {
  private current?: Attempt;
  private uriListeners = new Set<(uri: string | undefined) => void>();

  constructor(
    actions: Actions,
    private rpcMap: { [chainId: number]: string[] },
    private defaultChainId = 1,
  ) {
    super(actions);
  }

  subscribeUri(listener: (uri: string | undefined) => void) {
    this.uriListeners.add(listener);
    return () => {
      this.uriListeners.delete(listener);
    };
  }

  private emitUri(uri?: string) {
    this.uriListeners.forEach((listener) => listener(uri));
  }

  async activate(chainId = this.defaultChainId): Promise<void> {
    if (this.current && this.provider) {
      const provider = this.current.provider!;
      if (provider.chainId !== chainId) {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      }
      return;
    }
    if (this.current) {
      throw new Error('An Oath connection is already active or pending');
    }
    const rpcUrl = this.rpcMap[chainId]?.[0];
    if (!rpcUrl) throw new Error('No RPC configured for the selected network');

    const cancelActivation = this.actions.startActivation();
    let cancel!: () => void;
    const cancelled = new Promise<never>((_, reject) => {
      cancel = () => reject(new OathConnectionCancelled());
    });
    const attempt: Attempt = { cancel };
    this.current = attempt;
    this.emitUri();
    const isCurrent = () => this.current === attempt;

    const connect = async () => {
      const { default: Provider } =
        await import('@walletconnect/ethereum-provider');
      nextPairingId += 1;
      const provider = await Provider.init({
        projectId: '59e050d1f27ed617e65bb9637c9498d6',
        chains: [chainId],
        rpcMap: { [chainId]: rpcUrl },
        showQrModal: false,
        customStoragePrefix: `dodo-oath-wallet-${nextPairingId}`,
        storage: createPairingStorage(),
        metadata: {
          name: document.title || 'DODO Swap Widget',
          description: 'Connect to the DODO swap widget',
          url: window.location.origin,
          icons: [],
        },
      });
      attempt.provider = provider;
      if (!isCurrent()) {
        await provider.disconnect();
        return;
      }
      const onUri = (uri: string) => {
        if (isCurrent()) this.emitUri(uri);
      };
      const onAccounts = (accounts: string[]) => {
        if (isCurrent() && this.provider) this.actions.update({ accounts });
      };
      const onChain = (hex: string) => {
        if (isCurrent() && this.provider)
          this.actions.update({ chainId: Number(hex) });
      };
      const onDisconnect = () => {
        if (isCurrent()) void this.deactivate();
      };
      provider.on('display_uri', onUri);
      provider.on('accountsChanged', onAccounts);
      provider.on('chainChanged', onChain);
      provider.on('disconnect', onDisconnect);
      attempt.removeListeners = () => {
        provider.removeListener('display_uri', onUri);
        provider.removeListener('accountsChanged', onAccounts);
        provider.removeListener('chainChanged', onChain);
        provider.removeListener('disconnect', onDisconnect);
      };
      await provider.enable();
      // Approval can arrive after the user closed the screen. Never expose that
      // provider, or let an old attempt update a newer web3-react connection.
      if (!isCurrent()) {
        await provider.disconnect();
        return;
      }
      if (!provider.accounts.length)
        throw new Error('Oath returned no accounts');
      this.provider = provider;
      this.actions.update({
        chainId: provider.chainId,
        accounts: provider.accounts,
      });
      this.emitUri();
    };

    try {
      await Promise.race([connect(), cancelled]);
    } catch (error) {
      if (isCurrent()) await this.deactivate();
      throw error;
    } finally {
      // Cancelling an earlier activation must not reset a subsequent attempt.
      if (isCurrent()) cancelActivation();
    }
  }

  async deactivate(): Promise<void> {
    const attempt = this.current;
    this.current = undefined;
    this.provider = undefined;
    this.emitUri();
    this.actions.resetState();
    if (!attempt) return;
    attempt.cancel();
    attempt.removeListeners?.();
    await attempt.provider?.signer
      .cleanupPendingPairings({ deletePairings: true })
      .catch(() => undefined);
    // No connection or pairing data is logged. Cleanup errors must not turn a
    // cancelled attempt into an unhandled rejection or restore its UI state.
    await attempt.provider?.disconnect().catch(() => undefined);
  }
}
