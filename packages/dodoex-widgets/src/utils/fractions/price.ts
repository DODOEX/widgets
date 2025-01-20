import JSBI from 'jsbi';

import { BigintIsh, Rounding } from './types';
import { Fraction } from './fraction';
import { TokenInfo } from '../../hooks/Token';

export class Price extends Fraction {
  public readonly baseCurrency: TokenInfo; // input i.e. denominator
  public readonly quoteCurrency: TokenInfo; // output i.e. numerator
  public readonly scalar: Fraction; // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token

  /**
   * Construct a price, either with the base and quote currency amount, or the
   * @param args
   */
  public constructor(...args: [TokenInfo, TokenInfo, BigintIsh, BigintIsh]) {
    let baseCurrency: TokenInfo,
      quoteCurrency: TokenInfo,
      denominator: BigintIsh,
      numerator: BigintIsh;

    [baseCurrency, quoteCurrency, denominator, numerator] = args;
    super(numerator, denominator);

    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.scalar = new Fraction(
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(baseCurrency.decimals)),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(quoteCurrency.decimals)),
    );
  }

  /**
   * Flip the price, switching the base and quote currency
   */
  public invert(): Price {
    return new Price(
      this.quoteCurrency,
      this.baseCurrency,
      this.numerator,
      this.denominator,
    );
  }

  /**
   * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
   * @param other the other price
   */
  public multiply(other: Price): Price {
    const fraction = super.multiply(other);
    return new Price(
      this.baseCurrency,
      other.quoteCurrency,
      fraction.denominator,
      fraction.numerator,
    );
  }

  /**
   * Get the value scaled by decimals for formatting
   * @private
   */
  private get adjustedForDecimals(): Fraction {
    return super.multiply(this.scalar);
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding?: Rounding,
  ): string {
    return this.adjustedForDecimals.toSignificant(
      significantDigits,
      format,
      rounding,
    );
  }

  public toFixed(
    decimalPlaces: number = 4,
    format?: object,
    rounding?: Rounding,
  ): string {
    return this.adjustedForDecimals.toFixed(decimalPlaces, format, rounding);
  }
}
