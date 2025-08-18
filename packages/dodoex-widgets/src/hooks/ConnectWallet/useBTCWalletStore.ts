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

//   return {
//     ...btcWalletStore,
//     address: 'bc1qp3gvgma5jy3xyc70d7r0sm92g4vt08tlj64nvk',
//     btcWallet: {
//       ...btcWalletStore.btcWallet,
//       address: 'bc1qp3gvgma5jy3xyc70d7r0sm92g4vt08tlj64nvk',
//     },
//   };

//   return btcWalletStore;
// }
