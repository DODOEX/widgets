import { getFullnodeUrl } from '@mysten/sui/client';
import { SUI_DECIMALS } from '@mysten/sui/utils';
import type { CaipNetworkId } from '@reown/appkit';
import type { ChainNamespace } from '@reown/appkit-common';
import { defineChain } from '@reown/appkit/networks';
import { ChainId } from './chain';
import { tonEndpointByChain } from './ton-utils';

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

export const sui = defineChain({
  id: ChainId.SUI,
  caipNetworkId: `sui:${ChainId.SUI}` as CaipNetworkId,
  chainNamespace: 'sui' as ChainNamespace,
  name: 'Sui',
  nativeCurrency: {
    name: 'SUI',
    symbol: 'SUI',
    decimals: SUI_DECIMALS,
  },
  rpcUrls: {
    default: { http: [getFullnodeUrl('mainnet')] },
  },
  blockExplorers: {
    default: { name: 'suiscan', url: 'https://suiscan.xyz/mainnet/' },
  },
  testnet: false,
});

export const suiTestnet = defineChain({
  id: ChainId.SUI_TESTNET,
  caipNetworkId: `sui:${ChainId.SUI_TESTNET}` as CaipNetworkId,
  chainNamespace: 'sui' as ChainNamespace,
  name: 'Sui Testnet',
  nativeCurrency: {
    name: 'SUI',
    symbol: 'SUI',
    decimals: SUI_DECIMALS,
  },
  rpcUrls: {
    default: { http: [getFullnodeUrl('testnet')] },
  },
  blockExplorers: {
    default: { name: 'suiscan', url: 'https://suiscan.xyz/testnet/' },
  },
  testnet: true,
});

export const ton = defineChain({
  id: ChainId.TON,
  caipNetworkId: `ton:${ChainId.TON}` as CaipNetworkId,
  chainNamespace: 'ton' as ChainNamespace,
  name: 'TON',
  nativeCurrency: {
    name: 'TON',
    symbol: 'TON',
    decimals: 9,
  },
  rpcUrls: {
    default: { http: [tonEndpointByChain[ChainId.TON]] },
  },
  blockExplorers: {
    default: { name: 'Tonviewer', url: 'https://tonviewer.com/' },
  },
  testnet: false,
});

export const tonTestnet = defineChain({
  id: ChainId.TON_TESTNET,
  caipNetworkId: `ton:${ChainId.TON_TESTNET}` as CaipNetworkId,
  chainNamespace: 'ton' as ChainNamespace,
  name: 'TON Testnet',
  nativeCurrency: {
    name: 'TON',
    symbol: 'TON',
    decimals: 9,
  },
  rpcUrls: {
    default: { http: [tonEndpointByChain[ChainId.TON_TESTNET]] },
  },
  blockExplorers: {
    default: { name: 'Tonviewer', url: 'https://testnet.tonviewer.com/' },
  },
  testnet: true,
});
