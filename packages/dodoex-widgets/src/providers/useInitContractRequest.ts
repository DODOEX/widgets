import {
  ContractRequests,
  ContractRequestsConfig,
} from '@dodoex/contract-request';
import {
  multiCallAddressList,
  setContractRequests,
} from '@dodoex/dodo-contract-request';
import { setContractRequests as setContractRequestsApi } from '@dodoex/api';
import { useUserOptions } from '../components/UserOptionsProvider';
import React from 'react';
import { getRpcSingleUrlMap } from '../constants/chains';

export function useInitContractRequest(isSet?: boolean) {
  const { getStaticJsonRpcProviderByChainId } = useUserOptions();

  const contractRequests = React.useMemo(() => {
    const contractRequests = new ContractRequests({
      multiCallAddressList,
      getProvider:
        getStaticJsonRpcProviderByChainId as ContractRequestsConfig['getProvider'],
      rpc: getRpcSingleUrlMap(),
    });
    if (isSet) {
      setContractRequests(contractRequests);
      setContractRequestsApi(contractRequests);
    }
    return contractRequests;
  }, [getStaticJsonRpcProviderByChainId, isSet]);

  return contractRequests;
}
