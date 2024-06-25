import { useSelector } from 'react-redux';
import { getLatestBlockNumber } from '../../store/selectors/wallet';
import { basicTokenMap } from '../../constants/chains';
import { ChainId } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { tokenApi } from '../../constants/api';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';

export default function useFetchETHBalance(chainId?: number) {
  const { account, chainId: currentChainId } = useWalletInfo();
  const blockNumber = useSelector(getLatestBlockNumber);
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
