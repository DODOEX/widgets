import { ChainId } from '@dodoex/api';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useSolanaConnection } from '../../../../hooks/solana/useSolanaConnection';

export function useTokenInfo({
  mint,
  chainId,
  symbol,
}: {
  mint: string | PublicKey | undefined;
  chainId: ChainId;
  symbol?: string;
}) {
  const { fetchTokenInfo } = useSolanaConnection();

  const tokenInfoQuery = useQuery({
    queryKey: ['token', 'info', chainId, mint],
    queryFn: async () => {
      const result = await fetchTokenInfo({
        mint,
        chainId,
        symbol,
      });
      return result;
    },
    enabled: !!mint,
  });

  return tokenInfoQuery.data;
}
