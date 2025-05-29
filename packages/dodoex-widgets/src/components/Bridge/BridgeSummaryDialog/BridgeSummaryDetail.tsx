import {
  Accordion,
  AccordionItem,
  Box,
  ButtonBase,
  HoverOpacity,
  useTheme,
} from '@dodoex/components';
import { ArrowTopRightBorder, CaretUp, DetailBorder } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { chainListMap } from '../../../constants/chainList';
import { useFeeList } from '../../../hooks/Bridge/useFeeList';
import { BridgeRouteI } from '../../../hooks/Bridge/useFetchRoutePriceBridge';
import { getEtherscanPage, truncatePoolAddress } from '../../../utils';
import { formatReadableTimeDuration } from '../../../utils/time';
import { QuestionTooltip } from '../../Tooltip';
import { CompareRoute } from '../CompareRoute';
import { RouteVision } from '../RouteVision';

export default function BridgeSummaryDetail({
  route,
}: {
  route: BridgeRouteI;
}) {
  const theme = useTheme();
  const fromChain = chainListMap.get(route.fromChainId);
  const toChain = chainListMap.get(route.toChainId);

  const [feeListActive, setFeeListActive] = useState(false);
  const [feeComparisonActive, setFeeComparisonActive] = useState(false);

  const feeList = useFeeList({ fees: route.fees });

  return (
    <Box>
      <Box
        sx={{
          py: 12,
          borderStyle: 'solid',
          borderWidth: theme.spacing(1, 0, 0),
          borderColor: theme.palette.border.main,
        }}
      >
        <Accordion>
          <AccordionItem
            initialEntered
            sx={{
              '& button.active svg': {
                transform: 'rotate(0)',
              },
            }}
            header={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  typography: 'body2',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.primary',
                  }}
                >
                  <Box
                    component={DetailBorder}
                    sx={{
                      mr: 6,
                      width: 18,
                      height: 18,
                    }}
                  />
                  <Trans>Detail</Trans>
                </Box>
                <Box
                  component={CaretUp}
                  sx={{
                    width: 12,
                    height: 12,
                    color: 'text.secondary',
                    transform: 'rotate(180deg)',
                    transition: 'transform 0.2s linear',
                  }}
                />
              </Box>
            }
          >
            <Box
              sx={{
                mt: 16,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    color: 'text.secondary',
                    flexShrink: 0,
                  }}
                >
                  <Trans>Send to:</Trans>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  {toChain ? (
                    <Box
                      component={toChain.logo}
                      sx={{
                        width: 18,
                        height: 18,
                      }}
                    />
                  ) : null}
                  <Box
                    sx={{
                      display: 'inline-block',
                      mx: 6,
                      width: '1px',
                      height: 12,
                      backgroundColor: 'border.main',
                    }}
                  />
                  <Box
                    sx={{
                      typography: 'body2',
                      fontWeight: 600,
                    }}
                  >
                    {truncatePoolAddress(route.toAddress)}
                  </Box>
                  <HoverOpacity
                    component="a"
                    // @ts-ignore
                    href={getEtherscanPage(
                      route.toChainId,
                      route.toAddress,
                      'address',
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      ml: 6,
                      width: 18,
                      height: 18,
                      color: 'text.secondary',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component={ArrowTopRightBorder}
                      sx={{
                        width: 18,
                        height: 18,
                      }}
                    />
                  </HoverOpacity>
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    typography: 'body2',
                    color: 'text.secondary',
                    flexShrink: 0,
                  }}
                >
                  <Trans>Total fees</Trans>
                </Box>

                <Box
                  component={ButtonBase}
                  onClick={() => setFeeListActive(!feeListActive)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 4,
                    typography: 'body2',
                    color: 'text.primary',
                  }}
                >
                  {route.feeUSD ? `~$${route.feeUSD}` : '-'}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M3.75 11.2663L4.98375 12.5L9 8.4925L13.0162 12.5L14.25 11.2663L9 6.01625L3.75 11.2663Z"
                      fill="currentColor"
                      fillOpacity="0.5"
                    />
                  </svg>
                </Box>
              </Box>

              {feeListActive &&
                feeList.map((fee) => {
                  return (
                    <Box
                      key={fee.title}
                      sx={{
                        mt: 8,
                        pl: 22,
                        pr: 22,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'text.secondary',
                        typography: 'body2',
                        position: 'relative',
                      }}
                    >
                      <Box
                        component="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="25"
                        viewBox="0 0 10 25"
                        fill="none"
                        sx={{
                          width: 10,
                          height: 25,
                          position: 'absolute',
                          left: 10,
                          bottom: 10,
                        }}
                      >
                        <path
                          d="M9 24L2 24C1.44772 24 1 23.5523 1 23L1 1"
                          stroke="currentColor"
                          strokeOpacity="0.5"
                          strokeLinecap="round"
                          strokeDasharray="2 2"
                        />
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
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

              <Box
                sx={{
                  mt: 8,
                  mb: feeComparisonActive ? 8 : 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    typography: 'body2',
                    color: 'text.secondary',
                    flexShrink: 0,
                    background:
                      'linear-gradient(97deg, rgba(255, 255, 255, 0.50) -19.62%, #7BF179 97.87%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Fee comparison
                </Box>
                <Box
                  component={ButtonBase}
                  onClick={() => setFeeComparisonActive(!feeComparisonActive)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 4,
                    typography: 'body2',
                    color: 'text.primary',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M3.75 11.2663L4.98375 12.5L9 8.4925L13.0162 12.5L14.25 11.2663L9 6.01625L3.75 11.2663Z"
                      fill="currentColor"
                      fillOpacity="0.5"
                    />
                  </svg>
                </Box>
              </Box>

              {feeComparisonActive && <CompareRoute feeUSD={route.feeUSD} />}

              <Box
                sx={{
                  mt: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    typography: 'body2',
                    color: 'text.secondary',
                    flexShrink: 0,
                  }}
                >
                  <Trans>Slippage</Trans>
                  <QuestionTooltip
                    onlyHover
                    title={
                      <Trans>
                        Attention: High slippage tolerance will increase the
                        success rate of transaction, but might not get the best
                        quote.
                      </Trans>
                    }
                    ml={6}
                  />
                </Box>
                <Box
                  sx={{
                    typography: 'body2',
                  }}
                >
                  {route.slippage * 100}%
                </Box>
              </Box>
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
      <Box
        sx={{
          py: 12,
          borderStyle: 'solid',
          borderWidth: theme.spacing(1, 0, 0),
          borderColor: theme.palette.border.main,
        }}
      >
        <Accordion>
          <AccordionItem
            initialEntered
            sx={{
              '& button.active svg': {
                transform: 'rotate(0)',
              },
            }}
            header={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  typography: 'body2',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.primary',
                  }}
                >
                  <Box
                    component={DetailBorder}
                    sx={{
                      mr: 6,
                      width: 18,
                      height: 18,
                    }}
                  />
                  <Trans>Estimated Time</Trans>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.primary',
                    typography: 'body2',
                  }}
                >
                  {route.executionDuration
                    ? formatReadableTimeDuration({
                        start: Date.now(),
                        end: Date.now() + route.executionDuration * 1000,
                      })
                    : '-'}
                  <Box
                    component={CaretUp}
                    sx={{
                      ml: 6,
                      width: 12,
                      height: 12,
                      color: 'text.secondary',
                      transform: 'rotate(180deg)',
                      transition: 'transform 0.2s linear',
                    }}
                  />
                </Box>
              </Box>
            }
          >
            <RouteVision route={route} />
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
}
