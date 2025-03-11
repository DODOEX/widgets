import { useQuery } from '@tanstack/react-query';
import { basicTokenMap } from '../../constants/chains';
import { BIG_ALLOWANCE } from '../../constants/token';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useSolanaConnection } from '../solana/useSolanaConnection';

export default function useFetchETHBalance(chainId?: number) {
  const { account } = useWalletInfo();

  const { fetchSOLBalance } = useSolanaConnection();
  const svmQuery = useQuery({
    queryKey: [
      'token',
      'getFetchTokenQuery',
      chainId,
      account?.toLocaleLowerCase(),
      undefined,
      'basicToken',
    ],
    queryFn: async () => {
      const result = await fetchSOLBalance();
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
