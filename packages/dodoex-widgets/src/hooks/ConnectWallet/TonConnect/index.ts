import { create } from 'zustand';
import {
  TonConnectUI,
  TonConnect,
  EventDispatcher,
  SdkActionEvent,
  AddTonConnectPrefix,
  RemoveTonConnectPrefix,
} from '@tonconnect/ui';
import { getHttpEndpoint, getHttpV4Endpoint } from '@orbs-network/ton-access';
import { TonClient, TonClient4, Address } from 'ton';
import BigNumber from 'bignumber.js';

interface TonConnectState {
  enabled: boolean;
  client?: TonClient;
  clientV4?: TonClient4;
  tonConnectUI?: TonConnectUI;
  connected?: {
    chainId: number;
    account: string;
  };

  initialize: () => void;
  connect: () => Promise<void>;
  getBlockNumber: () => Promise<number>;
  getTokenBalance: (address: string) => Promise<BigNumber>;
}

const useTonConnectStore = create<TonConnectState>((set, get) => ({
  enabled: false,

  initialize: async () => {
    class CustomEventDispatcher implements EventDispatcher<SdkActionEvent> {
      public async dispatchEvent(
        eventName: string,
        eventDetails: SdkActionEvent,
      ): Promise<void> {
        switch (eventName) {
          case 'ton-connect-connection-completed':
            if (
              eventDetails.type === 'connection-completed' &&
              eventDetails.is_success
            ) {
              if (!eventDetails.wallet_address) {
                throw new Error('wallet_address not found');
              }
              set({
                connected: {
                  chainId: Number(eventDetails.custom_data.chain_id),
                  account: eventDetails.wallet_address,
                },
              });
            }
        }
      }

      addEventListener<
        P extends AddTonConnectPrefix<
          | 'request-version'
          | 'response-version'
          | 'connection-started'
          | 'connection-completed'
          | 'connection-error'
          | 'connection-restoring-started'
          | 'connection-restoring-completed'
          | 'connection-restoring-error'
          | 'disconnection'
          | 'transaction-sent-for-signature'
          | 'transaction-signed'
          | 'transaction-signing-failed'
        >,
      >(
        eventName: P,
        listener: (
          event: CustomEvent<
            SdkActionEvent & { type: RemoveTonConnectPrefix<P> }
          >,
        ) => void,
        options?: AddEventListenerOptions | undefined,
      ): Promise<() => void> {
        throw new Error('Method not implemented.');
      }
    }
    const eventDispatcher = new CustomEventDispatcher();
    const connector = new TonConnect({
      eventDispatcher,
    });
    const tonConnectUI = new TonConnectUI({
      connector,
    });
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });
    const endpointV4 = await getHttpV4Endpoint();
    const clientV4 = new TonClient4({ endpoint: endpointV4 });

    set({
      tonConnectUI,
      client,
      clientV4,
    });
    get().getTokenBalance('EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N');
    get().getBlockNumber();
  },

  connect: async () => {
    const { initialize } = get();
    if (!get().tonConnectUI) {
      await initialize();
    }
    const { tonConnectUI } = get();
    if (!tonConnectUI) {
      throw new Error('tonConnectUI not initialized');
    }
    if (!tonConnectUI.account?.address) {
      await tonConnectUI.connector.restoreConnection();
      if (!tonConnectUI.account?.address) {
        await tonConnectUI.openModal();
      }
    }
  },

  getBlockNumber: async () => {
    const { initialize } = get();
    if (!get().clientV4) {
      await initialize();
    }
    const { clientV4 } = get();
    if (!clientV4) {
      throw new Error('clientV4 not initialized');
    }
    const latestBlock = await clientV4.getLastBlock();
    const latestBlockNumber = latestBlock.last.seqno;
    return latestBlockNumber;
  },

  getTokenBalance: async (addressOrigin) => {
    const { initialize } = get();
    if (!get().client) {
      await initialize();
    }
    const { client } = get();
    if (!client) {
      throw new Error('client not initialized');
    }
    const address = Address.parseFriendly(addressOrigin).address;
    const balance = await client.getBalance(address);
    return new BigNumber(balance.toString());
  },
}));

export default useTonConnectStore;
