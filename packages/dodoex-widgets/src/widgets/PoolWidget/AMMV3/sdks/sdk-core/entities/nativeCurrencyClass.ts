import { BaseCurrency } from './baseCurrency';

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrencyClass extends BaseCurrency {
  public readonly isNative: true = true;
  public readonly isToken: false = false;
}
