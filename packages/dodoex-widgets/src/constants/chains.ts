import { ChainId } from '@dodoex/api';
import { clusterApiUrl } from '@solana/web3.js';

export { basicTokenMap, etherTokenAddress } from '@dodoex/api';

export const rpcServerMap: {
  [key in ChainId]: Array<string>;
} = {
  [ChainId.MAINNET]: [
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
    'https://eth-rpc.gateway.pokt.network',
    'https://main-rpc.linkpool.io',
  ],
  [ChainId.GOERLI]: ['https://gateway.tenderly.co/public/goerli'],
  [ChainId.BSC]: [
    'https://bsc-dataseed1.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
  ],
  [ChainId.POLYGON]: [
    'https://polygon-rpc.com',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://poly-rpc.gateway.pokt.network',
    'https://rpc.ankr.com/polygon',
  ],
  [ChainId.ARBITRUM_ONE]: [
    'https://arb1.arbitrum.io/rpc',
    'https://rpc.ankr.com/arbitrum',
  ],
  [ChainId.ARBITRUM_SEPOLIA]: ['https://sepolia-rollup.arbitrum.io/rpc'],
  [ChainId.AURORA]: ['https://mainnet.aurora.dev/'],
  [ChainId.OKCHAIN]: [
    'https://exchainrpc.okex.org',
    'https://okc-mainnet.gateway.pokt.network/v1/lb/6275309bea1b320039c893ff',
  ],
  [ChainId.OPTIMISM]: [
    'https://mainnet.optimism.io',
    'https://optimism-mainnet.public.blastapi.io',
  ],
  [ChainId.AVALANCHE]: [
    'https://api.avax.network/ext/bc/C/rpc',
    'https://rpc.ankr.com/avalanche',
    'https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc',
  ],
  [ChainId.CONFLUX]: ['https://evm.confluxrpc.com'],
  [ChainId.BASE]: ['https://mainnet.base.org'],
  [ChainId.LINEA]: ['https://rpc.linea.build'],
  [ChainId.SCROLL]: ['https://rpc.scroll.io'],
  [ChainId.MANTA]: ['https://pacific-rpc.manta.network/http'],
  [ChainId.MANTLE]: ['https://rpc.mantle.xyz'],
  [ChainId.SEPOLIA]: ['https://ethereum-sepolia-rpc.publicnode.com'],
  [ChainId.DODO_CHAIN_TESTNET]: ['https://dodochain-testnet.alt.technology'],
  [ChainId.TAIKO]: ['https://rpc.mainnet.taiko.xyz'],
  [ChainId.PLUME]: ['https://phoenix-rpc.plumenetwork.xyz'],
  [ChainId.PLUME_TESTNET]: ['https://test-rpc.plumenetwork.xyz'],
  [ChainId.NEOX]: ['https://mainnet-1.rpc.banelabs.org'],
  [ChainId.MORPH]: ['https://rpc.morphl2.io'],
  [ChainId.RISE_TESTNET]: ['https://testnet.riselabs.xyz'],
  [ChainId.ZETACHAIN]: ['https://zetachain-evm.blockpi.network/v1/rpc/public'],
  [ChainId.ZETACHAIN_TESTNET]: [
    'https://zetachain-athens-evm.blockpi.network/v1/rpc/public',
  ],
  [ChainId.SOLANA]: [clusterApiUrl('mainnet-beta')],
  [ChainId.SOLANA_DEVNET]: [clusterApiUrl('devnet')],
  [ChainId.BTC]: ['https://rpc.walletconnect.org/v1'],
  [ChainId.BTC_SIGNET]: ['https://rpc.walletconnect.org/v1'],
};
export const getRpcSingleUrlMap = (newRpcServerMap?: {
  [chainId: number]: string[];
}) => {
  const result = {} as {
    [key in ChainId]?: string;
  };
  Object.entries(rpcServerMap).forEach(([key, urls]) => {
    const chainId = Number(key) as ChainId;
    const urlsResult = newRpcServerMap?.[chainId] || urls;
    const [url] = urlsResult;
    if (url) {
      result[chainId] = url;
    }
  });
  return result as {
    [key in ChainId]: string;
  };
};

