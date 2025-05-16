import { ChainId } from '@dodoex/api';
import { SwapWidget } from '@dodoex/widgets';
import { TokenInfo } from '@dodoex/widgets/dist/src/hooks/Token/type';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import {
  base,
  bitcoin,
  bitcoinTestnet,
  bsc,
  defineChain,
  mainnet,
  polygon,
  sepolia,
  solana,
  solanaDevnet,
  zetachain,
} from '@reown/appkit/networks';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
} from '@reown/appkit/react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

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
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

// 3. Set up Bitcoin Adapter
const bitcoinAdapter = new BitcoinAdapter({
  projectId,
});

export const zetachainTestnet = defineChain({
  id: 7001,
  name: 'ZetaChain testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tZETA',
    symbol: 'tZETA',
  },
  rpcUrls: {
    default: {
      http: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public'],
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 2715217,
    },
  },
  blockExplorers: {
    default: {
      name: 'ZetaScan',
      url: 'https://zetachain-testnet.blockscout.com',
    },
  },
  testnet: true,
  chainNamespace: 'eip155',
  caipNetworkId: 'eip155:7001',
});

// 3. Create the AppKit instance
createAppKit({
  adapters: [new Ethers5Adapter(), solanaWeb3JsAdapter, bitcoinAdapter],
  metadata: metadata,
  networks: [
    zetachainTestnet,
    mainnet,
    sepolia,
    polygon,
    bsc,
    zetachain,
    base,
    solana,
    solanaDevnet,
    bitcoin,
    bitcoinTestnet,
  ],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Widgets/Swap',
  component: 'div',
};

export const Primary = (args) => {
  const { open } = useAppKit();
  const { account } = useAppKitAccount({
    namespace: 'eip155',
  });
  const { walletProvider: ethersProvider } = useAppKitProvider('eip155');

  return <SwapWidget {...args} provider={ethersProvider} />;
};

Primary.args = {
  apikey: 'ef9apopzq9qrgntjubojbxe7hy4z5eez',
  colorMode: 'dark',
  noUI: true,
  defaultChainId: ChainId.ZETACHAIN_TESTNET,
  crossChain: true,
  getAutoSlippage: ({
    fromToken,
    toToken,
  }: {
    fromToken: TokenInfo | null;
    toToken: TokenInfo | null;
  }) => {
    if (!fromToken || !toToken || fromToken.chainId !== toToken.chainId) {
      return undefined;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(0.9);
      }, 1000);
    });
  },
};
