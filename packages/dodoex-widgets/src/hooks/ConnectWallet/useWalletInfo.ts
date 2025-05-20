import { btcSignet, ChainId } from '@dodoex/api';
import { CaipNetworksUtil } from '@reown/appkit-utils';
import { bitcoin, solana, solanaDevnet } from '@reown/appkit/networks';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect,
} from '@reown/appkit/react';
import { useCallback, useMemo } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { chainListMap } from '../../constants/chainList';

export function useWalletInfo() {
  const { open, close } = useAppKit();
  const { disconnect } = useDisconnect();

  const { onlyChainId, defaultChainId } = useUserOptions();

  const evmAccount = useAppKitAccount({ namespace: 'eip155' }); // for EVM chains
  const solanaAccount = useAppKitAccount({ namespace: 'solana' });
  const bitcoinAccount = useAppKitAccount({ namespace: 'bip122' }); // for bitcoin

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
      const targetCaipNetwork = chainListMap.get(targetChainId)?.caipNetwork;
      if (!targetCaipNetwork) {
        return undefined;
      }
      const namespace = CaipNetworksUtil.getChainNamespace(targetCaipNetwork);

      const appKitAccount =
        namespace === 'bip122'
          ? bitcoinAccount
          : namespace === 'solana'
            ? solanaAccount
            : evmAccount;

      return { appKitAccount, namespace, targetCaipNetwork };
    },
    [bitcoinAccount, evmAccount, solanaAccount],
  );

  return {
    open,
    close,
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

    getAppKitAccountByChainId,
  };
}
