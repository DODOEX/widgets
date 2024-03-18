import { PoolType } from './type';

export const poolUtils = {
  getIsV3Mining(type: PoolType): boolean {
    return ['DSP', 'LPTOKEN', 'V3CLASSICAL'].includes(type);
  },

  getHasQuoteSupply(type: PoolType): boolean {
    return ['CLASSICAL', 'V3CLASSICAL', 'DPP'].includes(type);
  },

  canOperateLiquidity(
    type?: PoolType,
    owner?: string,
    creator?: string,
    account?: string,
  ): boolean {
    const actuallyOwner = owner ?? creator;
    if (!type || !actuallyOwner || !account) return false;
    if (type !== 'DPP') return true;
    return actuallyOwner.toLocaleLowerCase() === account.toLocaleLowerCase();
  },
};
