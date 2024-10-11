import { useFetchFiatPrice } from './useFetchFiatPrice';
import tokenList from '../../constants/tokenList';
import { renderHook } from '@testing-library/react-hooks';
import BigNumber from 'bignumber.js';
import axios from 'axios';

jest.mock('axios');
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
jest.mock('../../components/UserOptionsProvider', () => ({
  useUserOptions: () => ({
    apikey: '',
  }),
}));
describe('useFetchFiatPrice', () => {
  const tokenEther = tokenList[0];
  const tokenUSDT = tokenList[5];
  const res = {
    data: {
      data: [
        {
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          network: 'ethereum',
          price: '1.23',
          serial: 0,
          symbol: 'BUSD',
        },
        {
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          network: 'ethereum',
          price: '1285.86000000',
          serial: 1,
          symbol: 'ETH',
        },
      ],
    },
  };
  axios.post = jest.fn().mockResolvedValue(res);
  const { result } = renderHook(() =>
    useFetchFiatPrice({
      fromToken: tokenEther,
      toToken: tokenUSDT,
    }),
  );

  it('toFiatPrice & fromFiatPrice', async () => {
    const { toFiatPrice, fromFiatPrice } = result.current;
    expect(toFiatPrice).toBe('1285.86000000');
    expect(fromFiatPrice).toBe('1.23');
  });
});
