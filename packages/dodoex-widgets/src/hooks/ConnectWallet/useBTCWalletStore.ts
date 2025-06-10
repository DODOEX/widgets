import { useUserOptions } from '../../components/UserOptionsProvider';

export function useBTCWalletStore() {
  const { btcWalletStore: userBTCWalletStore } = useUserOptions();

  return userBTCWalletStore;
}

// import { useReactWalletStore } from '@dodoex/btc-connect-react';
// import { useUserOptions } from '../../components/UserOptionsProvider';

// export function useBTCWalletStore() {
//   const { btcWalletStore: userBTCWalletStore } = useUserOptions();

//   const btcWalletStore = useReactWalletStore((state) => state);

//   if (userBTCWalletStore) {
//     return userBTCWalletStore;
//   }

//   return btcWalletStore;
// }
