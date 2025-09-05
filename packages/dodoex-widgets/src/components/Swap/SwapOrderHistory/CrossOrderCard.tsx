import { ChainId } from '@dodoex/api';
import {
  alpha,
  Box,
  Button,
  RotatingIcon,
  Skeleton,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { ArrowTopRightBorder } from '@dodoex/icons';
import React, { useMemo, useState } from 'react';
import { chainListMap } from '../../../constants/chainList';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useCrossSwapOrderList } from '../../../hooks/Swap/useCrossSwapOrderList';
import { getEtherscanPage } from '../../../utils';
import { formatReadableTimeDuration, getTimeText } from '../../../utils/time';
import { AddressWithLinkAndCopy } from '../../AddressWithLinkAndCopy';
import { RouteVision } from '../../Bridge/RouteVision';
import FoldBtn, {
  MobileTokenAndAmount,
  StatusAndTime,
  TokenAndAmount,
} from '../../CardWidgets';
import TokenLogo from '../../TokenLogo';
import { QuestionTooltip } from '../../Tooltip';
import { PriceWithToggle } from './PriceWithToggle';
import { RefundModal } from './RefundModal';

function Extend({
  showFold,
  isMobile,
  data,
}: {
  showFold: boolean;
  isMobile?: boolean;
  data: NonNullable<ReturnType<typeof useCrossSwapOrderList>['orderList'][0]>;
}) {
  const theme = useTheme();
  const itemList = useMemo(() => {
    const list = [
      {
        title: 'Total time spent',
        value:
          formatReadableTimeDuration({
            start: data.startTime ?? undefined,
            end: data.endTime ?? undefined,
          }) ?? '-',
      },
      {
        title: 'Pay',
        value: (
          <AddressWithLinkAndCopy
            address={data.fromAddress ?? ''}
            customChainId={data.routeData.fromChainId ?? ChainId.ZETACHAIN}
            showCopy
            truncate
            iconSpace={4}
            iconSize={14}
            size="small"
          />
        ),
      },
      {
        title: 'Receive',
        value: (
          <AddressWithLinkAndCopy
            address={data.toAddress ?? ''}
            customChainId={data.routeData.toChainId ?? ChainId.ZETACHAIN}
            showCopy
            truncate
            iconSpace={4}
            iconSize={14}
            size="small"
          />
        ),
      },
      {
        title: (
          <>
            Fill Gas (Destination gas)
            <QuestionTooltip onlyHover title="-" ml={0} />
          </>
        ),
        value: `$${data.fees?.find((fee: any) => fee.type === 'destinationFee')?.amountUSD ?? '-'}`,
      },
      {
        title: (
          <>
            Bridge Fee
            <QuestionTooltip onlyHover title="-" ml={0} />
          </>
        ),
        value: `$${data.fees?.find((fee: any) => fee.type === 'platformFee')?.amountUSD ?? '-'}`,
      },
    ];

    const svmRentFee = data.fees?.find((fee: any) => fee.type === 'svmRentFee');
    if (svmRentFee) {
      list.push({
        title: (
          <>
            Rent
            <QuestionTooltip
              onlyHover
              title="Rent (only first transaction of SPL token)"
              ml={0}
            />
          </>
        ),
        value: `$${svmRentFee.amountUSD}`,
      });
    }

    return list;
  }, [
    data.endTime,
    data.fees,
    data.fromAddress,
    data.routeData.fromChainId,
    data.routeData.toChainId,
    data.startTime,
    data.toAddress,
  ]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        p: showFold ? 16 : 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        background: `linear-gradient(0deg, ${theme.palette.background.skeleton} 0%, ${theme.palette.background.skeleton} 100%), ${theme.palette.background.paper}`,
        maxHeight: showFold ? 'auto' : 0,
        transition: 'all 300ms',
        overflow: 'hidden',
        [theme.breakpoints.up('tablet')]: {
          marginTop: '-4px',
          marginBottom: '4px',
          gap: 24,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          [theme.breakpoints.up('tablet')]: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: 20,
          },
        }}
      >
        {itemList.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                [theme.breakpoints.up('tablet')]: {
                  flexBasis: '20%',
                  flexGrow: 1,
                  flexShrink: 1,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  gap: 4,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: 'text.secondary',
                  typography: 'h6',
                }}
              >
                {item.title}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.primary',
                  typography: 'body2',
                }}
              >
                {item.value}
              </Box>
            </Box>
          );
        })}
      </Box>

      {data.routeData.fromChainId != null &&
        data.routeData.toChainId != null && (
          <>
            <Box
              sx={{
                height: '1px',
                width: '100%',
                backgroundColor: 'border.disabled',
              }}
            />

            <RouteVision
              route={{
                fromChainId: data.routeData.fromChainId,
                toChainId: data.routeData.toChainId,
                step: data.routeData.step,
              }}
              isMobile={isMobile}
            />
          </>
        )}
    </Box>
  );
}

