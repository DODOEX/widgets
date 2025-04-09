import tokenList from '../../constants/tokenList';
import useFindTokenByAddress from './useFindTokenByAddress';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('../useTokenState', () => ({
  useTokenState: () => ({
    tokenList,
  }),
}));
jest.mock('@web3-react/core', () => ({
  useWeb3React: () => ({
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
