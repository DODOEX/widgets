import { Box, Button, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { PositionInfoLayout } from '@raydium-io/raydium-sdk-v2';
import { TokenInfo } from '../../../../hooks/Token/type';
import { formatTokenAmountNumber } from '../../../../utils';
import { useDerivedPositionInfo } from '../hooks/useDerivedPositionInfo';
import useIsTickAtLimit from '../hooks/useIsTickAtLimit';
import { FeeAmount } from '../sdks/v3-sdk/constants';
import { Bound } from '../types';
import { formatTickPrice } from '../utils/formatTickPrice';
import { InRangeDot } from './InRangeDot';

export interface PositionViewCardProps {
  position: ReturnType<typeof PositionInfoLayout.decode>;
  mintA: TokenInfo | undefined;
  mintB: TokenInfo | undefined;
  feeAmount: FeeAmount;
  onClickManage: () => void;
}

export const PositionViewCard = ({
  position,
  mintA,
  mintB,
  feeAmount,
  onClickManage,
}: PositionViewCardProps) => {
  const theme = useTheme();

  const { positionInfo, pool } = useDerivedPositionInfo({
    position,
  });

  const tickAtLimit = useIsTickAtLimit(
    feeAmount,
    position.tickLower,
    position.tickUpper,
  );

  const priceLower = positionInfo?.priceLower;
  const priceUpper = positionInfo?.priceUpper;

  // check if price is within range
  const outOfRange: boolean = pool?.computePoolInfo
    ? pool.computePoolInfo.tickCurrent < position.tickLower ||
      pool.computePoolInfo.tickCurrent >= position.tickUpper
    : false;

  const price = pool?.poolInfo.price;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 24,
        px: 20,
        py: 20,
        pb: 12,
        borderRadius: 12,
        backgroundColor: theme.palette.background.paperContrast,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            typography: 'h5',
            color: theme.palette.text.primary,
          }}
        >
          <Box>
            <>
              <span>
                {formatTickPrice({
                  price: priceLower,
                  atLimit: tickAtLimit,
                  direction: Bound.LOWER,
                })}
                &nbsp;
              </span>
              {mintB?.symbol}
            </>
          </Box>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
          >
            <path
              d="M15.75 9.50293L12.75 12.5029L11.7 11.4529L12.8813 10.2529L5.11875 10.2529L6.3 11.4529L5.25 12.5029L2.25 9.50293L5.25 6.50293L6.31875 7.55293L5.11875 8.75293L12.8813 8.75293L11.7 7.55293L12.75 6.50293L15.75 9.50293Z"
              fill="currentColor"
              fillOpacity="0.5"
            />
          </svg>
          <Box>
            <>
              <span>
                {formatTickPrice({
                  price: priceUpper,
                  atLimit: tickAtLimit,
                  direction: Bound.UPPER,
                })}
                &nbsp;
              </span>
              {mintB?.symbol}
            </>
          </Box>
          {/* <Box
            component="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 19"
            fill="none"
            sx={{
              ml: 4,
              width: 18,
              height: 19,
            }}
          >
            <circle
              cx="9"
              cy="9.5"
              r="9"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <path
              d="M9.5 7H4.5V8.5H13.5L9.5 4.75V7ZM8.25 14.25V12H13.5V10.5H4.5L8.25 14.25Z"
              fill="currentColor"
              fillOpacity="0.5"
            />
          </Box> */}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <InRangeDot outOfRange={outOfRange} />

          <Box
            sx={{
              typography: 'h6',
              color: theme.palette.text.secondary,
            }}
          >
            Current price:&nbsp;
            {formatTokenAmountNumber({
              input: price,
            })}
            &nbsp;{mintB?.symbol}&nbsp;per&nbsp;
            {mintA?.symbol}
          </Box>
        </Box>
      </Box>
      <Button
        variant={Button.Variant.outlined}
        size={Button.Size.small}
        fullWidth
        onClick={onClickManage}
      >
        {t`Manage`}
      </Button>
    </Box>
  );
};
