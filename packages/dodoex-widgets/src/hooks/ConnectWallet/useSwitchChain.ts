import { ChainId } from '@dodoex/api';
import { useAppKitNetwork } from '@reown/appkit/react';
import { useMemo } from 'react';
import { chainListMap } from '../../constants/chainList';

export function useSwitchChain(chainId?: ChainId) {
  const { switchNetwork } = useAppKitNetwork();

  const switchChain = useMemo(() => {
    if (!chainId) {
      return undefined;
    }
    const caipNetwork = chainListMap.get(chainId)?.caipNetwork;
    if (!caipNetwork) {
      return undefined;
    }
    return () => {
      return switchNetwork(caipNetwork);
    };
  }, [chainId, switchNetwork]);

  return switchChain;
}
