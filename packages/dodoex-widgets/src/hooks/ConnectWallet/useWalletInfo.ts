import { ChainId } from '@dodoex/api';
import { CaipNetworksUtil } from '@reown/appkit-utils';
import { bitcoin, solana, solanaDevnet } from '@reown/appkit/networks';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useCallback, useMemo } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { chainListMap } from '../../constants/chainList';

export function useWalletInfo() {
  const { onlyChainId, defaultChainId } = useUserOptions();

  const evmAccount = useAppKitAccount({ namespace: 'eip155' }); // for EVM chains
  const solanaAccount = useAppKitAccount({ namespace: 'solana' });
  const bitcoinAccount = useAppKitAccount({ namespace: 'bip122' }); // for bitcoin

  const appKitNetwork = useAppKitNetwork();

  const chainId = useMemo<ChainId>(() => {
    console.log('appKitNetwork', appKitNetwork);
    if (!appKitNetwork || !appKitNetwork.caipNetwork) {
      return onlyChainId || defaultChainId || ChainId.MAINNET;
    }
    const appKitChainId = appKitNetwork.chainId;
    if (appKitChainId === solana.id) {
      return ChainId.SOLANA;
    }
    if (appKitChainId === solanaDevnet.id) {
      return ChainId.SOLANA_DEVNET;
    }
    if (appKitChainId === bitcoin.id) {
      return ChainId.BTC;
    }
    return Number(appKitChainId) as ChainId;
  }, [appKitNetwork, defaultChainId, onlyChainId]);

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

  const getAccountByChainId = useCallback(
    (targetChainId: ChainId) => {
      const targetCaipNetwork = chainListMap.get(targetChainId)?.caipNetwork;
      if (!targetCaipNetwork) {
        return;
      }
      const namespace = CaipNetworksUtil.getChainNamespace(targetCaipNetwork);

      return namespace === 'bip122'
        ? bitcoinAccount
        : namespace === 'solana'
          ? solanaAccount
          : evmAccount;
    },
    [bitcoinAccount, evmAccount, solanaAccount],
  );

  return {
    chainId,
    chainIdToCaipNetwork,
    connectedChainId: chainId,
    defaultChainId,
    onlyChainId,
    account: currentAccount?.address,
    currentAccount,
    evmAccount,
    solanaAccount,
    bitcoinAccount,

    getAccountByChainId,
  };
}
