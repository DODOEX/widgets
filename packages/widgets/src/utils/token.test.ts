import BigNumber from 'bignumber.js';
import { basicTokenMap } from '../constants/chains';
import { toWei } from './formatter';
import { getSwapTxValue, getTokenSymbolDisplay } from './token';

const usdtToken = {
  chainId: 1,
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  name: 'name',
  decimals: 6,
  symbol: 'USDT',
};

describe('getTokenSymbolDisplay', () => {
  it('other tokens Return the symbol of the parameter', () => {
    expect(getTokenSymbolDisplay(usdtToken)).toBe('USDT');
  });

  it('remove DLP_ in symbol', () => {
    expect(
      getTokenSymbolDisplay({
        ...usdtToken,
        symbol: 'USDDLP_T',
      }),
    ).toBe('USDT');
  });

  it('remove DLP_ in symbol', () => {
    expect(
      getTokenSymbolDisplay({
        ...usdtToken,
        symbol: 'USDDLP_T',
      }),
    ).toBe('USDT');
  });

  it('replace DLP in symbol with LP', () => {
    expect(
      getTokenSymbolDisplay({
        ...usdtToken,
        symbol: 'USDDLPT',
      }),
    ).toBe('USDLPT');
  });
});

describe('getSwapTxValue', () => {
  it('other tokens get 0', () => {
    expect(
      getSwapTxValue({
        chainId: 1,
        tokenAddress: usdtToken.address,
        tokenAmount: 0.000001,
      }),
    ).toBe(`0x${new BigNumber(0).toString(16)}`);
  });

  it('basic token get toWei result', () => {
    expect(
      getSwapTxValue({
        chainId: 1,
        tokenAddress: basicTokenMap[1].address,
        tokenAmount: 0.000001,
      }),
    ).toBe(`0x${toWei(0.000001, 18).toString(16)}`);
  });
});
