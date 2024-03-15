import { PoolType } from './type';

export const poolUtils = {
  getIsV3Mining(type: PoolType): boolean {
    return ['DSP', 'LPTOKEN', 'V3CLASSICAL'].includes(type);
  },

  getHasQuoteSupply(type: PoolType): boolean {
    return ['CLASSICAL', 'V3CLASSICAL', 'DPP'].includes(type);
  },
};
