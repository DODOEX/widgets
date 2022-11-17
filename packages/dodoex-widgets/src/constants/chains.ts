export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
  GOERLI = 5,

  BSC = 56,

  HECO = 128,

  POLYGON = 137,

  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,

  AURORA = 1313161554,

  MOONRIVER = 1285,

  OKCHAIN = 66,

  OPTIMISM = 10,

  BOBA = 288,

  AVALANCHE = 43114,

  CRONOS = 25,
}

export const rpcServerMap = {
  [ChainId.MAINNET]: [
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
    'https://eth-rpc.gateway.pokt.network',
    'https://main-rpc.linkpool.io',
  ],
  [ChainId.RINKEBY]: ['https://rinkeby-light.eth.linkpool.io/'],
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
  [ChainId.HECO]: [
    'https://http-mainnet.hecochain.com',
    'https://pub001.hg.network/rpc',
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
  [ChainId.ARBITRUM_RINKEBY]: ['https://rinkeby.arbitrum.io/rpc'],
  [ChainId.AURORA]: ['https://mainnet.aurora.dev/'],
  [ChainId.MOONRIVER]: [
    'https://rpc.api.moonriver.moonbeam.network',
    'https://moonriver.api.onfinality.io/rpc?apikey=673e1fae-c9c9-4c7f-a3d5-2121e8274366',
    'https://moonriver.api.onfinality.io/public',
    'https://moonriver.public.blastapi.io',
  ],
  [ChainId.OKCHAIN]: [
    'https://exchainrpc.okex.org',
    'https://okc-mainnet.gateway.pokt.network/v1/lb/6275309bea1b320039c893ff',
  ],
  [ChainId.OPTIMISM]: [
    'https://mainnet.optimism.io',
    'https://optimism-mainnet.public.blastapi.io',
  ],
  [ChainId.BOBA]: [
    'https://mainnet.boba.network',
    'https://boba-mainnet.gateway.pokt.network/v1/lb/623ad21b20354900396fed7f',
    'https://lightning-replica.boba.network',
  ],
  [ChainId.AVALANCHE]: [
    'https://api.avax.network/ext/bc/C/rpc',
    'https://rpc.ankr.com/avalanche',
    'https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc',
  ],
  [ChainId.CRONOS]: [
    'https://evm.cronos.org',
    'https://cronos-rpc.heavenswail.one',
    'https://evm-cronos.crypto.org',
    'https://cronosrpc-1.xstaking.sg',
    'https://cronos-rpc.elk.finance',
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
  [ChainId.RINKEBY]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xB26c0d8Be2960c70641A95A9195BE1f59Ac83aC0',
  },
  [ChainId.GOERLI]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  },
  [ChainId.OPTIMISM]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0x4200000000000000000000000000000000000006',
  },
  [ChainId.CRONOS]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'CRO',
    name: 'Cronos',
    wrappedTokenSymbol: 'WCRO',
    wrappedTokenAddress: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
  },
  [ChainId.BOBA]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
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
  [ChainId.HECO]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'HT',
    name: 'HT',
    showDecimals: 6,
    wrappedTokenSymbol: 'WHT',
    wrappedTokenAddress: '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f',
  },
  [ChainId.POLYGON]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'MATIC',
    name: 'MATIC',
    showDecimals: 6,
    wrappedTokenSymbol: 'WMATIC',
    wrappedTokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  [ChainId.MOONRIVER]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'MOVR',
    name: 'MOVR',
    showDecimals: 6,
    wrappedTokenSymbol: 'WMOVR',
    wrappedTokenAddress: '0x98878b06940ae243284ca214f92bb71a2b032b8a',
  },
  [ChainId.ARBITRUM_ONE]: {
    ...DEFAULT_BASIC_TOKEN,
    name: 'Ethereum',
    showDecimals: 6,
    wrappedTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  [ChainId.ARBITRUM_RINKEBY]: {
    ...DEFAULT_BASIC_TOKEN,
    name: 'Ether',
    showDecimals: 6,
    wrappedTokenAddress: '0xEBbc3452Cc911591e4F18f3b36727Df45d6bd1f9',
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
  [ChainId.RINKEBY]: 'rinkeby',
  [ChainId.GOERLI]: 'goerli',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.CRONOS]: 'cronos',
  [ChainId.BOBA]: 'boba',
  [ChainId.BSC]: 'bsc',
  [ChainId.OKCHAIN]: 'okex-chain',
  [ChainId.HECO]: 'heco',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.MOONRIVER]: 'moonriver',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ARBITRUM_RINKEBY]: 'arb-rinkeby',
  [ChainId.AURORA]: 'aurora',
  [ChainId.AVALANCHE]: 'avalanche', // Needs confirm
};

export const scanUrlDomainMap = {
  [ChainId.MAINNET]: 'etherscan.io',
  [ChainId.RINKEBY]: 'rinkeby.etherscan.io',
  [ChainId.GOERLI]: 'goerli.etherscan.io',
  [ChainId.OPTIMISM]: 'optimistic.etherscan.io',
  [ChainId.CRONOS]: 'cronoscan.com',
  [ChainId.BOBA]: 'blockexplorer.boba.network',
  [ChainId.BSC]: 'bscscan.com',
  [ChainId.OKCHAIN]: 'www.oklink.com/okexchain',
  [ChainId.HECO]: 'hecoinfo.com',
  [ChainId.POLYGON]: 'polygonscan.com',
  [ChainId.MOONRIVER]: 'moonriver.moonscan.io',
  [ChainId.ARBITRUM_ONE]: 'arbiscan.io',
  [ChainId.ARBITRUM_RINKEBY]: 'testnet.arbiscan.io',
  [ChainId.AURORA]: 'aurorascan.dev',
  [ChainId.AVALANCHE]: 'snowtrace.io',
};
