import { ChainId } from '@dodoex/api';
import { BifrostMintToken } from './types';

/**
 * Internal list of Bifrost LST mint tokens.
 * Matching is done by comparing wrapToken.address against pool base/quote tokens on the same chainId.
 * Contract address is resolved at runtime via getTransparentUpgradeableProxyWithProsContractAddressByChainId.
 */
export const BIFROST_MINT_TOKENS: BifrostMintToken[] = [
  {
    chainId: ChainId.PHAROS_ATLANTIC_TESTNET,
    token: {
      chainId: ChainId.PHAROS_ATLANTIC_TESTNET,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // native PHRS
      symbol: 'PHRS',
      name: 'Pharos',
      decimals: 18,
    },
    wrapToken: {
      chainId: ChainId.PHAROS_ATLANTIC_TESTNET,
      address: '0xc9A0B63d91c2A808dD631d031f037944fedDaA12',
      symbol: 'stPROS',
      name: 'stPROS',
      decimals: 18,
    },
  },
];
