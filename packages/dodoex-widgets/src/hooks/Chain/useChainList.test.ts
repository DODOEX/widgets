import { renderHook } from '@testing-library/react-hooks';
import { isEqual } from 'lodash';
import { chainListMap } from '../../constants/chainList';
import { useChainList } from './useChainList';
import { useWeb3React } from '@web3-react/core';
import { useUserOptions } from '../../components/UserOptionsProvider';

const allChainList = Array.from(chainListMap.values());

jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn(() => ({
    chainId: 1,
  })),
}));
jest.mock('../../components/UserOptionsProvider', () => ({
  useUserOptions: jest.fn(() => ({
    supportChainIds: undefined,
  })),
}));

describe('useChainList:default', () => {
  it('default', () => {
    const { result } = renderHook(() => useChainList());
    const chainList = result.current;
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
    const { result } = renderHook(() => useChainList());
    const chainList = result.current;
    expect(chainList.length).toBe(
      allChainList.filter((chain) => !chain.mainnet).length,
    );
    expect(
      chainList.some((chain) => chain.chainId === testChainId),
    ).toBeTruthy();
  });
});
