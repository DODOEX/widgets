import { PoolTypeE } from './types';

import { FeeE } from './types';

export const formatFee = ({ type, fee }: { type: PoolTypeE; fee: FeeE }) => {
  if (type === PoolTypeE.Pool) {
    return `${fee / 100}%`;
  }
  return `${fee / 10000}%`;
};
