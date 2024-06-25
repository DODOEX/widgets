import { platformIdMap } from '../constants/chains';
import { ChainId } from '@dodoex/api';

export const getPlatformId = (chainId: ChainId) =>
  platformIdMap[chainId] || platformIdMap[ChainId.MAINNET];
