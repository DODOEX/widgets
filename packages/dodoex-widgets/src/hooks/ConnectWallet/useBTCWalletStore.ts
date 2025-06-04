import { useUserOptions } from '../../components/UserOptionsProvider';

export function useBTCWalletStore() {
  const { btcWalletStore: userBTCWalletStore } = useUserOptions();

  return userBTCWalletStore;
}
