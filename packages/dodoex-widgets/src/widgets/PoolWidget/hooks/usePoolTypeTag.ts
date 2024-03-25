import { PoolType } from '@dodoex/api';
import { alpha, Theme, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';

export const getPoolTypeTag = (
  type: PoolType,
  quoteReserve: BigNumber | undefined | null,
  theme: Theme,
) => {
  let typeLabel = t`Standard`;
  let typeColor = theme.palette.purple.main;
  switch (type) {
    case 'DSP':
      typeLabel = t`Pegged`;
      typeColor = theme.palette.success.main;
      break;
    case 'DPP':
      typeLabel = t`Private`;
      typeColor = theme.palette.error.main;
      break;
  }
  const isSinglePool =
    type === 'DVM' && (!quoteReserve || quoteReserve.isZero());
  if (isSinglePool) {
    typeLabel = t`Single`;
    typeColor = theme.palette.warning.main;
  }

  const typeBgColor = alpha(typeColor, 0.1);

  return {
    typeLabel,
    typeColor,
    typeBgColor,
  };
};

export const usePoolTypeTag = ({
  type,
  quoteReserve,
}: {
  type: PoolType;
  quoteReserve: BigNumber | undefined | null;
}) => {
  const theme = useTheme();

  return getPoolTypeTag(type, quoteReserve, theme);
};
