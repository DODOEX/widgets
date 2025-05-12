import { ChainId } from '@dodoex/api';
export { etherTokenAddress, basicTokenMap } from '@dodoex/api';

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
  [ChainId.NEROCHAIN]: ['https://rpc.nerochain.io'],
  [ChainId.BITLAYER]: ['https://rpc.bitlayer.org'],
  [ChainId.ZIRCUIT]: ['https://zircuit1-mainnet.liquify.com'],
  [ChainId.X_LAYER]: ['https://rpc.xlayer.tech'],
  [ChainId.ZERO]: ['https://zero-network.calderachain.xyz/http'],
  [ChainId.HASHKEY]: ['https://mainnet.hsk.xyz'],
  [ChainId.HEMI]: ['https://rpc.hemi.network/rpc'],
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
  [ChainId.NEROCHAIN]: 'www.neroscan.io',
  [ChainId.BITLAYER]: 'www.btrscan.com',
  [ChainId.ZIRCUIT]: 'explorer.zircuit.com',
  [ChainId.X_LAYER]: 'www.okx.com/web3/explorer/xlayer',
  [ChainId.ZERO]: 'zerion-explorer.vercel.app',
  [ChainId.HASHKEY]: 'explorer.hsk.xyz',
  [ChainId.HEMI]: 'explorer.hemi.xyz',
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
  [ChainId.NEROCHAIN]: 'nero',
  [ChainId.BITLAYER]: 'btr',
  [ChainId.ZIRCUIT]: 'zircuit-mainnet',
  [ChainId.X_LAYER]: 'okb',
  [ChainId.ZERO]: 'zero-mainnet',
  [ChainId.HASHKEY]: 'hashkey',
  [ChainId.HEMI]: 'hemi',
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
  [ChainId.NEROCHAIN]: 3000,
  [ChainId.BITLAYER]: 3000,
  [ChainId.ZIRCUIT]: 2000,
  [ChainId.X_LAYER]: 3000,
  [ChainId.ZERO]: 3000,
  [ChainId.HASHKEY]: 2000,
  [ChainId.HEMI]: 12000,
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
  [ChainId.NEROCHAIN]: [],
  [ChainId.BITLAYER]: [],
  [ChainId.ZIRCUIT]: [],
  [ChainId.X_LAYER]: [],
  [ChainId.ZERO]: [],
  [ChainId.HASHKEY]: [],
  [ChainId.HEMI]: [],
};
