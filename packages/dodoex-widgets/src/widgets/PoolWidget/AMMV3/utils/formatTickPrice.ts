import { formatTokenAmountNumber } from '../../../../utils';
import { Currency, Price } from '../sdks/sdk-core';
import { Bound } from '../types';

export function formatTickPrice({
  price,
  atLimit,
  direction,
}: {
  price?: Price<Currency, Currency>;
  atLimit: { [bound in Bound]?: boolean | undefined };
  direction: Bound;
}) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? '0' : '∞';
  }

  return formatTokenAmountNumber({
    input: price?.toSignificant(),
  });
}
