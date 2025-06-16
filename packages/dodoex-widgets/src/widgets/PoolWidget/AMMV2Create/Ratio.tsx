import {
  useTheme,
  alpha,
  Box,
  LoadingSkeleton,
  Tooltip,
  BoxProps,
} from '@dodoex/components';
import { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Trans } from '@lingui/macro';
import { Switch } from '@dodoex/icons';
import { TokenInfo } from '../../../hooks/Token';
import { formatReadableNumber } from '../../../utils/formatter';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';

export function RatioPrice({
  baseToken,
  quoteToken,
  midPrice,
  loading,
  disabled,
}: {
  baseToken?: TokenInfo;
  quoteToken?: TokenInfo;
  midPrice?: BigNumber | null;
  loading?: boolean;
  disabled?: boolean;
}) {
  const theme = useTheme();
  const [reserve, setReserve] = useState(false);

  const currentPriceLeftSymbol = reserve
    ? quoteToken?.symbol
    : baseToken?.symbol;
  const currentPriceRightValue =
    reserve && midPrice ? new BigNumber(1).div(midPrice) : midPrice;
  const currentPriceRightSymbol = reserve
    ? baseToken?.symbol
    : quoteToken?.symbol;

  return (
    <LoadingSkeleton
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontWeight: 600,
        overflow: 'hidden',
      }}
      loading={loading}
      loadingProps={{
        width: 50,
      }}
    >
      {!baseToken || !quoteToken ? (
        '-'
      ) : (
        <Tooltip
          title={`1 ${currentPriceLeftSymbol} = ${
            currentPriceRightValue
              ? formatReadableNumber({
                  input: currentPriceRightValue,
                })
              : ''
          } ${currentPriceRightSymbol}`}
        >
          {!midPrice ? (
            <Box>
              {`1 ${currentPriceLeftSymbol} = `}
              <LoadingSkeleton
                loading={loading}
                loadingProps={{
                  width: 30,
                }}
                component="span"
                sx={{
                  display: 'inline-block',
                }}
              >
                -
              </LoadingSkeleton>
              {` ${currentPriceRightSymbol}`}
            </Box>
          ) : (
            <Box
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {`1 ${currentPriceLeftSymbol} = ${
                currentPriceRightValue
                  ? formatReadableNumber({
                      input: currentPriceRightValue,
                    })
                  : ''
              } ${currentPriceRightSymbol}`}
            </Box>
          )}
        </Tooltip>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ml: 4,
          width: 18,
          height: 18,
          backgroundColor: 'background.paperDarkContrast',
          borderRadius: '50%',
          ...(!disabled && {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: alpha(theme.palette.text.primary, 0.04),
            },
          }),
        }}
        onClick={() => {
          if (disabled) return;
          setReserve((prev) => !prev);
        }}
      >
        <Box
          component={Switch}
          sx={{
            width: 18,
            height: 18,
          }}
        />
      </Box>
    </LoadingSkeleton>
  );
}

export default function Ratio({
  baseToken,
  quoteToken,
  loading,
  midPrice,
  shareOfPool,
  sx,
  slippage,
  setSlippage,
}: {
  baseToken?: TokenInfo;
  quoteToken?: TokenInfo;
  loading?: boolean;
  midPrice?: BigNumber | null;
  shareOfPool?: string;
  sx?: BoxProps['sx'];
  slippage: ReturnType<typeof useSlipper>['slipper'];
  setSlippage: ReturnType<typeof useSlipper>['setSlipper'];
}) {
  const theme = useTheme();
  const disabled = !baseToken || !quoteToken;
  const type = 'AMMV2';

  return (
    <Box
      sx={{
        mt: 20,
        border: 'solid 1px',
        borderColor: 'border.main',
        borderRadius: 8,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 12,
          py: 4,
          height: 36,
          typography: 'body2',
        }}
      >
        <Box
          sx={{
            color: 'text.secondary',
            whiteSpace: 'nowrap',
          }}
        >
          <Trans>Current Price</Trans>
        </Box>
        <RatioPrice
          baseToken={baseToken}
          quoteToken={quoteToken}
          loading={loading}
          disabled={disabled}
          midPrice={midPrice}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 12,
          py: 4,
          minHeight: 36,
          typography: 'body2',
          borderStyle: 'solid',
          borderWidth: theme.spacing(1, 0, 0),
          borderColor: 'border.main',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            whiteSpace: 'nowrap',
          }}
        >
          <Trans>Share of pool</Trans>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            textAlign: 'right',
            ml: 8,
            overflow: 'hidden',
          }}
        >
          <LoadingSkeleton
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              overflow: 'hidden',
            }}
            loading={loading}
            loadingProps={{
              width: 50,
            }}
          >
            {shareOfPool ? shareOfPool : '-%'}
          </LoadingSkeleton>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 12,
          py: 4,
          minHeight: 36,
          typography: 'body2',
          borderStyle: 'solid',
          borderWidth: theme.spacing(1, 0, 0),
          borderColor: 'border.main',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            whiteSpace: 'nowrap',
          }}
        >
          <Trans>Slippage Tolerance</Trans>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            textAlign: 'right',
            ml: 8,
            overflow: 'hidden',
          }}
        >
          <LoadingSkeleton
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              overflow: 'hidden',
            }}
            loading={loading}
            loadingProps={{
              width: 50,
            }}
          >
            <SlippageSetting
              value={slippage}
              onChange={setSlippage}
              disabled={disabled}
              type={type}
            />
          </LoadingSkeleton>
        </Box>
      </Box>
    </Box>
  );
}
