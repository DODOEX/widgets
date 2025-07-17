import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../configure-store';
import { WithMuiTheme } from './theme/WithMuiTheme';

import { ChainId, zetachainTestnet } from '@dodoex/api';
import { PageType, Widget } from '@dodoex/widgets';
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
    connectorTypeOrder: [
      'featured',
      'recent',
      'injected',
      'walletConnect',
      'custom',
      'external',
      'recommended',
    ],
  },
  featuredWalletIds: [
    '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
  ],
  includeWalletIds: [
    '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
    '18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1',
    '6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb',
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
    '2a3c89040ac3b723a1972a33a125b1db11e258a6975d3a61252cd64e6ea5ea01',
    '20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66',
    '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4',

    // bitcoin
    'f896cbca30cd6dc414712d3d6fcc2f8f7d35d5bd30e3b1fc5d60cf6c8926f98f',

    // solana
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
    '2bd8c14e035c2d48f184aaa168559e86b0e3433228d3c4075900a221785019b0',
  ],
  enableWalletGuide: false,
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
          defaultChainId={ChainId.ZETACHAIN_TESTNET}
          onlyChainId={isSwap ? undefined : ChainId.ZETACHAIN_TESTNET}
          solanaConnection={solanaConnection}
          noUI
          crossChain={isSwap}
          noDocumentLink={true}
          supportAMMV2
          supportAMMV3
          notSupportPMM={false}
          supportCurve
          routerPage={{
            type: PageType.CurvePoolDetail,
            params: {
              address: '0xDddfBCc76166d741c2dfa6b6a90769df398b9969',
              chainId: ChainId.ZETACHAIN_TESTNET,
            },
          }}
        >
          {children}
        </Widget>
      </WithMuiTheme>
    </ReduxProvider>
  );
}
