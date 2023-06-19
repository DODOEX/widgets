export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,

  BSC = 56,

  POLYGON = 137,

  ARBITRUM_ONE = 42161,

  AURORA = 1313161554,

  OKCHAIN = 66,

  OPTIMISM = 10,

  AVALANCHE = 43114,

  CONFLUX = 1030,
}

export const rpcServerMap = {
  [ChainId.MAINNET]: [
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
    'https://eth-rpc.gateway.pokt.network',
    'https://main-rpc.linkpool.io',
  ],
  [ChainId.GOERLI]: ['https://goerli.optimism.io/'],
  [ChainId.BSC]: [
    'https://bsc-dataseed1.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed4.binance.org',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed2.defibit.io',
    'https://bsc-dataseed3.defibit.io',
    'https://bsc-dataseed4.defibit.io',
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed2.ninicoin.io',
    'https://bsc-dataseed3.ninicoin.io',
    'https://bsc-dataseed4.ninicoin.io',
    'https://bsc-dataseed.binance.org',
    'https://rpc.ankr.com/bsc',
    'https://bscrpc.com',
    'https://bsc.mytokenpocket.vip',
    'https://binance.nodereal.io',
    'https://rpc-bsc.bnb48.club',
  ],
  [ChainId.POLYGON]: [
    'https://polygon-rpc.com',
    'https://rpc-mainnet.matic.network',
    'https://matic-mainnet.chainstacklabs.com',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://matic-mainnet-full-rpc.bwarelabs.com',
    'https://matic-mainnet-archive-rpc.bwarelabs.com',
    'https://poly-rpc.gateway.pokt.network',
    'https://rpc.ankr.com/polygon',
    'https://polygon-mainnet.public.blastapi.io',
  ],
  [ChainId.ARBITRUM_ONE]: [
    'https://arb1.arbitrum.io/rpc',
    'https://rpc.ankr.com/arbitrum',
  ],
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
  [ChainId.CONFLUX]: [
    'https://evm.confluxrpc.com',
    'https://conflux-espace-public.unifra.io',
  ],
};

const DEFAULT_BASIC_TOKEN = {
  symbol: 'ETH',
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  name: 'Ether',
  decimals: 18,
  showDecimals: 4,
  wrappedTokenSymbol: 'WETH',
};
export const basicTokenMap = {
  [ChainId.MAINNET]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  [ChainId.GOERLI]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  },
  [ChainId.OPTIMISM]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0x4200000000000000000000000000000000000006',
  },
  [ChainId.CONFLUX]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'CFX',
    name: 'CFX',
    wrappedTokenSymbol: 'WCFX',
    wrappedTokenAddress: '0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b',
  },
  [ChainId.BSC]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'BNB',
    name: 'BNB',
    wrappedTokenSymbol: 'WBNB',
    wrappedTokenAddress: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  },
  [ChainId.OKCHAIN]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'OKT',
    name: 'OKT',
    wrappedTokenSymbol: 'WOKT',
    wrappedTokenAddress: '0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15',
  },
  [ChainId.POLYGON]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'MATIC',
    name: 'MATIC',
    showDecimals: 6,
    wrappedTokenSymbol: 'WMATIC',
    wrappedTokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  [ChainId.ARBITRUM_ONE]: {
    ...DEFAULT_BASIC_TOKEN,
    name: 'Ethereum',
    showDecimals: 6,
    wrappedTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  [ChainId.AURORA]: {
    ...DEFAULT_BASIC_TOKEN,
    name: 'Ethereum',
    showDecimals: 6,
    wrappedTokenAddress: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
  },
  [ChainId.AVALANCHE]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'AVAX',
    name: 'Avalanche',
    showDecimals: 6,
    wrappedTokenSymbol: 'WAVAX',
    wrappedTokenAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  },
};

export const platformIdMap = {
  [ChainId.MAINNET]: 'ethereum',
  [ChainId.GOERLI]: 'goerli',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.CONFLUX]: 'cfx',
  [ChainId.BSC]: 'bsc',
  [ChainId.OKCHAIN]: 'okex-chain',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.AURORA]: 'aurora',
  [ChainId.AVALANCHE]: 'avalanche', // Needs confirm
};

export const scanUrlDomainMap = {
  [ChainId.MAINNET]: 'etherscan.io',
  [ChainId.GOERLI]: 'goerli.etherscan.io',
  [ChainId.OPTIMISM]: 'optimistic.etherscan.io',
  [ChainId.CONFLUX]: 'snowtrace.io',
  [ChainId.BSC]: 'bscscan.com',
  [ChainId.OKCHAIN]: 'www.oklink.com/okexchain',
  [ChainId.POLYGON]: 'polygonscan.com',
  [ChainId.ARBITRUM_ONE]: 'arbiscan.io',
  [ChainId.AURORA]: 'aurorascan.dev',
  [ChainId.AVALANCHE]: 'snowtrace.io',
};
