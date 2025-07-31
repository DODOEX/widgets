import type { CaipNetwork } from '@reown/appkit-common';
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  base,
  bitcoin,
  bsc,
  mainnet,
  polygon,
  sepolia,
  solana,
  solanaDevnet,
  zetachain,
} from '@reown/appkit/networks';
import { ChainId } from './chain';
import { btcSignet, zetachainTestnet } from './defineChain';

export function getCaipNetworkByChainId(chainId: ChainId): CaipNetwork {
  switch (chainId) {
    case ChainId.BTC:
      return bitcoin;
    case ChainId.BTC_SIGNET:
      return btcSignet;

    case ChainId.SOLANA_DEVNET:
      return solanaDevnet;
    case ChainId.SOLANA:
      return solana;

    case ChainId.BSC:
      return {
        ...bsc,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${chainId}`,
      };

    case ChainId.MAINNET:
      return {
        ...mainnet,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${chainId}`,
      };

    case ChainId.POLYGON:
      return {
        ...polygon,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${chainId}`,
      };

    case ChainId.BASE:
      return {
        ...base,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${chainId}`,
      };

    case ChainId.ZETACHAIN:
      return {
        ...zetachain,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${chainId}`,
      };

    case ChainId.AVALANCHE:
      return {
        ...avalanche,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${chainId}`,
      };

    case ChainId.ARBITRUM_ONE:
      return {
        ...arbitrum,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${chainId}`,
      };

    case ChainId.ZETACHAIN_TESTNET:
      return zetachainTestnet;

    case ChainId.SEPOLIA:
      return {
        ...sepolia,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${chainId}`,
      };

    case ChainId.ARBITRUM_SEPOLIA:
      return {
        ...arbitrumSepolia,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${chainId}`,
      };

    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}
