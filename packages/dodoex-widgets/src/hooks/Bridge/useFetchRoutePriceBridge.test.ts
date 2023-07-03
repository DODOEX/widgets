import {
  useFetchRoutePriceBridge,
  RoutePriceStatus,
} from './useFetchRoutePriceBridge';
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

jest.mock('axios');
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

describe('useFetchRoutePriceBridge: request success', () => {
  const res = {
    data: {
      data: {
        routes: [
          {
            toAmount: '99999999999000',
            feeUSD: '1.000998',
            executionDuration: 600,
            product: 'stargate',
            step: {
              type: 'cross',
              tool: 'stargate',
              approvalAddress: '0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8',
              includedSteps: [
                {
                  id: '1',
                  tool: 'stargate',
                  toolDetails: {
                    key: 'stargate',
                    logoURI:
                      'https://raw.githubusercontent.com/lifinance/types/5685c638772f533edad80fcb210b4bb89e30a50f/src/assets/icons/bridges/stargate.png',
                    name: 'Stargate',
                  },
                  type: 'cross',
                  estimate: {
                    fromToken: {
                      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
                      decimals: 18,
                      symbol: 'BUSD',
                      chainId: 56,
                    },
                    toToken: {
                      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
                      decimals: 6,
                      symbol: 'USDT',
                      chainId: 137,
                    },
                    fromAmount: '1000000000000000000',
                    toAmount: '999000',
                    executionDuration: 600,
                  },
                },
              ],
              toolDetails: {
                key: 'stargate',
                logoURI:
                  'https://raw.githubusercontent.com/lifinance/types/5685c638772f533edad80fcb210b4bb89e30a50f/src/assets/icons/bridges/stargate.png',
                name: 'Stargate',
              },
            },
            encodeParams: {
              fromChainId: 56,
              depositContract: '0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8',
              dstChainId: 109,
              srcPoolId: 5,
              dstPoolId: 2,
              fromAddress: '0x1033dd8fECCe8F5FDd4B2F235B047CB1EE59512a',
              toAddress: '0x1033dd8fECCe8F5FDd4B2F235B047CB1EE59512a',
              amountLD: '1000000000000000000',
              minAmountLD: '500000000000000000',
              crossChainSwapFeeValue: '0x05f5fe491c1c61',
              sign: 'dc23t56kvnjwXq7g21XvbAEItuZis7/OqrwfQ0eHyXV4XRUIlzu0OfN/1QuZnh/QtcCni1Hy5q/3oeDd+/7AbCM+gTfShxNTjNZtCx5ifzZoPEmwZ839Qvxt/3DawMr1wE0I3bCitoon4+z5b94TwDRcsIfIoN0P4xbpS+eQkBk=',
            },
          },
        ],
      },
    },
  };
  (axios.post as any).mockImplementationOnce(() => Promise.resolve(res));
  const { result } = renderHook(() =>
    useFetchRoutePriceBridge({
      toToken: tokenEther,
      fromToken: tokenUSDTChainBSC,
      fromAmount: '1.1',
    }),
  );

  it('Returns params', () => {
    const { status, bridgeRouteList } = result.current;
    expect(status).toBe(RoutePriceStatus.Success);
    expect(bridgeRouteList.length).toBe(1);
    expect(bridgeRouteList[0].toTokenAmount.toString()).toBe(
      '0.000099999999999',
    );
  });
});

describe('useFetchRoutePriceBridge: skip request', () => {
  const res = {
    data: {
      data: {},
    },
  };
  (axios.post as any).mockImplementationOnce(() => Promise.resolve(res));
  const { result } = renderHook(() =>
    useFetchRoutePriceBridge({
      toToken: tokenEther,
      fromToken: tokenUSDT,
      fromAmount: '1.1',
    }),
  );

  it('Returns params', () => {
    const { status, bridgeRouteList } = result.current;
    expect(status).toBe(RoutePriceStatus.Initial);
    expect(bridgeRouteList.length).toBe(0);
  });
});

describe('useFetchRoutePrice: request failed', () => {
  const errorMessage = 'Network Error';
  const res = {
    data: {
      data: {},
    },
  };
  // (axios.post as any).mockImplementationOnce(() =>
  //   Promise.reject(errorMessage),
  // );
  (axios.post as any).mockImplementationOnce(() => Promise.resolve(res));
  const { result } = renderHook(() =>
    useFetchRoutePriceBridge({
      toToken: tokenEther,
      fromToken: tokenUSDTChainBSC,
      fromAmount: '1.1',
    }),
  );

  it('Returns params', () => {
    const { status } = result.current;
    expect(status).toBe(RoutePriceStatus.Failed);
  });
});
