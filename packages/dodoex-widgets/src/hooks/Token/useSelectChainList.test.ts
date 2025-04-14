import { renderHook } from '@testing-library/react-hooks';
import { isEqual } from 'lodash';
import { chainListMap } from '../../constants/chainList';
import { useSelectChainList } from './useSelectChainList';
import { useWeb3React } from '@web3-react/core';
import tokenList from '../../constants/tokenList';

const allChainList = Array.from(chainListMap.values());

jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn(() => ({
    chainId: 1,
  })),
}));

jest.mock('../useTokenState', () => ({
  getAllTokenList: jest.fn(() => tokenList),
  useTokenState: (fn: any) => fn(),
}));

jest.mock('../../components/UserOptionsProvider', () => ({
  useUserOptions: jest.fn(() => ({
    crossChain: true,
  })),
}));

describe('useSelectChainList:default', () => {
  it('default', () => {
    const { result } = renderHook(() => useSelectChainList());
    const { chainList } = result.current;
    const expectChainList = allChainList.filter(
      (chain) =>
        !chain.mainnet &&
        tokenList.some((token) => token.chainId === chain.chainId),
    );
    expect(chainList.length).toBe(expectChainList.length);
    expect(isEqual(chainList, expectChainList)).toBeTruthy();
  });

  it('test net', () => {
    const testChainId = 5;
    (
      useWeb3React as unknown as jest.Mock<
        {
          chainId: number;
        },
        []
      >
    ).mockReturnValue({
      chainId: testChainId,
    });
    const { result } = renderHook(() => useSelectChainList());
    const { chainList } = result.current;
    const expectChainList = allChainList.filter(
      (chain) =>
        !chain.mainnet &&
        tokenList.some((token) => token.chainId === chain.chainId),
    );
    expect(chainList.length).toBe(expectChainList.length);
    expect(
      chainList.some((chain) => chain.chainId === testChainId),
    ).toBeTruthy();
  });
});
