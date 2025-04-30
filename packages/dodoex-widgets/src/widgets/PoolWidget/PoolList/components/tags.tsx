import { Box, Tooltip } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { byWei, formatPercentageNumber } from '../../../../utils/formatter';
import { FEE_AMOUNT_DETAIL } from '../../AMMV3/components/shared';
import { FeeAmount } from '../../AMMV3/sdks/v3-sdk';

export interface PoolTypeTagProps {
  poolType: 'AMM V2' | 'AMM V3' | 'PMM';
}

export const PoolTypeTag = ({ poolType }: PoolTypeTagProps) => {
  const borderColor =
    poolType === 'AMM V2'
      ? '#FC72FF'
      : poolType === 'AMM V3'
        ? '#DFCC28'
        : '#7BF179';
  const background =
    poolType === 'AMM V2'
      ? 'linear-gradient(105deg, rgba(88, 88, 88, 0.50) -76.37%, #121212 97.95%), linear-gradient(88deg, #FC72FF -53.68%, rgba(252, 114, 255, 0.00) 133.62%), #FFF'
      : poolType === 'AMM V3'
        ? 'linear-gradient(105deg, rgba(88, 88, 88, 0.50) -76.37%, #121212 97.95%), linear-gradient(88deg, #DFCC28 -53.68%, rgba(223, 204, 40, 0.00) 133.62%), #FFF'
        : 'linear-gradient(105deg, rgba(88, 88, 88, 0.50) -76.37%, #121212 97.95%), linear-gradient(90deg, #7BF179 -61.94%, rgba(123, 241, 121, 0.00) 246.32%), #1E1E1E';

  return (
    <Box
      sx={{
        px: 8,
        height: 24,
        typography: 'h6',
        lineHeight: '24px',
        borderRadius: 4,
        borderWidth: 1,
        borderColor,
        borderStyle: 'solid',
        background,
        color: 'text.primary',
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
          borderWidth: 1,
          borderColor: 'text.secondary',
          borderStyle: 'solid',
          background:
            'linear-gradient(105deg, rgba(88, 88, 88, 0.50) -76.37%, #121212 97.95%), linear-gradient(90deg, #FFF -61.94%, rgba(255, 255, 255, 0.00) 246.32%), #1E1E1E',
          color: 'text.primary',
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