export const scanUrlDomainMap: {
  [key in ChainId]: string;
} = {
  [ChainId.MAINNET]: 'etherscan.io',
  [ChainId.GOERLI]: 'goerli.etherscan.io',
  [ChainId.OPTIMISM]: 'optimistic.etherscan.io',
  [ChainId.CONFLUX]: 'snowtrace.io',
  [ChainId.BSC]: 'bscscan.com',
  [ChainId.OKCHAIN]: 'www.oklink.com/okexchain',
  [ChainId.POLYGON]: 'polygonscan.com',
  [ChainId.ARBITRUM_ONE]: 'arbiscan.io',
  [ChainId.ARBITRUM_SEPOLIA]: 'sepolia.arbiscan.io',
  [ChainId.AURORA]: 'aurorascan.dev',
  [ChainId.AVALANCHE]: 'snowtrace.io',
  [ChainId.BASE]: 'basescan.org',
  [ChainId.LINEA]: 'lineascan.build',
  [ChainId.SCROLL]: 'scrollscan.com',
  [ChainId.MANTA]: 'pacific-explorer.manta.network',
  [ChainId.MANTLE]: 'explorer.mantle.xyz',
  [ChainId.SEPOLIA]: 'sepolia.etherscan.io',
  [ChainId.DODO_CHAIN_TESTNET]: 'dodochain-testnet-explorer.alt.technology',
  [ChainId.TAIKO]: 'taikoscan.io',
  [ChainId.PLUME]: 'phoenix-explorer.plumenetwork.xyz',
  [ChainId.PLUME_TESTNET]: 'test-explorer.plumenetwork.xyz',
  [ChainId.NEOX]: 'xexplorer.neo.org',
  [ChainId.MORPH]: 'explorer.morphl2.io',
  [ChainId.RISE_TESTNET]: 'explorer.testnet.riselabs.xyz',
  [ChainId.ZETACHAIN]: 'zetachain.blockscout.com',
  [ChainId.ZETACHAIN_TESTNET]: 'zetachain-testnet.blockscout.com',
  [ChainId.SOLANA]: 'solscan.io',
  [ChainId.SOLANA_DEVNET]: 'solscan.io',
  [ChainId.BTC]: 'mempool.space',
  [ChainId.BTC_SIGNET]: 'mempool.space/signet',
};

export const ThegraphKeyMap: {
  [key in ChainId]: string;
} = {
  [ChainId.BSC]: 'bsc',
  [ChainId.MAINNET]: 'ethereum-mainnet',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ARBITRUM_SEPOLIA]: 'arb-sep',
  [ChainId.OKCHAIN]: 'okchain',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.AURORA]: 'aurora',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.GOERLI]: 'gor',
  [ChainId.CONFLUX]: 'cfx',
  [ChainId.BASE]: 'base',
  [ChainId.LINEA]: 'linea',
  [ChainId.SCROLL]: 'scr',
  [ChainId.MANTA]: 'manta',
  [ChainId.MANTLE]: 'mantle',
  [ChainId.SEPOLIA]: 'sepolia',
  [ChainId.DODO_CHAIN_TESTNET]: 'dodochain-testnet',
  [ChainId.TAIKO]: 'taiko',
  [ChainId.PLUME]: 'plume',
  [ChainId.PLUME_TESTNET]: 'plume-testnet',
  [ChainId.NEOX]: 'neox',
  [ChainId.MORPH]: 'morph',
  [ChainId.RISE_TESTNET]: 'rise-testnet',
  [ChainId.ZETACHAIN]: 'zetachain',
  [ChainId.ZETACHAIN_TESTNET]: 'zetachain-testnet',
  [ChainId.SOLANA]: 'solana',
  [ChainId.SOLANA_DEVNET]: 'solana-devnet',
  [ChainId.BTC]: 'btc',
  [ChainId.BTC_SIGNET]: 'btc-signet',
};

export const blockTimeMap: {
  [key in ChainId]: number;
} = {
  [ChainId.MAINNET]: 12000,
  [ChainId.GOERLI]: 12000,
  [ChainId.OPTIMISM]: 12000,
  [ChainId.CONFLUX]: 3000,
  [ChainId.BSC]: 3000,
  [ChainId.OKCHAIN]: 4000,
  [ChainId.POLYGON]: 2200,
  [ChainId.ARBITRUM_ONE]: 12000,
  [ChainId.ARBITRUM_SEPOLIA]: 12000,
  [ChainId.AURORA]: 1000,
  [ChainId.AVALANCHE]: 1000,
  [ChainId.BASE]: 2000,
  [ChainId.LINEA]: 2000,
  [ChainId.SCROLL]: 3000,
  [ChainId.MANTA]: 10000,
  [ChainId.MANTLE]: 2000,
  [ChainId.SEPOLIA]: 12000,
  [ChainId.DODO_CHAIN_TESTNET]: 12000,
  [ChainId.TAIKO]: 48000,
  [ChainId.PLUME]: 12000,
  [ChainId.PLUME_TESTNET]: 2600,
  [ChainId.NEOX]: 12000,
  [ChainId.MORPH]: 3200,
  [ChainId.RISE_TESTNET]: 0,
  [ChainId.ZETACHAIN]: 6000,
  [ChainId.ZETACHAIN_TESTNET]: 6000,
  [ChainId.SOLANA]: 1000,
  [ChainId.SOLANA_DEVNET]: 1000,
  [ChainId.BTC]: 1000,
  [ChainId.BTC_SIGNET]: 1000,
};

