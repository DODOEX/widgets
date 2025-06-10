import { alpha, Box, lightPalette, Tooltip } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { byWei, formatPercentageNumber } from '../../../../utils/formatter';
import { FEE_AMOUNT_DETAIL } from '../../AMMV3/components/shared';
import { FeeAmount } from '../../AMMV3/sdks/v3-sdk';

export interface PoolTypeTagProps {
  poolType: 'AMM V2' | 'AMM V3' | 'PMM';
}

export const PoolTypeTag = ({ poolType }: PoolTypeTagProps) => {
  const color =
    poolType === 'AMM V2'
      ? lightPalette.error.main
      : poolType === 'AMM V3'
        ? lightPalette.purple.main
        : lightPalette.success.main;

  return (
    <Box
      sx={{
        px: 8,
        height: 24,
        typography: 'h6',
        lineHeight: '24px',
        borderRadius: 4,
        background: alpha(color, 0.1),
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {poolType}
    </Box>
  );
};

export interface PoolFeeRateTagProps {
  isAMMV2: boolean;
  isAMMV3: boolean;
  lpFeeRate: any;
  mtFeeRate: any;
}

export const PoolFeeRateTag = ({
  isAMMV2,
  isAMMV3,
  lpFeeRate,
  mtFeeRate,
}: PoolFeeRateTagProps) => {
  return (
    <Tooltip title={<Trans>Fee rate</Trans>}>
      <Box
        sx={{
          px: 8,
          height: 24,
          typography: 'h6',
          lineHeight: '24px',
          borderRadius: 4,
          backgroundColor: 'background.tag',
          color: 'text.secondary',
          whiteSpace: 'nowrap',
        }}
      >
        {isAMMV3
          ? (FEE_AMOUNT_DETAIL[lpFeeRate as FeeAmount]?.label ?? '-')
          : formatPercentageNumber({
              input: new BigNumber(lpFeeRate ?? 0).plus(
                mtFeeRate ? byWei(mtFeeRate, isAMMV2 ? 4 : 18) : 0,
              ),
            })}
      </Box>
    </Tooltip>
  );
};
