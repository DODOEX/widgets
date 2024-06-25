import {
  Box,
  Accordion,
  AccordionItem,
  Input,
  HoverOpacity,
  useTheme,
} from '@dodoex/components';
import {
  DetailBorder,
  CaretUp,
  ArrowTopRightBorder,
  DoneFilled,
  Edit,
} from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useMemo, useState } from 'react';
import { chainListMap } from '../../../constants/chainList';
import { ChainId } from '@dodoex/api';
import { BridgeRouteI } from '../../../hooks/Bridge/useFetchRoutePriceBridge';
import {
  formatReadableNumber,
  getEtherscanPage,
  truncatePoolAddress,
} from '../../../utils';
import { formatReadableTimeDuration } from '../../../utils/time';
import { QuestionTooltip } from '../../Tooltip';
import { RouteSteps } from './orderInfoModal/RouteSteps';

export default function BridgeSummaryDetail({
  route,
}: {
  route: BridgeRouteI;
}) {
  const theme = useTheme();
  const fromChain = chainListMap.get(route.fromChainId as ChainId);
  // const [isEditFromAddress, setIsEditFromAddress] = useState(false);
  // const [fromAddress, setFromAddress] = useState(route.fromAddress);
  const fromAddressScanUrl = useMemo(() => {
    return getEtherscanPage(route.fromChainId, route.fromAddress, 'address');
  }, [route.fromAddress, route.fromChainId]);
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
                  {fromChain ? (
                    <Box
                      component={fromChain.logo}
                      sx={{
                        width: 18,
                        height: 18,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  <Box
                    sx={{
                      display: 'inline-block',
                      mx: 6,
                      width: '1px',
                      height: 12,
                      backgroundColor: 'border.main',
                    }}
                  />
                  {/* {isEditFromAddress ? (
                <>
                  <Input
                    value={fromAddress}
                    onChange={(evt) => setFromAddress(evt.target.value)}
                    sx={{
                      width: '37%',
                    }}
                  />
                  <HoverOpacity
                    component={DoneFilled}
                    weak
                    sx={{
                      ml: 6,
                      width: 18,
                      height: 18,
                      cursor: 'pointer',
                      '& circle': {
                        fill: theme.palette.secondary.main,
                      },
                    }}
                    onClick={() => {
                      setIsEditFromAddress(false);
                    }}
                  />
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      typography: 'body2',
                      fontWeight: 600,
                    }}
                  >
                    {truncatePoolAddress(route.fromAddress)}
                  </Box>
                  <HoverOpacity
                    component={Edit}
                    weak
                    sx={{
                      ml: 6,
                      width: 18,
                      height: 18,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setIsEditFromAddress(true);
                    }}
                  />
                </>
              )} */}
                  <Box
                    sx={{
                      typography: 'body2',
                      fontWeight: 600,
                    }}
                  >
                    {truncatePoolAddress(route.fromAddress)}
                  </Box>
                  <HoverOpacity
                    component="a"
                    // @ts-ignore
                    href={fromAddressScanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      ml: 6,
                      width: 18,
                      height: 18,
                      color: 'text.secondary',
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
              {route.feeUSD ? (
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
                    <Trans>Fee</Trans>
                  </Box>
                  <Box
                    sx={{
                      typography: 'body2',
                    }}
                  >
                    ${formatReadableNumber({ input: route.feeUSD })}
                  </Box>
                </Box>
              ) : (
                ''
              )}
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
            <RouteSteps route={route} />
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
}
