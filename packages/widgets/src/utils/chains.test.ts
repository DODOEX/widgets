import { getPlatformId } from './chains';
import { ChainId } from '../constants/chains'

describe('getPlatformId', () => {
  it('returns platformId base on normal chainId', () => {
    const res = getPlatformId(ChainId.BSC);
    expect(res).toBe('bsc');
  });
  it('returns platformId base on abnormal chainId', () => {
    const res = getPlatformId(123);
    expect(res).toBe('ethereum');
  });
});
