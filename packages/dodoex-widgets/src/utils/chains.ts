import { ChainId, platformIdMap } from '@dodoex/api';

export const getPlatformId = (chainId: ChainId) =>
  platformIdMap[chainId] || platformIdMap[ChainId.SOON_TESTNET];