function RefundsTX({
  data,
  refetch,
}: {
  data: NonNullable<ReturnType<typeof useCrossSwapOrderList>['orderList'][0]>;
  refetch: () => void;
}) {
  const theme = useTheme();

  const isWaitClaimRefund = data.subStatus === 'wait_claim_refund';
  const isRefundPending = data.subStatus === 'refund_pending';
  const isRefundSuccess = data.subStatus === 'refund_success';

  const { isMobile } = useWidgetDevice();

  const [claimConfirmOpen, setClaimConfirmOpen] = useState(false);

  if (isWaitClaimRefund) {
    return (
      <>
        <Button
          variant={Button.Variant.contained}
          size={Button.Size.small}
          color="error"
          onClick={() => {
            setClaimConfirmOpen(true);
          }}
          sx={{
            typography: 'h6',
            lineHeight: '16px',
            py: 6,
            minWidth: 98,
            height: 28,
          }}
        >
          Claim
        </Button>

        {claimConfirmOpen && (
          <RefundModal
            data={data}
            refetch={refetch}
            claimConfirmOpen={claimConfirmOpen}
            setClaimConfirmOpen={setClaimConfirmOpen}
          />
        )}
      </>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        [theme.breakpoints.up('tablet')]: {
          gap: 8,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          color: isRefundSuccess
            ? theme.palette.success.main
            : theme.palette.text.disabled,
          borderRadius: '50%',
          backgroundColor: isRefundSuccess
            ? alpha(theme.palette.success.main, 0.1)
            : theme.palette.background.tag,

          [theme.breakpoints.up('tablet')]: {
            width: 24,
            height: 24,
          },
        }}
      >
        {isRefundSuccess ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isMobile ? '12' : '16'}
            height={isMobile ? '12' : '16'}
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M12.7601 3.55554L5.92598 10.3896L3.24005 7.71406L1.77783 9.17628L5.92598 13.3244L14.2223 5.02813L12.7601 3.55554Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <RotatingIcon
            sx={{
              width: 12,
              color: theme.palette.text.disabled,
              [theme.breakpoints.up('tablet')]: {
                width: 16,
              },
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          [theme.breakpoints.up('tablet')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
          },
        }}
      >
        {data.refundChainId && data.refundHash ? (
          <AddressWithLinkAndCopy
            address={data.refundHash}
            customChainId={data.refundChainId}
            showCopy={false}
            truncate
            iconSpace={isMobile ? 2 : 8}
            sx={{
              typography: 'h6',
              [theme.breakpoints.up('tablet')]: {
                typography: 'body1',
                fontWeight: 600,
              },
            }}
            handleOpen={(evt) => {
              evt.stopPropagation();
              window.open(
                getEtherscanPage(
                  data.refundChainId as ChainId,
                  data.refundHash,
                  'tx',
                ),
              );
            }}
          />
        ) : isMobile ? (
          <Box
            sx={{
              typography: 'h6',
              [theme.breakpoints.up('tablet')]: {
                typography: 'body1',
                fontWeight: 600,
              },
            }}
          >
            -
          </Box>
        ) : (
          <Skeleton
            sx={{
              width: 90,
              height: 22,
            }}
          />
        )}
        <Box
          sx={{
            display: 'none',
            [theme.breakpoints.up('tablet')]: {
              display: 'block',
              typography: 'h6',
              color: theme.palette.text.secondary,
            },
          }}
        >
          {isRefundSuccess ? 'Refunded to this address.' : 'Refund pending…'}
        </Box>
        {isRefundSuccess ? null : (
          <Box
            sx={{
              typography: 'h6',
              color: theme.palette.text.secondary,
              [theme.breakpoints.up('tablet')]: {
                display: 'none',
              },
            }}
          >
            (Refund pending…)
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function CrossOrderCard({
  data,
  isMobile,
  isErrorRefund,
  refetch,
}: {
  data: NonNullable<ReturnType<typeof useCrossSwapOrderList>['orderList'][0]>;
  isMobile: boolean;
  isErrorRefund: boolean;
  refetch: () => void;
}) {
  const theme = useTheme();

  const { statusText, statusColor, statusAlphaColor } = useMemo(() => {
    let statusText = 'Loading';
    let statusColor = theme.palette.text.primary;
    let statusAlphaColor: undefined | number;

    switch (data.status) {
      case 'pending':
        statusText = 'Pending';
        statusColor = theme.palette.text.secondary;
        break;
      case 'success':
        statusText = 'Succeeded';
        statusColor = theme.palette.success.main;
        break;
      case 'failure_revert':
        statusText = 'Swap failed';
        statusColor = theme.palette.error.main;
        break;
      case 'abort':
        statusText = 'Aborted';
        statusColor = theme.palette.error.main;
        break;

      default:
        break;
    }

    return {
      statusText,
      statusColor,
      statusAlphaColor,
    };
  }, [
    data.status,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);

  const [showFold, setShowFold] = React.useState(false);
  const time = data.createdAt ? getTimeText(new Date(data.createdAt)) : '-';

  if (isMobile) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 8,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 16,
            gap: 16,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <TokenLogo
                  width={24}
                  height={24}
                  address={data.fromToken?.address}
                  chainId={data.fromToken?.chainId}
                />
                <Box
                  component="svg"
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  <path
                    d="M7.575 8.625L4.5 11.7L5.625 12.75L9.75 8.625L5.625 4.5L4.5 5.55L7.575 8.625ZM12.15 8.625L9.075 11.7L10.125 12.75L14.25 8.625L10.125 4.5L9.075 5.55L12.15 8.625Z"
                    fill="currentColor"
                  />
                </Box>
                <TokenLogo
                  width={24}
                  height={24}
                  address={data.toToken?.address}
                  chainId={data.toToken?.chainId}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <StatusAndTime
                  isMobile={false}
                  statusText={statusText}
                  statusColor={statusColor}
                  alphaColor={statusAlphaColor}
                >
                  {data.status !== 'success' && (
                    <QuestionTooltip
                      onlyHover
                      title={data.subStatus}
                      ml={4}
                      sx={{
                        color: statusColor,
                      }}
                    />
                  )}
                </StatusAndTime>
              </Box>
            </Box>

            <Box
              sx={{
                typography: 'h6',
                color: theme.palette.text.secondary,
              }}
            >
              {time}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <MobileTokenAndAmount
                token={data.fromToken}
                amount={data.fromAmount}
                canAddMetamask={false}
                title="Pay"
                linkVisible={false}
              />

              <MobileTokenAndAmount
                token={data.toToken}
                amount={data.toAmount}
                canAddMetamask={
                  data.fromToken &&
                  (chainListMap.get(data.fromToken.chainId)?.isEVMChain ??
                    false)
                }
                title="Receive"
                linkVisible={false}
              />

              {isErrorRefund && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      typography: 'h6',
                      fontWeight: 500,
                      color: 'text.primary',
                    }}
                  >
                    Refunds TX:
                  </Box>
                  <RefundsTX data={data} refetch={refetch} />
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                borderRadius: 8,
                border: `1px solid ${theme.palette.border.main}`,
              }}
            >
              <FoldBtn
                show={showFold}
                onClick={() => setShowFold((prev) => !prev)}
                sx={{
                  color: 'text.secondary',
                }}
              />
            </Box>
          </Box>
        </Box>

        <Extend showFold={showFold} data={data} isMobile={isMobile} />
      </Box>
    );
  }

  return (
    <>
      <tr>
        <Box
          component="td"
          sx={{
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: showFold ? 0 : 8,
          }}
        >
          {data.fromToken && (
            <TokenAndAmount
              token={data.fromToken}
              amount={data.fromAmount ?? ''}
              showChain
            />
          )}
        </Box>
        <td>
          {data.toToken && (
            <TokenAndAmount
              token={data.toToken}
              amount={data.toAmount ?? ''}
              showChain
              canAddMetamask={
                chainListMap.get(data.toToken.chainId)?.isEVMChain ?? false
              }
            />
          )}
        </td>
        <td>
          <StatusAndTime
            isMobile={isMobile}
            statusText={statusText}
            statusColor={statusColor}
            alphaColor={statusAlphaColor}
            time={time}
          >
            {data.status !== 'success' && (
              <QuestionTooltip
                onlyHover
                title={data.subStatus}
                ml={4}
                sx={{
                  color: statusColor,
                }}
              />
            )}
          </StatusAndTime>
        </td>
        {isErrorRefund ? (
          <td>
            <RefundsTX data={data} refetch={refetch} />
          </td>
        ) : (
          <td>
            {data.fromToken && data.toToken && (
              <PriceWithToggle
                fromToken={data.fromToken}
                toToken={data.toToken}
                fromTokenPrice={data.fromTokenPrice}
                toTokenPrice={data.toTokenPrice}
              />
            )}
          </td>
        )}

        <Box
          component="td"
          sx={{
            borderTopRightRadius: 8,
            borderBottomRightRadius: showFold ? 0 : 8,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            {!isErrorRefund && data.subStatus === 'refund_success' && (
              <>
                <Tooltip title="refund TX" placement="top" onlyHover>
                  <Box
                    component="a"
                    href={
                      data.refundChainId && data.refundHash
                        ? getEtherscanPage(
                            data.refundChainId,
                            data.refundHash,
                            'tx',
                          )
                        : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      p: 3,
                      color: 'primary.main',
                      display: 'flex',
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
                  </Box>
                </Tooltip>
                <Box
                  sx={{
                    height: 16,
                    width: '1px',
                    backgroundColor: 'border.main',
                  }}
                />
              </>
            )}
            <FoldBtn
              show={showFold}
              onClick={() => setShowFold((prev) => !prev)}
            />
          </Box>
        </Box>
      </tr>
      <tr>
        <Box
          component="td"
          colSpan={5}
          sx={{
            p: '0 !important',
            backgroundColor: `transparent !important`,
          }}
        >
          <Extend showFold={showFold} data={data} />
        </Box>
      </tr>
    </>
  );
}
