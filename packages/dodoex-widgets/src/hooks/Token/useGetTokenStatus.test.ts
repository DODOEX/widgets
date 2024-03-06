import { useGetTokenStatus } from './useGetTokenStatus';
import tokenList from '../../constants/tokenList';
import { ApprovalState } from './type';
import { renderHook } from '@testing-library/react-hooks';
import BigNumber from 'bignumber.js';

jest.mock('../../store/selectors/wallet', () => ({
  getDefaultChainId: () => 1,
}));
jest.mock('../../store/selectors/token', () => ({
  getEthBalance: () => ({
    1: new BigNumber(12),
  }),
  getBalanceLoadings: () => ({
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': false,
    '0xdac17f958d2ee523a2206206994597c13d831ec7': false,
  }),
  getAccountBalances: () => ({
    '0xdac17f958d2ee523a2206206994597c13d831ec7': {
      tokenBalances: new BigNumber(123),
      tokenAllowances: new BigNumber(456),
    },
  }),
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: (fn: () => any) => {
    if (typeof fn === 'function') {
      return fn();
    }
    return [];
  },
}));
jest.mock('@web3-react/core', () => ({
  useWeb3React: () => ({
    account: '0x2Ba1633338dDD2Ab37fbc95ea615BA98f0445380',
  }),
}));

describe('useGetTokenStatus', () => {
  const { result } = renderHook(() =>
    useGetTokenStatus({
      chainId: 1,
      account: '0x2Ba1633338dDD2Ab37fbc95ea615BA98f0445380',
    }),
  );
  const tokenEther = tokenList[0];
  const tokenUSDT = tokenList[5];

  it('getApprovalState', () => {
    const { getApprovalState } = result.current;
    expect(getApprovalState(tokenEther, 0)).toBe(ApprovalState.Unchecked);
    expect(getApprovalState(tokenEther, 2)).toBe(ApprovalState.Sufficient);
    expect(getApprovalState(tokenUSDT, 0)).toBe(ApprovalState.Unchecked);
    expect(getApprovalState(tokenUSDT, 2)).toBe(ApprovalState.Sufficient);
  });

  it('getPendingRest', () => {
    const { getPendingRest } = result.current;
    expect(getPendingRest(tokenEther)).toBeFalsy();
    expect(getPendingRest(tokenUSDT)).toBeTruthy();
  });

  it('getMaxBalance', () => {
    const { getMaxBalance } = result.current;
    expect(getMaxBalance(tokenEther)).toBe('12');
    expect(getMaxBalance(tokenUSDT)).toBe('123');
  });
});
