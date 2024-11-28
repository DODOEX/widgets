import { useFetchRoutePrice, RoutePriceStatus } from './useFetchRoutePrice';
import tokenList from '../../constants/tokenList';
import { renderHook } from '@testing-library/react-hooks';
import BigNumber from 'bignumber.js';
import axios from 'axios';

const tokenEther = tokenList[0];
const tokenUSDT = tokenList[5];
const tokenUSDTChainBSC = {
  ...tokenUSDT,
  chainId: 56,
};

jest.mock('../solana/useFetchSolanaRoutePrice');
jest.mock('axios');
jest.mock('../../components/UserOptionsProvider', () => ({
  useUserOptions: () => ({
    defaultChainId: 1,
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

describe('useFetchRoutePrice: request success', () => {
  const res = {
    data: {
      data: {
        data: '',
        msgError: '',
        priceImpact: 0.0005,
        resAmount: 1.23,
        baseFeeAmount: 0.0015, // support in share profit version
        additionalFeeAmount: 0.0015, // support in share profit version
        resPricePerFromToken: 1288.37,
        resPricePerToToken: 0.00077,
        routeData: '',
        targetApproveAddr: '',
        targetDecimals: 18,
        to: '0xa2398842F37465f89540430bDC00219fA9E4D28a',
        useSource: 'dodoV1AndV2AndUni',
      },
    },
  };
  (axios.get as any).mockImplementationOnce(() => Promise.resolve(res));
  const { result } = renderHook(() =>
    useFetchRoutePrice({
      toToken: tokenEther,
      fromToken: tokenUSDT,
      fromAmount: '1.1',
      marginAmount: '0',
      toAmount: '',
    }),
  );

  it('Returns params', () => {
    const { status, rawBrief } = result.current;
    const {
      resAmount,
      priceImpact,
      baseFeeAmount,
      additionalFeeAmount,
      resPricePerToToken,
      resPricePerFromToken,
    } = rawBrief || {};
    expect(status).toBe(RoutePriceStatus.Success);
    expect(resAmount).toBe(1.23);
    expect(priceImpact).toBe(0.0005);
    expect(baseFeeAmount).toBe(0.0015);
    expect(additionalFeeAmount).toBe(0.0015);
    expect(resPricePerToToken).toBe(0.00077);
    expect(resPricePerFromToken).toBe(1288.37);
  });
});

describe('useFetchRoutePrice: skip request', () => {
  const errorMessage = 'Network Error';
  const res = {
    data: {
      data: {},
    },
  };
  // (axios.get as any).mockImplementationOnce(() =>
  //   Promise.reject(errorMessage),
  // );
  (axios.get as any).mockImplementationOnce(() => Promise.resolve(res));
  const { result } = renderHook(() =>
    useFetchRoutePrice({
      toToken: tokenEther,
      fromToken: tokenUSDTChainBSC,
      fromAmount: '1.1',
      marginAmount: '0',
      toAmount: '',
    }),
  );

  it('Returns params', () => {
    const { status } = result.current;
    expect(status).toBe(RoutePriceStatus.Initial);
  });
});

describe('useFetchRoutePrice: request failed', () => {
  const errorMessage = 'Network Error';
  const res = {
    data: {
      data: {},
    },
  };
  // (axios.get as any).mockImplementationOnce(() =>
  //   Promise.reject(errorMessage),
  // );
  (axios.get as any).mockImplementationOnce(() => Promise.resolve(res));
  const { result } = renderHook(() =>
    useFetchRoutePrice({
      toToken: tokenEther,
      fromToken: tokenUSDT,
      fromAmount: '1.1',
      marginAmount: '0',
      toAmount: '',
    }),
  );

  it('Returns params', () => {
    const { status } = result.current;
    expect(status).toBe(RoutePriceStatus.Failed);
  });
});
