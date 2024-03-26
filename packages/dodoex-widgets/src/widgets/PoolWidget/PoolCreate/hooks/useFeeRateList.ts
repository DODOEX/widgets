import { alpha, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useMemo } from 'react';
import { RadioButtonT } from '../types';
import { DEFAULT_FEE_RATE } from '../utils';

export const getFeeRateList = () => [
  {
    title: '0.01%',
    description: t`Fees will be the same as in most other pools.`,
    value: '0.01',
  },
  {
    title: '0.3%',
    description: t`Set the fee to the same as most other pools`,
    value: DEFAULT_FEE_RATE,
    tag: '99% Default',
  },
  {
    title: '1%',
    description: 'Most suitable for swapping exotic assets.',
    value: '1',
  },
];

export function useFeeRateList() {
  const theme = useTheme();

  return useMemo<Array<RadioButtonT>>(() => {
    const feeRateList = getFeeRateList();
    return feeRateList.map((item) => {
      if (item.value === DEFAULT_FEE_RATE) {
        return {
          ...item,
          tagBackgroundColor: alpha(theme.palette.purple.main, 0.1),
          tagColor: theme.palette.purple.main,
        };
      }
      return item;
    });
  }, [theme.palette.purple.main]);
}
