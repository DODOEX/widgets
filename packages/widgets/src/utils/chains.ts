import { platformIdMap, ChainId } from '../constants/chains'
export const getPlatformId = (chainId: ChainId) => (platformIdMap[chainId] || platformIdMap[ChainId.MAINNET])