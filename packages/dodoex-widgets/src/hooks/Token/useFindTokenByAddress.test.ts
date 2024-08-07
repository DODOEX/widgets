import tokenList from '../../constants/tokenList';
import useFindTokenByAddress from './useFindTokenByAddress';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('../../store/selectors/token', () => ({
  getTokenList: () => tokenList,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (fn: () => any) => {
    if (typeof fn === 'function') {
      return fn();
    }
    return [];
  },
}));
jest.mock('../ConnectWallet/useWalletState', () => ({
  useWalletState: () => ({
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
