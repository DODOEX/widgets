import tokenList from '../../constants/tokenList';
import useTokenList, { getFuzzySearchTokenSort } from './useTokenList';
import { renderHook } from '@testing-library/react-hooks';

const USDT = {
  chainId: 1,
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  name: 'Tether USD',
  decimals: 6,
  symbol: 'USDT',
};

describe('getFuzzySearchTokenSort', () => {
  it('sort is 1 when the address exactly match', () => {
    expect(
      getFuzzySearchTokenSort(USDT, USDT.address, {
        matchAddress: true,
      }),
    ).toBe(1);
    expect(
      getFuzzySearchTokenSort(USDT, USDT.address.toLocaleUpperCase(), {
        matchAddress: true,
      }),
    ).toBe(1);
  });

  it('sort is 2 when the symbol exactly match', () => {
    expect(getFuzzySearchTokenSort(USDT, USDT.symbol)).toBe(2);
    expect(getFuzzySearchTokenSort(USDT, USDT.symbol.toLocaleLowerCase())).toBe(
      2,
    );
  });

  it('sort is 3 when the symbol prefix match', () => {
    expect(getFuzzySearchTokenSort(USDT, 'US')).toBe(3);
    expect(getFuzzySearchTokenSort(USDT, 'us')).toBe(3);
  });

  it('sort is 4 when the symbol other match', () => {
    expect(getFuzzySearchTokenSort(USDT, 'DT')).toBe(4);
    expect(getFuzzySearchTokenSort(USDT, 'dt')).toBe(4);
  });

  it('sort is 2 when the name exactly match', () => {
    expect(getFuzzySearchTokenSort(USDT, USDT.name)).toBe(2);
    expect(getFuzzySearchTokenSort(USDT, USDT.name.toLocaleLowerCase())).toBe(
      2,
    );
  });

  it('sort is 12 when the name prefix match', () => {
    expect(getFuzzySearchTokenSort(USDT, 'Tether')).toBe(12);
    expect(getFuzzySearchTokenSort(USDT, 'tether')).toBe(12);
  });

  it('sort is 13 when the name other match', () => {
    expect(getFuzzySearchTokenSort(USDT, 'THER')).toBe(13);
    expect(getFuzzySearchTokenSort(USDT, 'ther')).toBe(13);
  });
});

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
jest.mock('@web3-react/core', () => ({
  useWeb3React: () => ({
    chainId: 1,
  }),
}));

describe('useTokenList', () => {
  const needShowList = tokenList.filter((token) => token.chainId === 1);
  it('returns the token list of the specified chain', () => {
    const { result } = renderHook(() =>
      useTokenList({
        onChange: jest.fn(),
      }),
    );

    expect(result.current.showTokenList.length).toBe(needShowList.length);
  });

  it('hide the specified address when the hiddenAddrs parameter is passed', () => {
    const { result } = renderHook(() =>
      useTokenList({
        hiddenAddrs: [needShowList[0].address],
        onChange: jest.fn(),
      }),
    );

    expect(result.current.showTokenList.length).toBe(needShowList.length - 1);
  });

  it('only the specified address is displayed when the showAddrs parameter is passed', () => {
    const { result } = renderHook(() =>
      useTokenList({
        showAddrs: [needShowList[1].address],
        onChange: jest.fn(),
      }),
    );

    expect(result.current.showTokenList.length).toBe(1);
    expect(result.current.showTokenList[0].address).toBe(
      needShowList[1].address,
    );
  });

  it('select occupied token', () => {
    const selectMock = jest.fn();
    const onnupiedToken = needShowList[1];
    const { result } = renderHook(() =>
      useTokenList({
        occupiedAddrs: [onnupiedToken.address],
        onChange: selectMock,
      }),
    );

    result.current.onSelectToken(onnupiedToken);

    expect(selectMock.mock.calls.length).toBe(1);
    expect(selectMock.mock.calls[0][0].address).toBe(onnupiedToken.address);
    expect(selectMock.mock.calls[0][1]).toBeTruthy();
  });

  it('select other token', () => {
    const selectMock = jest.fn();
    const selectToken = needShowList[0];
    const onnupiedToken = needShowList[1];
    const { result } = renderHook(() =>
      useTokenList({
        occupiedAddrs: [onnupiedToken.address],
        onChange: selectMock,
      }),
    );

    result.current.onSelectToken(selectToken);

    expect(selectMock.mock.calls.length).toBe(1);
    expect(selectMock.mock.calls[0][0].address).toBe(selectToken.address);
    expect(selectMock.mock.calls[0][1]).toBeFalsy();
  });
});
