import { useWalletInfo } from './useWalletInfo';

export function useCurrentChainId() {
  const { chainId } = useWalletInfo();
  return chainId;
}
