import { ChainId } from '@dodoex/api';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useSolanaConnection } from '../../../../hooks/solana/useSolanaConnection';

export function useTokenBalance({
  mint,
  chainId,
}: {
  mint: string | PublicKey | undefined;
  chainId: ChainId;
}) {
  const { account } = useWalletInfo();
  const { fetchTokenBalance } = useSolanaConnection();

  const tokenBalanceQuery = useQuery({
    queryKey: ['token', 'balance', chainId, account, mint],
    queryFn: async () => {
      if (!mint) {
        return undefined;
      }
      const result = await fetchTokenBalance(mint.toString());
      return result.amount;
    },
    enabled: !!account && !!mint,
  });

  return tokenBalanceQuery.data;
}
