import { Box } from '@dodoex/components';
import { Alarm } from '@dodoex/icons';
import { t } from '@lingui/macro';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { formatReadableNumber } from '../../../../utils/formatter';

export default function ComparePrice({
  lqAndDodoCompareText,
  baseToken,
  quoteToken,
  midPrice,
}: {
  lqAndDodoCompareText: string;
  baseToken?: TokenInfo;
  quoteToken?: TokenInfo;
  midPrice?: BigNumber;
}) {
  const midPriceText = midPrice
    ? formatReadableNumber({ input: midPrice })
    : '';

  return (
    <Box
      sx={{
        p: 10,
        mb: 12,
        backgroundColor: 'custom.background.disabled',
        borderRadius: 12,
      }}
    >
      <Box
        sx={{
          typography: 'body2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'error.main',
          fontWeight: 600,
          mb: 10,
          textAlign: 'center',
        }}
      >
        <Box
          component={Alarm}
          sx={{
            mr: 4,
          }}
        />
        {t`${lqAndDodoCompareText} Price Difference`}
      </Box>
      <Box
        sx={{
          typography: 'h6',
          color: 'text.secondary',
          textAlign: 'center',
        }}
      >
        <Trans>Current liquidity pool token price</Trans>
        {` 1 ${baseToken?.symbol} = ${midPriceText} ${
          quoteToken?.symbol
        } ${t`differs from the price quoted by DODO by ${lqAndDodoCompareText}`}`}
      </Box>
    </Box>
  );
}
