import {
  btcSignet,
  ChainId,
  sui,
  suiTestnet,
  ton,
  tonTestnet,
} from '@dodoex/api';
import { Web3Provider } from '@ethersproject/providers';
import {
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useSuiClientContext,
} from '@mysten/dapp-kit';
import { type Provider } from '@reown/appkit-adapter-solana/react';
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
import {
  CHAIN,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react';
import { useCallback, useMemo, useState } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { chainListMap } from '../../constants/chainList';
import { CaipNetworksUtil } from '../../utils/CaipNetworksUtil';
import {
  ChainNamespaceExtend,
  UseAppKitAccountReturnExtend,
} from '../../utils/reown-types';
import { useBTCWalletStore } from './useBTCWalletStore';

export function useWalletInfo() {
  const appKit = useAppKit();
  const appKitDisconnect = useDisconnect();

  const { onlyChainId, defaultChainId, solanaConnection } = useUserOptions();

  const btcWalletStore = useBTCWalletStore();

  const evmAccount = useAppKitAccount({ namespace: 'eip155' }); // for EVM chains
  const solanaAccount = useAppKitAccount({ namespace: 'solana' });
  // const bitcoinAccount = useAppKitAccount({ namespace: 'bip122' }); // for bitcoin

  const tonConnectModal = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();
  // https://ton-connect.github.io/sdk/modules/_tonconnect_ui-react.html#usetonwallet
  const tonWallet = useTonWallet();
  const tonUserFriendlyAddress = useTonAddress();

  // sui
  const [suiConnectModalOpen, setSuiConnectModalOpen] = useState(false);
  const { mutate: suiDisconnect } = useDisconnectWallet();
  const suiCurrentAccount = useCurrentAccount();
  const suiCurrentWallet = useCurrentWallet();
  const suiContext = useSuiClientContext();
  // const suiClient = useSuiClient();

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
      caipAddress: `bip122:${btcWalletStore.network === 'livenet' ? bitcoin.id : btcSignet.id}:${btcWalletStore.address}`,
      address: btcWalletStore.address,
      isConnected: btcWalletStore.connected,
      embeddedWalletInfo: undefined,
      status: btcWalletStore.connected ? 'connected' : 'disconnected',
    };
  }, [btcWalletStore]);

  const tonAccount = useMemo<UseAppKitAccountReturnExtend>(() => {
    if (tonWallet == null || !tonUserFriendlyAddress) {
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
          namespace: 'ton',
          address: tonUserFriendlyAddress,
          // publicKey: tonWallet.account.publicKey,
          type: 'eoa',
        },
      ],
      caipAddress: `ton:${tonWallet.account.chain === CHAIN.MAINNET ? ChainId.TON : ChainId.TON_TESTNET}:${tonUserFriendlyAddress}`,
      address: tonUserFriendlyAddress,
      isConnected: true,
      embeddedWalletInfo: undefined,
      status: 'connected',
    };
  }, [tonUserFriendlyAddress, tonWallet]);

  const suiAccount = useMemo<UseAppKitAccountReturnExtend>(() => {
    if (
      suiCurrentWallet.connectionStatus !== 'connected' ||
      suiCurrentAccount == null
    ) {
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
          namespace: 'sui',
          address: suiCurrentAccount.address,
          // publicKey: suiCurrentAccount.publicKey,
          type: 'eoa',
        },
      ],
      caipAddress: `sui:${suiContext.network === 'mainnet' ? ChainId.SUI : ChainId.SUI_TESTNET}:${suiCurrentAccount.address}`,
      address: suiCurrentAccount.address,
      isConnected: true,
      embeddedWalletInfo: undefined,
      status: 'connected',
    };
  }, [
    suiContext.network,
    suiCurrentAccount,
    suiCurrentWallet.connectionStatus,
  ]);

  const { walletProvider: ethersProvider } =
    useAppKitProvider<CoreProvider | null>('eip155');

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
    if (appKitChainId === sui.id) {
      return ChainId.SUI;
    }
    if (appKitChainId === suiTestnet.id) {
      return ChainId.SUI_TESTNET;
    }
    if (appKitChainId === ton.id) {
      return ChainId.TON;
    }
    if (appKitChainId === tonTestnet.id) {
      return ChainId.TON_TESTNET;
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

    return namespace === 'sui'
      ? suiAccount
      : namespace === 'ton'
        ? tonAccount
        : namespace === 'bip122'
          ? bitcoinAccount
          : namespace === 'solana'
            ? solanaAccount
            : evmAccount;
  }, [
    bitcoinAccount,
    chainIdToCaipNetwork,
    evmAccount,
    solanaAccount,
    suiAccount,
    tonAccount,
  ]);

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
        namespace === 'sui'
          ? suiAccount
          : namespace === 'ton'
            ? tonAccount
            : namespace === 'bip122'
              ? {
                  ...bitcoinAccount,
                }
              : namespace === 'solana'
                ? solanaAccount
                : evmAccount;

      return { appKitAccount, namespace, targetCaipNetwork, chain };
    },
    [bitcoinAccount, evmAccount, solanaAccount, suiAccount, tonAccount],
  );

  const open = useCallback(
    ({ namespace }: { namespace?: ChainNamespaceExtend }) => {
      if (namespace === 'bip122') {
        btcWalletStore?.setModalVisible(true);
        return;
      }

      if (namespace === 'ton') {
        tonConnectModal.open();
        return;
      }

      if (namespace === 'sui') {
        setSuiConnectModalOpen(true);
        return;
      }

      appKit.open({ namespace });
    },
    [appKit, btcWalletStore, tonConnectModal],
  );

  const disconnect = useCallback(
    ({ namespace }: { namespace?: ChainNamespaceExtend }) => {
      if (namespace === 'bip122') {
        btcWalletStore?.disconnect();
        return;
      }

      if (namespace === 'ton') {
        tonConnectUI.disconnect();
        return;
      }

      if (namespace === 'sui') {
        setSuiConnectModalOpen(false);
        suiDisconnect();
        return;
      }

      appKitDisconnect.disconnect({ namespace });
    },
    [appKitDisconnect, btcWalletStore, suiDisconnect, tonConnectUI],
  );

  const evmProvider = useMemo(() => {
    if (!ethersProvider) {
      return null;
    }
    return new Web3Provider(ethersProvider, chainId);
  }, [chainId, ethersProvider]);

  return {
    open,
    disconnect,

    suiConnectModalOpen,
    setSuiConnectModalOpen,

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
    tonAccount,
    suiAccount,

    evmProvider,

    solanaWalletProvider,
    solanaConnection,

    bitcoinWalletProvider: btcWalletStore?.btcWallet,

    tonConnectUI,

    getAppKitAccountByChainId,
  };
}
