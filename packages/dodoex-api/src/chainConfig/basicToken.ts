import { ChainId } from './chain';

export const etherTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

const DEFAULT_BASIC_TOKEN = {
  symbol: 'ETH',
  address: etherTokenAddress,
  name: 'Ether',
  decimals: 18,
  showDecimals: 4,
  wrappedTokenSymbol: 'WETH',
};
export const basicTokenMap: {
  [key in ChainId]: typeof DEFAULT_BASIC_TOKEN & {
    wrappedTokenAddress: string;
  };
} = {
  [ChainId.MAINNET]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  [ChainId.GOERLI]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  },
  [ChainId.SEPOLIA]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0x7B07164ecFaF0F0D85DFC062Bc205a4674c75Aa0',
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
  [ChainId.ARBITRUM_SEPOLIA]: {
    ...DEFAULT_BASIC_TOKEN,
    name: 'Ethereum',
    showDecimals: 6,
    wrappedTokenAddress: '0xfd6fFee92D25158b29315C71b0Bb4dE727530FaF',
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
  [ChainId.BASE]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenSymbol: 'WETH',
    wrappedTokenAddress: '0x4200000000000000000000000000000000000006',
  },
  [ChainId.LINEA]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenSymbol: 'WETH',
    wrappedTokenAddress: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
  },
  [ChainId.SCROLL]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenSymbol: 'WETH',
    wrappedTokenAddress: '0x5300000000000000000000000000000000000004',
  },
  [ChainId.MANTA]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenSymbol: 'WETH',
    wrappedTokenAddress: '0x0Dc808adcE2099A9F62AA87D9670745AbA741746',
  },
  [ChainId.MANTLE]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenSymbol: 'WMNT',
    wrappedTokenAddress: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
  },
  [ChainId.DODO_CHAIN_TESTNET]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'dodo',
    name: 'Wrapped Berd',
    wrappedTokenSymbol: 'WBERD',
    wrappedTokenAddress: '0x3a64Ec3606FF7310E8fAd6FcC008e39705fB496d',
  },
  [ChainId.TAIKO]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xA51894664A773981C6C112C43ce576f315d5b1B6',
  },
  [ChainId.PLUME]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'PLUME',
    name: 'PLUME',
    wrappedTokenSymbol: 'WPLUME',
    wrappedTokenAddress: '0xEa237441c92CAe6FC17Caaf9a7acB3f953be4bd1',
  },
  [ChainId.PLUME_TESTNET]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xaA6210015fbf0855F0D9fDA3C415c1B12776Ae74',
  },
  [ChainId.NEOX]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'GAS',
    name: 'GAS',
    showDecimals: 6,
    wrappedTokenSymbol: 'WGAS10',
    wrappedTokenAddress: '0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF',
  },
  [ChainId.MORPH]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0x5300000000000000000000000000000000000011',
  },
  [ChainId.RISE_TESTNET]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0x4200000000000000000000000000000000000006',
  },
  [ChainId.NEROCHAIN]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'NERO',
    name: 'NERO',
    wrappedTokenSymbol: 'WNERO',
    wrappedTokenAddress: '0x252ba4a6efb0d91bd7108d91a067c14592a56f17',
  },
  [ChainId.BITLAYER]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'BTC',
    name: 'BTC',
    wrappedTokenSymbol: 'WBTC',
    wrappedTokenAddress: '0xff204e2681a6fa0e2c3fade68a1b28fb90e4fc5f',
  },
  [ChainId.ZIRCUIT]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0x4200000000000000000000000000000000000006',
  },
  [ChainId.X_LAYER]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'OKB',
    name: 'OKB',
    wrappedTokenSymbol: 'WOKB',
    wrappedTokenAddress: '0xe538905cf8410324e03a5a23c1c177a474d59b2b',
  },
  [ChainId.ZERO]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0xAc98B49576B1C892ba6BFae08fE1BB0d80Cf599c',
  },
  [ChainId.HASHKEY]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'HSK',
    name: 'HSK',
    wrappedTokenSymbol: 'WHSK',
    wrappedTokenAddress: '0xB210D2120d57b758EE163cFfb43e73728c471Cf1',
  },
  [ChainId.HEMI]: {
    ...DEFAULT_BASIC_TOKEN,
    wrappedTokenAddress: '0x4200000000000000000000000000000000000006',
  },
  [ChainId.PHAROS_TESTNET]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'PHRS',
    name: 'PHRS',
    wrappedTokenSymbol: 'WPHRS',
    wrappedTokenAddress: '0x3019b247381c850ab53dc0ee53bce7a07ea9155f',
  },
  [ChainId.MONAD_TESTNET]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'MON',
    name: 'MON',
    wrappedTokenSymbol: 'WMON',
    wrappedTokenAddress: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
  },
  [ChainId.MONAD]: {
    ...DEFAULT_BASIC_TOKEN,
    symbol: 'MON',
    name: 'MON',
    wrappedTokenSymbol: 'WMON',
    wrappedTokenAddress: '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A',
  },
};
