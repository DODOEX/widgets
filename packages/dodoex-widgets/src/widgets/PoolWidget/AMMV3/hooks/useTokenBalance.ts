import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useSolanaConnection } from '../../../../hooks/solana/useSolanaConnection';

export function useTokenBalance({
  mint,
}: {
  mint: string | PublicKey | undefined;
}) {
  const { fetchTokenBalance } = useSolanaConnection();

  const tokenBalanceQuery = useQuery({
    queryKey: ['token', 'balance', mint?.toString()],
    queryFn: async () => {
      if (!mint) {
        return undefined;
      }
      const result = await fetchTokenBalance(mint.toString());
      return result.amount;
    },
    enabled: !!mint,
  });

  return tokenBalanceQuery.data;
}
