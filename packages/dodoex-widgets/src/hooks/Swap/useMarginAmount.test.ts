import { useMarginAmount } from './useMarginAmount';
import tokenList from '../../constants/tokenList';
import { renderHook } from '@testing-library/react-hooks';
import BigNumber from 'bignumber.js';

jest.mock('../../store/selectors/wallet', () => ({
  getDefaultChainId: () => 1,
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

describe('useMarginAmount', () => {
  it('tokenEther', () => {
    const tokenEther = tokenList[0];
    const { result } = renderHook(() =>
      useMarginAmount({
        token: tokenEther,
        fiatPrice: '1.2',
      }),
    );
    const { marginAmount } = result.current;
    expect(marginAmount).toBe('416666666666666666667');
  });

  it('tokenUSDT', () => {
    const tokenUSDT = tokenList[5];
    const { result } = renderHook(() =>
      useMarginAmount({
        token: tokenUSDT,
        fiatPrice: '1.53',
      }),
    );
    const { marginAmount } = result.current;
    expect(marginAmount).toBe('326797386');
  });
});
