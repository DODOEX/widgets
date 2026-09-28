import tokenList from '../../constants/tokenList';
import useFindTokenByAddress from './useFindTokenByAddress';
import { renderHook } from '@testing-library/react';

jest.mock('../useTokenState', () => ({
  useTokenState: () => ({
    tokenList,
  }),
}));
jest.mock('../ConnectWallet/useWalletInfo', () => ({
  useWalletInfo: () => ({
    chainId: 1,
  }),
}));
describe('useFindTokenByAddress', () => {
  it('token', () => {
    const { result } = renderHook(() =>
      useFindTokenByAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'),
    );

    expect(result.current?.symbol).toBe('ETH');
  });
});
