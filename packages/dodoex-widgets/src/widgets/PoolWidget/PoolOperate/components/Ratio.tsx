import {
  useTheme,
  alpha,
  Box,
  LoadingSkeleton,
  Tooltip,
  QuestionTooltip,
} from '@dodoex/components';
import { useState } from 'react';
import BigNumber from 'bignumber.js';
import { OperatePool } from '../types';
import {
  formatPercentageNumber,
  formatReadableNumber,
} from '../../../../utils/formatter';
import { Trans } from '@lingui/macro';
import { Switch } from '@dodoex/icons';
import { PoolApi } from '@dodoex/api';
import SlippageSetting, { useSlipper } from './SlippageSetting';

export default function Ratio({
  pool,
  addPortion,
  midPrice,
  shareOfPool,
  slipper,
  setSlipper,
  canOperate,
}: {
  pool?: OperatePool;
  addPortion?: BigNumber;
  midPrice?: BigNumber;
  shareOfPool?: string;
  slipper: ReturnType<typeof useSlipper>['slipper'];
  setSlipper: ReturnType<typeof useSlipper>['setSlipper'];
  canOperate?: boolean;
}) {
  const theme = useTheme();
  const [reserve, setReserve] = useState(false);
  let depositRatio = '';
  if (addPortion && midPrice) {
    const baseDepositPortion = new BigNumber(1).div(addPortion.plus(1));
    const quoteDepositPortion = new BigNumber(addPortion).div(
      addPortion.plus(1),
    );
    const baseDepositPortionToQuote = baseDepositPortion.times(midPrice);
    const total = baseDepositPortionToQuote.plus(quoteDepositPortion);
    depositRatio = addPortion
      ? `${formatPercentageNumber({
          input: baseDepositPortionToQuote.div(total),
        })} ${pool?.baseToken?.symbol} + ${formatPercentageNumber({
          input: quoteDepositPortion.div(total),
        })} ${pool?.quoteToken?.symbol}`
      : '';
  }

  const currentPriceLeftSymbol = reserve
    ? pool?.quoteToken?.symbol
    : pool?.baseToken?.symbol;
  const currentPriceRightValue =
    reserve && midPrice ? new BigNumber(1).div(midPrice) : midPrice;
  const currentPriceRightSymbol = reserve
    ? pool?.baseToken?.symbol
    : pool?.quoteToken?.symbol;
  return (
    <Box
      sx={{
        mt: 20,
        border: 'solid 1px',
        borderColor: 'border.main',
        borderRadius: 8,
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
        <LoadingSkeleton
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            ml: 8,
            overflow: 'hidden',
          }}
          loading={!pool}
          loadingProps={{
            width: 50,
          }}
        >
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
                  loading
                  loadingProps={{
                    width: 30,
                  }}
                  component="span"
                  sx={{
                    display: 'inline-block',
                  }}
                />
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: 4,
              width: 18,
              height: 18,
              cursor: 'pointer',
              backgroundColor: 'background.paperDarkContrast',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.primary, 0.04),
              },
            }}
            onClick={() => setReserve((prev) => !prev)}
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
      </Box>
      {pool?.type === 'AMMV2' ? (
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
            <Trans>Share Of Pool</Trans>
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
            {shareOfPool}
          </Box>
        </Box>
      ) : (
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
            <Trans>Deposit Ratio</Trans>
            <QuestionTooltip
              ml={4}
              title={
                <Trans>
                  Deposit ratio is determined by the current assets ratio in the
                  pool. The ratio does not represent the exchange price
                </Trans>
              }
            />
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
            {pool && PoolApi.utils.singleSideLp(pool.type) ? (
              <Trans>Any Ratio</Trans>
            ) : (
              <>
                <Tooltip title={depositRatio}>
                  <Box
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {depositRatio}
                  </Box>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 12,
          py: 4,
          height: 36,
          typography: 'body2',
          borderStyle: 'solid',
          borderWidth: theme.spacing(1, 0, 0),
          borderColor: 'border.main',
        }}
      >
        <Box
          sx={{
            color: 'text.secondary',
            whiteSpace: 'nowrap',
          }}
        >
          <Trans>Slippage Tolerance</Trans>
        </Box>
        <LoadingSkeleton
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            ml: 8,
            overflow: 'hidden',
          }}
          loading={!pool}
          loadingProps={{
            width: 50,
          }}
        >
          <SlippageSetting
            value={slipper}
            onChange={setSlipper}
            disabled={!canOperate}
            type={pool?.type}
          />
        </LoadingSkeleton>
      </Box>
    </Box>
  );
}
