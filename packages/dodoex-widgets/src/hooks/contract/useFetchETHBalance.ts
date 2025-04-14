import { basicTokenMap } from '../../constants/chains';
import { ChainId } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { tokenApi } from '../../constants/api';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useGlobalState } from '../useGlobalState';

export default function useFetchETHBalance(chainId?: number) {
  const { account, chainId: currentChainId } = useWalletInfo();
  const { latestBlockNumber: blockNumber } = useGlobalState();
  const EtherToken = basicTokenMap[(chainId ?? currentChainId) as ChainId];
  const query = tokenApi.getFetchTokenQuery(
    chainId,
    EtherToken?.address,
    account,
  );
  return useQuery({
    ...query,
    queryKey: [...query.queryKey, blockNumber],
  });
}
