import { Box } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { TextAndDesc } from './widgets';
import { useLingui } from '@lingui/react';
import { TabMiningI } from '../../types';
import { formatShortNumber } from '../../../../utils';

export interface TVLSectionProps {
  miningTotalDollar?: TabMiningI['miningTotalDollar'];
}

export const TVLSection = ({ miningTotalDollar }: TVLSectionProps) => {
  const { i18n } = useLingui();

  const text = useMemo(() => {
    if (!miningTotalDollar) {
      return 'Unknown';
    }
    const miningTotalDollarBN = new BigNumber(miningTotalDollar);
    if (!miningTotalDollarBN.isFinite()) {
      return '-';
    }
    return `$${formatShortNumber(miningTotalDollarBN)}`;
  }, [miningTotalDollar]);

  return (
    <TextAndDesc
      sx={{
        ml: 28,
      }}
      text={
        <Box
          component="span"
          sx={{
            typography: 'h5',
          }}
        >
          {text}
        </Box>
      }
    >
      {i18n._('TVL')}
    </TextAndDesc>
  );
};
