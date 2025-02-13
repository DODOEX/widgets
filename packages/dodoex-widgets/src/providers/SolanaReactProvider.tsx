/** https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md */
import { ChainId } from '@dodoex/api';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { PropsWithChildren, useMemo } from 'react';
import { rpcServerMap } from '../constants/chains';

import '@solana/wallet-adapter-react-ui/styles.css';

export function SolanaReactProvider(props: PropsWithChildren) {
  const network = WalletAdapterNetwork.Testnet;

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint = rpcServerMap[ChainId.SOON_TESTNET][0];

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app's components go here, nested within the context providers. */}
          {props.children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
