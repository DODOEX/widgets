import { renderHook } from '@testing-library/react-hooks';
import { isEqual } from 'lodash';
import { chainListMap } from '../../constants/chainList';
import { useSelectChainList } from './useSelectChainList';
import { useWeb3React } from '@web3-react/core';
import tokenList from '../../constants/tokenList';

const allChainList = Object.values(chainListMap);

jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn(() => ({
    chainId: 1,
  })),
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

jest.mock('../../store/selectors/token', () => ({
  getAllTokenList: jest.fn(() => tokenList),
}));

describe('useSelectChainList:default', () => {
  it('default', () => {
    const { result } = renderHook(() => useSelectChainList());
    const { chainList } = result.current;
    expect(chainList.length).toBe(
      allChainList.filter((chain) => !chain.mainnet).length,
    );
    expect(
      isEqual(
        chainList,
        allChainList.filter((chain) => !chain.mainnet),
      ),
    ).toBeTruthy();
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
    expect(chainList.length).toBe(
      allChainList.filter((chain) => !chain.mainnet).length,
    );
    expect(
      chainList.some((chain) => chain.chainId === testChainId),
    ).toBeTruthy();
  });
});
