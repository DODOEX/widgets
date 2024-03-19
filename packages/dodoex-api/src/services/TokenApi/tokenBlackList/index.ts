import { ChainId } from '../../../chainConfig';

export const getTokenBlackList = async (chainId: number) => {
  let blackList: string[] = [];
  const oldBlackListLen = blackList.length;
  if (!oldBlackListLen) {
    switch (chainId) {
      case ChainId.MAINNET:
        blackList = (await import('./eth')).default;
        break;
      case ChainId.BSC:
        blackList = (await import('./bsc')).default;
        break;

      default:
        break;
    }
  }
  return blackList as string[];
};
