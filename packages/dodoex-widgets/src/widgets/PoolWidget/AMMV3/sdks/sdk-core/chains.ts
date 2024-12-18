import { ChainId } from '@dodoex/api';
export { ChainId } from '@dodoex/api';

export const SUPPORTED_CHAINS = [
  ChainId.MAINNET,
  ChainId.ARBITRUM_ONE,
  ChainId.SEPOLIA,
  ChainId.TAIKO,
] as const;
export type SupportedChainsType = (typeof SUPPORTED_CHAINS)[number];
