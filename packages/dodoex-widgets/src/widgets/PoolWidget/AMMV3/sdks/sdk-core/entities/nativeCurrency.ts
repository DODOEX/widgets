// adapted from https://github.com/Uniswap/interface/src/constants/tokens.ts
import { basicTokenMap, ChainId } from '@dodoex/api';
import { Currency, NativeCurrencyClass, Token } from '..';
import { getNativeAddress } from '../../../utils';

export class NativeCurrency implements NativeCurrencyClass {
  constructor(chainId: number) {
    const nativeCurrency = basicTokenMap[chainId as ChainId];

    this.chainId = chainId;
    this.decimals = nativeCurrency.decimals;
    this.name = nativeCurrency.name;
    this.symbol = nativeCurrency.symbol;
    this.isNative = true;
    this.isToken = false;
    this.address = getNativeAddress(this.chainId);
  }

  chainId: ChainId;
  decimals: number;
  name: string;
  symbol: string;
  isNative: true;
  isToken: false;
  address: string;

  equals(currency: Currency): boolean {
    return currency.isNative && currency.chainId === this.chainId;
  }

  public get wrapped(): Token {
    const wrappedCurrencyInfo = basicTokenMap[this.chainId as ChainId];
    return new Token(
      this.chainId,
      wrappedCurrencyInfo.wrappedTokenAddress,
      wrappedCurrencyInfo.decimals,
      wrappedCurrencyInfo.wrappedTokenSymbol,
      wrappedCurrencyInfo.name,
    );
  }

  private static _cachedNativeCurrency: { [chainId: number]: NativeCurrency } =
    {};

  public static onChain(chainId: number): NativeCurrency {
    return (
      this._cachedNativeCurrency[chainId] ??
      (this._cachedNativeCurrency[chainId] = new NativeCurrency(chainId))
    );
  }
}
