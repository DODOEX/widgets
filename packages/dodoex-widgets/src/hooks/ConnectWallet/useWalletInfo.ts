import { btcSignet, ChainId } from '@dodoex/api';
import { type Provider } from '@reown/appkit-adapter-solana/react';
import { ChainNamespace } from '@reown/appkit-common';
import { CaipNetworksUtil } from '@reown/appkit-utils';
import { bitcoin, solana, solanaDevnet } from '@reown/appkit/networks';
import type {
  Provider as CoreProvider,
  UseAppKitAccountReturn,
} from '@reown/appkit/react';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
  useDisconnect,
} from '@reown/appkit/react';
import { useCallback, useMemo } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { chainListMap } from '../../constants/chainList';
import { useBTCWalletStore } from './useBTCWalletStore';

export function useWalletInfo() {
  const appKit = useAppKit();
  const appKitDisconnect = useDisconnect();

  const { onlyChainId, defaultChainId, solanaConnection } = useUserOptions();

  const btcWalletStore = useBTCWalletStore();

  const evmAccount = useAppKitAccount({ namespace: 'eip155' }); // for EVM chains
  const solanaAccount = useAppKitAccount({ namespace: 'solana' });
  // const bitcoinAccount = useAppKitAccount({ namespace: 'bip122' }); // for bitcoin

  const bitcoinAccount = useMemo<UseAppKitAccountReturn>(() => {
    if (!btcWalletStore || !btcWalletStore.address) {
      return {
        allAccounts: [],
        caipAddress: undefined,
        address: undefined,
        isConnected: false,
        embeddedWalletInfo: undefined,
        status: 'disconnected',
      };
    }

    return {
      allAccounts: [
        {
          namespace: 'bip122',
          address: btcWalletStore.address,
          publicKey: btcWalletStore.publicKey,
          type: 'payment',
        },
      ],
      caipAddress: `bip122:${btcSignet.id}:${btcWalletStore.address}`,
      address: btcWalletStore.address,
      isConnected: btcWalletStore.connected,
      embeddedWalletInfo: undefined,
      status: btcWalletStore.connected ? 'connected' : 'disconnected',
    };
  }, [btcWalletStore]);

  const { walletProvider: ethersProvider } =
    useAppKitProvider<CoreProvider>('eip155');

  const { walletProvider: solanaWalletProvider } =
    useAppKitProvider<Provider>('solana');

  // const { walletProvider: bitcoinWalletProvider } =
  //   useAppKitProvider<BitcoinConnector>('bip122');

  const appKitActiveNetwork = useAppKitNetwork();

  const chainId = useMemo<ChainId>(() => {
    if (!appKitActiveNetwork || !appKitActiveNetwork.caipNetwork) {
      return onlyChainId || defaultChainId || ChainId.MAINNET;
    }
    const appKitChainId = appKitActiveNetwork.chainId;
    if (appKitChainId === solana.id) {
      return ChainId.SOLANA;
    }
    if (appKitChainId === solanaDevnet.id) {
      return ChainId.SOLANA_DEVNET;
    }
    if (appKitChainId === btcSignet.id) {
      return ChainId.BTC_SIGNET;
    }
    if (appKitChainId === bitcoin.id) {
      return ChainId.BTC;
    }
    return Number(appKitChainId) as ChainId;
  }, [appKitActiveNetwork, defaultChainId, onlyChainId]);

  const chainIdToCaipNetwork = useMemo(() => {
    return chainListMap.get(chainId)?.caipNetwork;
  }, [chainId]);

  const currentAccount = useMemo(() => {
    if (!chainIdToCaipNetwork) {
      return;
    }
    const namespace = CaipNetworksUtil.getChainNamespace(chainIdToCaipNetwork);

    return namespace === 'bip122'
      ? bitcoinAccount
      : namespace === 'solana'
        ? solanaAccount
        : evmAccount;
  }, [bitcoinAccount, chainIdToCaipNetwork, evmAccount, solanaAccount]);

  const getAppKitAccountByChainId = useCallback(
    (targetChainId: ChainId | undefined) => {
      if (!targetChainId) {
        return undefined;
      }
      const chain = chainListMap.get(targetChainId);

      if (!chain?.caipNetwork) {
        return undefined;
      }
      const targetCaipNetwork = chain.caipNetwork;
      const namespace = CaipNetworksUtil.getChainNamespace(targetCaipNetwork);

      const appKitAccount =
        namespace === 'bip122'
          ? {
              ...bitcoinAccount,
            }
          : namespace === 'solana'
            ? solanaAccount
            : evmAccount;

      return { appKitAccount, namespace, targetCaipNetwork, chain };
    },
    [bitcoinAccount, evmAccount, solanaAccount],
  );

  const open = useCallback(
    ({ namespace }: { namespace?: ChainNamespace }) => {
      if (namespace === 'bip122') {
        btcWalletStore?.setModalVisible(true);
        return;
      }

      appKit.open({ namespace });
    },
    [appKit, btcWalletStore],
  );

  const disconnect = useCallback(
    ({ namespace }: { namespace?: ChainNamespace }) => {
      if (namespace === 'bip122') {
        btcWalletStore?.disconnect();
        return;
      }

      appKitDisconnect.disconnect();
    },
    [appKitDisconnect, btcWalletStore],
  );

  return {
    open,
    disconnect,

    chainId,
    chainIdToCaipNetwork,
    connectedChainId: chainId,
    defaultChainId,
    onlyChainId,
    account: currentAccount?.address,
    currentAccount,

    appKitActiveNetwork,

    evmAccount,
    solanaAccount,
    bitcoinAccount,

    ethersProvider,

    solanaWalletProvider,
    solanaConnection,

    bitcoinWalletProvider: btcWalletStore?.btcWallet,

    getAppKitAccountByChainId,
  };
}
