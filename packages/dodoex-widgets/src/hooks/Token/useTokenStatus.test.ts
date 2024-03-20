import { TokenInfo } from './type';
import { renderHook } from '@testing-library/react-hooks';
import BigNumber from 'bignumber.js';
import { useTokenStatus } from './useTokenStatus';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: undefined,
    isLoading: true,
  })),
}));

const useQueryMock = useQuery as unknown as jest.Mock;

jest.mock('@web3-react/core', () => ({
  useWeb3React: () => ({
    account: '0x2Ba1633338dDD2Ab37fbc95ea615BA98f0445380',
  }),
}));

const defaultReturnResult = {
  isApproving: false,
  isGetApproveLoading: false,
  needApprove: false,
  needReset: false,
  loading: false,
  insufficientBalance: false,
  approveTitle: 'Approve MOCK',
  submitApprove: expect.any(Function),
  getMaxBalance: expect.any(Function),
};

describe('useTokenStatus', () => {
  const mockToken: TokenInfo = {
    address: '0x0000000000000000000000000000000000000001',
    symbol: 'MOCK',
    name: 'MOCK',
    decimals: 18,
    chainId: 1,
  };

  it('should return isGetApproveLoading when no token is provided', () => {
    const { result } = renderHook(() => useTokenStatus(undefined));

    expect(result.current).toEqual({
      ...defaultReturnResult,
      approveTitle: '',
      isGetApproveLoading: true,
      loading: true,
    });
  });

  it('should return isGetApproveLoading when the approval state is loading', () => {
    const { result } = renderHook(() =>
      useTokenStatus(mockToken, { amount: '1' }),
    );

    expect(result.current).toEqual({
      ...defaultReturnResult,
      isGetApproveLoading: true,
      insufficientBalance: true,
      loading: true,
    });
  });

  it('should return insufficientBalance when the balance < amount', () => {
    useQueryMock.mockReturnValueOnce({
      data: {
        balance: new BigNumber(1),
        allowance: new BigNumber(1),
      },
      isLoading: false,
    });
    const { result } = renderHook(() =>
      useTokenStatus(mockToken, { amount: '10' }),
    );

    expect(result.current).toEqual({
      ...defaultReturnResult,
      insufficientBalance: true,
    });
  });

  it('should return needApprove when the allowance < amount', () => {
    useQueryMock.mockReturnValueOnce({
      data: {
        balance: new BigNumber(12),
        allowance: new BigNumber(1),
      },
      isLoading: false,
    });
    const { result } = renderHook(() =>
      useTokenStatus(mockToken, { amount: '10' }),
    );

    expect(result.current).toEqual({
      ...defaultReturnResult,
      needApprove: true,
    });
  });

  it('should return needReset is false when the token is USDT', () => {
    useQueryMock.mockReturnValueOnce({
      data: {
        balance: new BigNumber(12),
        allowance: new BigNumber(8),
      },
      isLoading: false,
    });
    const { result } = renderHook(() =>
      useTokenStatus(
        {
          ...mockToken,
          symbol: 'USDT',
        },
        { amount: '10' },
      ),
    );

    expect(result.current).toEqual({
      ...defaultReturnResult,
      needReset: true,
      approveTitle: 'Reset USDT',
    });
  });

  it('should return needApprove is false when the allowance > amount', () => {
    useQueryMock.mockReturnValueOnce({
      data: {
        balance: new BigNumber(12),
        allowance: new BigNumber(12),
      },
      isLoading: false,
    });
    const { result } = renderHook(() =>
      useTokenStatus(mockToken, { amount: '10' }),
    );

    expect(result.current).toEqual(defaultReturnResult);
  });
});
