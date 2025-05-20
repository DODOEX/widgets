import { ChainId } from '@dodoex/api';
import { useMemo } from 'react';
import { useWalletInfo } from './useWalletInfo';

export function useAppKitAccountByChainId(chainId: ChainId | undefined) {
  const { getAppKitAccountByChainId } = useWalletInfo();

  const appKitAccount = useMemo(() => {
    return !chainId ? undefined : getAppKitAccountByChainId(chainId);
  }, [getAppKitAccountByChainId, chainId]);

  return {
    appKitAccount: appKitAccount?.appKitAccount,
    namespace: appKitAccount?.namespace,
    targetCaipNetwork: appKitAccount?.targetCaipNetwork,
    account: appKitAccount?.appKitAccount?.address,
  };
}
