import { setContractRequests as setContractRequestsApi } from '@dodoex/api';
import { ContractRequests } from '@dodoex/contract-request';
import {
  multiCallAddressList,
  setContractRequests,
} from '@dodoex/dodo-contract-request';
import React from 'react';
import { chainListMap } from '../constants/chainList';
import { getRpcSingleUrlMap } from '../constants/chains';
import { useWalletInfo } from '../hooks/ConnectWallet/useWalletInfo';

import { contractRequests as contractRequestsApi } from '../constants/api';

export function useInitContractRequest() {
  const { chainId: currentChainId, evmProvider } = useWalletInfo();

  React.useEffect(() => {
    const getProvider = (chainId: number) => {
      if (chainId === currentChainId) {
        const chain = chainListMap.get(chainId);
        if (chain?.isEVMChain) {
          return evmProvider;
        }
      }

      return null;
    };

    const CR = new ContractRequests({
      multiCallAddressList,
      getProvider,

      rpc: getRpcSingleUrlMap(),
    });

    contractRequestsApi.setGetConfigProvider(getProvider);

    setContractRequests(CR);
    setContractRequestsApi(CR);
  }, [currentChainId, evmProvider]);
}
