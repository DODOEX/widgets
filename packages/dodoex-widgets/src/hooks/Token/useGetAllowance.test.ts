import useGetAllowance from './useGetAllowance';
import tokenList from '../../constants/tokenList';
import contractConfig from '../contract/contractConfig';
import { ChainId } from '../../constants/chains';
import { BIG_ALLOWANCE } from '../../constants/token';
import { renderHook } from '@testing-library/react-hooks';
import BigNumber from 'bignumber.js';

jest.mock('../../store/selectors/wallet', () => ({
  getDefaultChainId: () => 1,
}));
jest.mock('../../store/selectors/token', () => ({
  getAccountBalances: () => ({
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
      tokenBalances: 0,
      tokenAllowances: new BigNumber(12123),
    }
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
jest.mock('@web3-react/core', () => ({
  useWeb3React: () => ({
    account: '0x2Ba1633338dDD2Ab37fbc95ea615BA98f0445380',
  }),
}));
describe('useFindTokenByAddress', () => {
  const contract = contractConfig[ChainId.MAINNET].DODO_APPROVE;
  const { result } = renderHook(() =>
    useGetAllowance(contract),
  );
  const getAllowance = result.current;

  it('getAllowance: EtherToken', () => {
    const token = tokenList[0];
    const allowance = getAllowance(token);
    expect(allowance?.toString()).toBe(new BigNumber(BIG_ALLOWANCE).toString());
  });

  it('getAllowance: OtherToken', () => {
    const token = tokenList[1];
    const getAllowance = result.current;
    const allowance = getAllowance(token);
    expect(allowance?.toString()).toBe('12123');
  });
});