export const dexKeysMap: {
  [key in ChainId]: string[];
} = {
  [ChainId.MAINNET]: [],
  [ChainId.GOERLI]: [],
  [ChainId.OPTIMISM]: [],
  [ChainId.CONFLUX]: [],
  [ChainId.BSC]: [],
  [ChainId.OKCHAIN]: [],
  [ChainId.POLYGON]: [],
  [ChainId.ARBITRUM_ONE]: [],
  [ChainId.ARBITRUM_SEPOLIA]: [],
  [ChainId.AURORA]: [],
  [ChainId.AVALANCHE]: [],
  [ChainId.BASE]: [],
  [ChainId.LINEA]: [],
  [ChainId.SCROLL]: [],
  [ChainId.MANTA]: [],
  [ChainId.MANTLE]: [],
  [ChainId.SEPOLIA]: [],
  [ChainId.DODO_CHAIN_TESTNET]: [],
  [ChainId.TAIKO]: [],
  [ChainId.PLUME]: [],
  [ChainId.PLUME_TESTNET]: [],
  [ChainId.NEOX]: [],
  [ChainId.MORPH]: [],
  [ChainId.RISE_TESTNET]: [],
  [ChainId.ZETACHAIN]: [],
  [ChainId.ZETACHAIN_TESTNET]: [],
  [ChainId.SOLANA]: [],
  [ChainId.SOLANA_DEVNET]: [],
  [ChainId.BTC]: [],
  [ChainId.BTC_SIGNET]: [],
};

export interface PrivacySwapSupplierEndpointI {
  key: string;
  name: string;
  logo: string;
  docUrl: string;
  /** 添加链的配置 */
  addChainParameters: AddChainParameter;
  /** 是否在该节点的检查方法 */
  isPrivacyEndpoint: {
    contract: string;
    rpcMethod: string;
  } | null;
}

const falshbots = {
  key: 'Flashbots',
  name: 'Flashbots',
  logo: 'https://docs.flashbots.net/img/logo.png',
  docUrl: 'https://docs.flashbots.net/new-to-mev',
  addChainParameters: {
    chainId: '0x1',
    chainName: 'Flashbots Protect',
    rpcUrls: ['https://rpc.flashbots.net/fast'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  isPrivacyEndpoint: {
    // FlashbotsRPC https://etherscan.io/address/0xf1a54b0759b58661cea17cff19dd37940a9b5f1a#code
    contract: '0xf1a54b0759b58661cEa17CfF19dd37940a9b5f1A',
    rpcMethod: 'isFlashRPC',
  },
};

const Blocknative = {
  key: 'Blocknative',
  name: 'Blocknative',
  logo: 'https://docs.blocknative.com/~gitbook/image?url=https%3A%2F%2F3295439492-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-LmQ_1MIOGRk17Wz50Bx%252Ficon%252Fi7MyzIYm9BywxU73iEwF%252FBlocknative-Favicon.png%3Falt%3Dmedia%26token%3Dcd2df16c-3180-4ed4-b5f3-f8be6bd13767&width=32&dpr=2&quality=100&sign=c6dab474&sv=2',
  docUrl: 'https://docs.blocknative.com/',
  addChainParameters: {
    chainId: '0x1',
    chainName: 'Blocknative',
    rpcUrls: ['https://rpc.blocknative.com/boost'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  isPrivacyEndpoint: {
    // https://etherscan.io/address/0x76838FdE3Aeb876dC10E6e3bB2a1757dEA58a25C#code
    contract: '0x76838FdE3Aeb876dC10E6e3bB2a1757dEA58a25C',
    rpcMethod: 'isBlocknativeRPC',
  },
};

export const privacySwapSupplierEndpointsMap: {
  [key in ChainId]: PrivacySwapSupplierEndpointI[];
} = {
  [ChainId.MAINNET]: [falshbots, Blocknative],
  [ChainId.GOERLI]: [],
  [ChainId.OPTIMISM]: [],
  [ChainId.CONFLUX]: [],
  [ChainId.BSC]: [],
  [ChainId.OKCHAIN]: [],
  [ChainId.POLYGON]: [],
  [ChainId.ARBITRUM_ONE]: [],
  [ChainId.ARBITRUM_SEPOLIA]: [],
  [ChainId.AURORA]: [],
  [ChainId.AVALANCHE]: [],
  [ChainId.BASE]: [],
  [ChainId.LINEA]: [],
  [ChainId.SCROLL]: [],
  [ChainId.MANTA]: [],
  [ChainId.MANTLE]: [],
  [ChainId.SEPOLIA]: [falshbots, Blocknative],
  [ChainId.DODO_CHAIN_TESTNET]: [],
  [ChainId.TAIKO]: [],
  [ChainId.PLUME]: [],
  [ChainId.PLUME_TESTNET]: [],
  [ChainId.NEOX]: [],
  [ChainId.MORPH]: [],
  [ChainId.RISE_TESTNET]: [],
  [ChainId.ZETACHAIN]: [],
  [ChainId.ZETACHAIN_TESTNET]: [],
  [ChainId.SOLANA]: [],
  [ChainId.SOLANA_DEVNET]: [],
  [ChainId.BTC]: [],
  [ChainId.BTC_SIGNET]: [],
};
