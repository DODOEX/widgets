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
import { TonClient, TonClient4, Address, beginCell } from 'ton';
import BigNumber from 'bignumber.js';

/**
 * https://ton-community.github.io/ton/modules.html
 * https://ton-org.github.io/ton-core/modules.html
 * https://toncenter.com/api/v2/
 */

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
  getJettonWallet: (jettonMasterAddress: string) => Promise<string>;
  getBalance: (account: string) => Promise<BigNumber>;
  getTokenBalance: (
    jettonMasterAddress: string,
    decimals: number,
  ) => Promise<BigNumber>;
}

const useTonConnectStore = create<TonConnectState>((set, get) => ({
  enabled: false,

  initialize: async () => {
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });
    const endpointV4 = await getHttpV4Endpoint();
    const clientV4 = new TonClient4({ endpoint: endpointV4 });

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
                  account: Address.parseRaw(
                    eventDetails.wallet_address,
                  ).toString({
                    bounceable: false,
                  }),
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

    set({
      tonConnectUI,
      client,
      clientV4,
    });
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

  getJettonWallet: async (jettonMasterAddress) => {
    const { initialize } = get();
    if (!get().client) {
      await initialize();
    }
    const { client, tonConnectUI, connected } = get();
    if (!client || !tonConnectUI) {
      throw new Error('tonConnect not initialized');
    }
    if (!connected) {
      throw new Error('account not found');
    }
    const owner = Address.parseFriendly(connected.account).address;
    const data = await client.runMethod(
      Address.parseFriendly(jettonMasterAddress).address,
      'get_wallet_address',
      [{ type: 'slice', cell: beginCell().storeAddress(owner).endCell() }],
    );
    return data.stack.readAddress().toString();
  },

  getBalance: async (account) => {
    const { initialize } = get();
    if (!get().client) {
      await initialize();
    }
    const { client } = get();
    if (!client) {
      throw new Error('tonConnect not initialized');
    }
    const address = Address.parseFriendly(account).address;
    const balance = await client.getBalance(address);
    const result = new BigNumber(balance.toString()).div(10 ** 9);
    return result;
  },

  getTokenBalance: async (jettonMasterAddress, decimals) => {
    const { getJettonWallet } = get();
    const jettonWalletAddress = await getJettonWallet(jettonMasterAddress);
    const { initialize } = get();
    if (!get().client) {
      await initialize();
    }
    const { client } = get();
    if (!client) {
      throw new Error('client not initialized');
    }
    const data = await client.runMethod(
      Address.parseFriendly(jettonWalletAddress).address,
      'get_wallet_data',
    );
    const balance = new BigNumber(data.stack.readBigNumber().toString()).div(
      10 ** decimals,
    );
    return balance;
  },
}));

export default useTonConnectStore;
