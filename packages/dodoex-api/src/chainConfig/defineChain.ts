import { defineChain } from '@reown/appkit/networks';
import { ChainId } from './chain';

export const zetachainTestnet = defineChain({
  id: ChainId.ZETACHAIN_TESTNET,
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
  caipNetworkId: `eip155:${ChainId.ZETACHAIN_TESTNET}`,
});

export const btcSignet = defineChain({
  id: '000000000933ea01ad0ee984209779ba1',
  caipNetworkId: 'bip122:000000000933ea01ad0ee984209779ba1',
  chainNamespace: 'bip122',
  name: 'Bitcoin Signet',
  nativeCurrency: {
    name: 'sBTC',
    symbol: 'sBTC',
    decimals: 8,
  },
  rpcUrls: {
    default: { http: ['https://rpc.walletconnect.org/v1'] },
  },
  blockExplorers: {
    default: { name: 'mempool', url: 'https://mempool.space/' },
  },
  testnet: true,
});
