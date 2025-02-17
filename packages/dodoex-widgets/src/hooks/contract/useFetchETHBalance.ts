import { CONTRACT_QUERY_KEY } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { basicTokenMap } from '../../constants/chains';
import { BIG_ALLOWANCE } from '../../constants/token';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useSolanaConnection } from '../solana/useSolanaConnection';

export default function useFetchETHBalance(chainId?: number) {
  const { account } = useWalletInfo();

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
    enabled: !!account,
  });

  return svmQuery;
}
