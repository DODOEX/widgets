import { Box, ButtonBase, Tooltip, useTheme } from '@dodoex/components';
import { GasFee as FeeIcon, Time as TimeIcon } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { BridgeRouteI } from '../../hooks/Bridge';
import { useFeeList } from '../../hooks/Bridge/useFeeList';
import { formatTokenAmountNumber } from '../../utils/formatter';
import { formatReadableTimeDuration } from '../../utils/time';
import { CompareRoute } from './CompareRoute';
import { RouteVisionModal } from './RouteVisionModal';

export default function BridgeRouteShortCard({
  route,
}: {
  route?: BridgeRouteI;
}) {
  const theme = useTheme();
  const [isReverse, setIsReverse] = useState(false);

  const feeList = useFeeList({ fees: route?.fees ?? [] });

  if (!route) return null;
  const {
    product,
    executionDuration,
    feeUSD,
    fromAmount,
    fromToken,
    fromChainId,
    toTokenAmount,
    toToken,
    toChainId,
    step: { includedSteps },
  } = route;

  const baseToken = isReverse ? toToken : fromToken;
  const quoteToken = isReverse ? fromToken : toToken;

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <Box
          sx={{
            px: 11,
            py: 7,
            borderRadius: 12,
            border: `solid 1px ${theme.palette.border.main}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              typography: 'body2',
              color: theme.palette.text.primary,
              fontWeight: 600,
              gap: 6,
            }}
          >
            <span>1&nbsp;{baseToken.symbol}</span>
            <span style={{ color: theme.palette.text.secondary }}>=</span>
            <span>
              {formatTokenAmountNumber({
                input: isReverse
                  ? new BigNumber(fromAmount).div(toTokenAmount)
                  : toTokenAmount.div(fromAmount),
                decimals: quoteToken?.decimals,
              })}
              &nbsp;
              {quoteToken.symbol}
            </span>
            <Box
              component={ButtonBase}
              onClick={(evt) => {
                evt.stopPropagation();
                setIsReverse((prev) => !prev);
              }}
              sx={{
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  color: theme.palette.text.secondary,
                },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="9"
                  fill="currentColor"
                  fillOpacity="0.1"
                />
                <path
                  d="M9.5 6.5H4.5V8H13.5L9.5 4.25V6.5ZM8.25 13.75V11.5H13.5V10H4.5L8.25 13.75Z"
                  fill="currentColor"
                  fillOpacity="0.5"
                />
              </svg>
            </Box>
          </Box>

          <RouteVisionModal route={route} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            px: 11,
            py: 7,
            borderRadius: 12,
            border: `solid 1px ${theme.palette.border.main}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Box
              sx={{
                typography: 'body2',
                fontWeight: 600,
              }}
            >
              Cheapest Fee
            </Box>
            <Tooltip
              onlyHover
              placement="top"
              title={
                <Box
                  sx={{
                    minWidth: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: 12,
                    typography: 'h6',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {feeList.map((fee) => {
                    return (
                      <Box
                        key={fee.key}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: 150,
                          }}
                        >
                          {fee.title}
                        </Box>
                        {fee.isFree ? (
                          <Box
                            sx={{
                              color: theme.palette.primary.main,
                            }}
                          >
                            Free
                          </Box>
                        ) : fee.value !== null ? (
                          <Box
                            sx={{
                              color: theme.palette.text.primary,
                            }}
                          >
                            ~${fee.value}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              color: theme.palette.text.primary,
                            }}
                          >
                            -
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              }
            >
              <Box
                sx={{
                  ml: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  px: 8,
                  py: 4,
                  border: `solid 1px ${theme.palette.border.main}`,
                  borderRadius: 12,
                }}
              >
                <FeeIcon
                  style={{
                    color: theme.palette.text.secondary,
                    width: 14,
                    height: 14,
                  }}
                />
                <Box
                  sx={{
                    typography: 'h6',
                    lineHeight: '16px',
                  }}
                >
                  {feeUSD !== null ? `$${feeUSD}` : '-'}
                </Box>
              </Box>
            </Tooltip>
            <Tooltip
              onlyHover
              placement="top"
              title={<Trans>Estimated transaction time</Trans>}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  px: 8,
                  py: 4,
                  border: `solid 1px ${theme.palette.border.main}`,
                  borderRadius: 12,
                  typography: 'h6',
                }}
              >
                <TimeIcon
                  style={{
                    color: theme.palette.text.secondary,
                    width: 14,
                    height: 14,
                  }}
                />
                <Box
                  sx={{
                    typography: 'h6',
                    lineHeight: '16px',
                  }}
                >
                  {executionDuration !== null
                    ? formatReadableTimeDuration({
                        start: Date.now(),
                        end: Date.now() + executionDuration * 1000,
                      })
                    : '-'}
                </Box>
              </Box>
            </Tooltip>
          </Box>

          <CompareRoute feeUSD={feeUSD} />
        </Box>
      </Box>
    </>
  );
}
