import BigNumber from 'bignumber.js';
import { formatTokenAmountNumber } from '../../../../utils';
import { Bound } from '../types';

export function formatTickPrice({
  price,
  atLimit,
  direction,
}: {
  price?: BigNumber | string;
  atLimit: { [bound in Bound]?: boolean | undefined };
  direction: Bound;
}) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? '0' : '∞';
  }

  if (typeof price === 'string' && price === '∞') {
    return '∞';
  }

  return formatTokenAmountNumber({
    input: price,
  });
}
