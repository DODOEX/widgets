import { useWallet } from '@solana/wallet-adapter-react';
import { useUserOptions } from '../../components/UserOptionsProvider';

export function useSolanaWallet() {
  const { solanaWallet } = useUserOptions();
  const solanaWalletLocal = useWallet();
  return solanaWallet ?? solanaWalletLocal;
}
