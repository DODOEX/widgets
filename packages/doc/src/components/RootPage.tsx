import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../configure-store';
import { WithMuiTheme } from './theme/WithMuiTheme';

import { ChainId, zetachainTestnet } from '@dodoex/api';
import { Widget } from '@dodoex/widgets';
// import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import {
  SolanaAdapter,
  useAppKitConnection,
} from '@reown/appkit-adapter-solana/react';
import {
  arbitrumSepolia,
  base,
  bsc,
  mainnet,
  polygon,
  sepolia,
  solana,
  solanaDevnet,
  zetachain,
} from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';

import { Network, WalletConnectReact } from '@dodoex/btc-connect-react';
import '@dodoex/btc-connect-react/dist/style/index.css';

// 1. Get projectId
const projectId = 'bc32cb5c4e5f0d1d9a3313ae139b30e9';

// 2. Create a metadata object - optional
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};

// 0. Set up Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [],
});

// 3. Set up Bitcoin Adapter
// const bitcoinAdapter = new BitcoinAdapter({
//   projectId,
//   networks: [bitcoin, btcSignet],
// });

// 3. Create the AppKit instance
createAppKit({
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#154618',
    '--w3m-accent': '#154618',
    '--w3m-border-radius-master': '2px',
    '--w3m-z-index': 1300,
  },
  // adapters: [new Ethers5Adapter(), solanaWeb3JsAdapter, bitcoinAdapter],
  adapters: [new Ethers5Adapter(), solanaWeb3JsAdapter],
  metadata: metadata,
  networks: [
    zetachainTestnet,
    mainnet,
    sepolia,
    arbitrumSepolia,
    polygon,
    bsc,
    zetachain,
    base,

    solana,
    solanaDevnet,
    // bitcoin,
    // btcSignet,
  ],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function RootPage({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { connection: solanaConnection } = useAppKitConnection();

  const isSwap =
    title === 'Widgets/SwapAndOrderList' || title === 'Widgets/Swap';

  return (
    <ReduxProvider store={store}>
      <WithMuiTheme>
        <WalletConnectReact
          config={{
            network: Network.TESTNET, // or 'testnet'
          }}
          ui={{
            modalZIndex: 1300,
          }}
          onConnectSuccess={(btcWallet) => {
            // Handle successful connection
            console.log('btcWallet', btcWallet, btcWallet.balance);
          }}
          theme="light"
          onConnectError={(error) => {
            // Handle connection error
          }}
          onDisconnectSuccess={() => {
            // Handle successful disconnection
          }}
          onDisconnectError={(error) => {
            // Handle disconnection error
          }}
        />

        <Widget
          apikey="ee53d6b75b12aceed4"
          GRAPHQL_URL={
            process.env.STORYBOOK_GRAPHQL_URL ??
            'https://api.dodoex.io/frontend-graphql'
          }
          colorMode="light"
          defaultChainId={ChainId.ZETACHAIN}
          onlyChainId={isSwap ? undefined : ChainId.ZETACHAIN}
          solanaConnection={solanaConnection}
          noUI
          crossChain={isSwap}
          noDocumentLink={true}
          routerPage={undefined}
          supportAMMV2
          supportAMMV3
          notSupportPMM={false}
        >
          {children}
        </Widget>
      </WithMuiTheme>
    </ReduxProvider>
  );
}
