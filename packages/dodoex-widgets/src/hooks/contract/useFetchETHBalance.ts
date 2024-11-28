import { useSelector } from 'react-redux';
import { getLatestBlockNumber } from '../../store/selectors/wallet';
import { basicTokenMap } from '../../constants/chains';
import { ChainId, CONTRACT_QUERY_KEY } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { tokenApi } from '../../constants/api';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useSolanaConnection } from '../solana/useSolanaConnection';
import BigNumber from 'bignumber.js';
import { BIG_ALLOWANCE } from '../../constants/token';
import { byWei } from '../../utils';

export default function useFetchETHBalance(chainId?: number) {
  const { account, chainId: currentChainId, isSolana } = useWalletInfo();
  const blockNumber = useSelector(getLatestBlockNumber);
  const EtherToken = basicTokenMap[(chainId ?? currentChainId) as ChainId];
  const query = tokenApi.getFetchTokenQuery(
    isSolana ? undefined : chainId,
    EtherToken?.address,
    account,
  );
  const evmQuery = useQuery({
    ...query,
    queryKey: [...query.queryKey, blockNumber],
    enabled: !isSolana,
  });

  const { fetchETHBalance } = useSolanaConnection();
  const svmQuery = useQuery({
    queryKey: [
      CONTRACT_QUERY_KEY,
      'token',
      'getFetchTokenQuery',
      chainId,
      account?.toLocaleLowerCase(),
      undefined,
      'basicToken',
    ],
    queryFn: async () => {
      const result = await fetchETHBalance();
      return {
        ...basicTokenMap[1],
        balance: result.amount,
        allowance: BIG_ALLOWANCE,
      };
    },
    enabled: !!account && isSolana,
  });

  return isSolana ? svmQuery : evmQuery;
}
