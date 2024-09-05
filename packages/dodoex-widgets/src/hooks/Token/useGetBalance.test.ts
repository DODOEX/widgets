import useGetBalance from './useGetBalance';
import tokenList from '../../constants/tokenList';
import { renderHook } from '@testing-library/react-hooks';
import BigNumber from 'bignumber.js';

jest.mock('../../store/selectors/token', () => ({
  getEthBalance: () => ({
    1: new BigNumber(123),
  }),
  getAccountBalances: () => ({
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
      tokenBalances: new BigNumber(456),
      tokenAllowances: 0,
    },
  }),
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
    account: '0x2Ba1633338dDD2Ab37fbc95ea615BA98f0445380',
    evmAccount: '0x2Ba1633338dDD2Ab37fbc95ea615BA98f0445380',
  }),
}));
describe('useGetBalance', () => {
  const { result } = renderHook(() => useGetBalance());

  it('getBalance: EtherToken', () => {
    const token = tokenList[0];
    const getBalance = result.current;
    const balance = getBalance(token);
    expect(balance?.toString()).toBe('123');
  });

  it('getBalance: OtherToken', () => {
    const token = tokenList[1];
    const getBalance = result.current;
    const balance = getBalance(token);
    expect(balance?.toString()).toBe('456');
  });
});
