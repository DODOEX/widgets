import { ChainId } from './chain';

export const platformIdMap: {
  [key in ChainId]: string;
} = {
  [ChainId.MAINNET]: 'ethereum',
  [ChainId.GOERLI]: 'goerli',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.CONFLUX]: 'cfx',
  [ChainId.BSC]: 'bsc',
  [ChainId.OKCHAIN]: 'okex-chain',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ARBITRUM_SEPOLIA]: 'arb-sep',
  [ChainId.AURORA]: 'aurora',
  [ChainId.AVALANCHE]: 'avalanche', // Needs confirm
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
