import { ChainId } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { tokenApi } from '../../constants/api';
import { chainListMap } from '../../constants/chainList';
import { basicTokenMap } from '../../constants/chains';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useGlobalState } from '../useGlobalState';

export default function useFetchETHBalance(chainId?: ChainId) {
  const { getAppKitAccountByChainId } = useWalletInfo();
  const { latestBlockNumber: blockNumber } = useGlobalState();

  const query = tokenApi.getFetchTokenQuery(
    chainId
      ? chainListMap.get(chainId)?.isEVMChain
        ? chainId
        : undefined
      : undefined,
    chainId ? basicTokenMap[chainId].address : undefined,
    getAppKitAccountByChainId(chainId)?.appKitAccount.address,
  );

  return useQuery({
    ...query,
    queryKey: [...query.queryKey, blockNumber],
  });
}
