import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { ArrowRight, Switch } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import React from 'react';
import { AddressWithLinkAndCopy } from '../../../../../components/AddressWithLinkAndCopy';
import { CardStatus } from '../../../../../components/CardWidgets';
import TokenLogo from '../../../../../components/TokenLogo';
import { useWalletInfo } from '../../../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../../../hooks/style/useWidgetDevice';
import {
  formatPercentageNumber,
  formatReadableNumber,
} from '../../../../../utils';
import { usePoolDetail } from '../../../hooks/usePoolDetail';
import { poolApi } from '../../../utils';
import { usePoolSwapList } from '../../hooks/usePoolSwapList';

export function formatDateTimeStr(timestamp?: number, short?: boolean): string {
  if (!timestamp) {
    return '';
  }
  const dateTime = dayjs(timestamp);
  if (dateTime.isValid()) {
    if (short) {
      return dateTime.format('YYYY/MM/DD');
    }
    return dateTime.format('YYYY/MM/DD HH:mm:ss');
  }
  return '';
}

function PriceWrapper({
  amountOut,
  amountIn,
  fromTokenSymbol,
  toTokenSymbol,
}: {
  amountOut: number;
  amountIn: number;
  fromTokenSymbol: string;
  toTokenSymbol: string;
}) {
  const [reverse, setReverse] = React.useState(false);
  const price = formatReadableNumber({
    input: amountIn / amountOut,
    showDecimals: 2,
  });
  const reversePrice = formatReadableNumber({
    input: amountOut / amountIn,
    showDecimals: 2,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      1&nbsp;{reverse ? toTokenSymbol : fromTokenSymbol}&nbsp;=&nbsp;
      {reverse ? price : reversePrice}&nbsp;
      {reverse ? fromTokenSymbol : toTokenSymbol}
      <Box
        sx={{
          ml: 10,
          width: 16,
          height: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: 'background.paperContrast',
          borderRadius: '50%',
        }}
        onClick={() => setReverse((prev) => !prev)}
      >
        <Box component={Switch} />
      </Box>
    </Box>
  );
}

export default function SwapsTable({
  poolDetail,
}: {
  poolDetail: ReturnType<typeof usePoolDetail>['poolDetail'];
}) {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();
  const { account, chainId } = useWalletInfo();
  const feeRateQuery = useQuery(
    poolApi.getFeeRateQuery(
      poolDetail?.chainId,
      poolDetail?.address,
      poolDetail?.type,
      account,
    ),
  );
  const mtFeeRate = feeRateQuery.data?.mtFeeRate;
  const lpFeeRate = feeRateQuery.data?.lpFeeRate;
  const totalFeeRate = mtFeeRate?.plus(lpFeeRate ?? 0);

  const swapListQuery = usePoolSwapList({
    address: poolDetail?.address,
    chainId: poolDetail?.chainId,
  });

  const [page, setPage] = React.useState(1);
  const pageSize = isMobile ? 4 : 8;
  const currentCount = page * pageSize;
  const swapListOrigin = swapListQuery.swapList ?? [];
  const hasMore = currentCount < swapListOrigin.length;
  const swapList = swapListOrigin.slice(0, currentCount);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardStatus
        refetch={swapListQuery.error ? swapListQuery.refetch : undefined}
        loading={swapListQuery.isLoading}
        empty={!swapList?.length}
      >
        {!!swapList?.length && (
          <Box>
            <Box
              sx={{
                overflowX: 'auto',
                minHeight: 244,
              }}
            >
              <Box
                component="table"
                sx={{
                  minWidth: '100%',
                }}
              >
                <Box
                  component="thead"
                  sx={{
                    position: 'sticky',
                    top: 0,
                  }}
                >
                  <Box
                    component="tr"
                    sx={{
                      '& th': {
                        p: 24,
                        borderBottomWidth: 1,
                        typography: 'body1',
                        lineHeight: 1,
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    <Box component="th">
                      <Trans>Time</Trans>
                    </Box>
                    <Box component="th">
                      <Trans>Trader</Trans>
                    </Box>
                    <Box component="th">
                      <Trans>Paid</Trans>
                    </Box>
                    <Box component="th">
                      <Trans>Received</Trans>
                    </Box>
                    <Box component="th">
                      <Trans>Price</Trans>
                    </Box>
                    <Box
                      component="th"
                      sx={{
                        '&&': {
                          textAlign: 'right',
                        },
                      }}
                    >
                      <Trans>Fee Rate</Trans>
                    </Box>
                    <Box
                      component="th"
                      sx={{
                        '&&': {
                          textAlign: 'right',
                        },
                      }}
                    >
                      <Trans>Fee</Trans>
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {swapList?.map((item) => {
                    return (
                      <Box
                        component="tr"
                        key={item.id}
                        sx={{
                          '& td': {
                            px: 24,
                            py: 20,
                            whiteSpace: 'nowrap',
                          },
                        }}
                      >
                        <td>{formatDateTimeStr(item.timestamp * 1000)}</td>
                        <td>
                          <AddressWithLinkAndCopy
                            address={item.from}
                            truncate
                          />
                        </td>
                        <td>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <TokenLogo
                              address={item.fromToken.id}
                              chainId={chainId}
                              width={18}
                              height={18}
                            />
                            {`${formatReadableNumber({
                              input: item.amountIn,
                              showDecimals: 2,
                            })} ${item.fromToken.symbol}`}
                          </Box>
                        </td>
                        <td>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <TokenLogo
                              address={item.toToken.id}
                              chainId={chainId}
                              width={18}
                              height={18}
                            />
                            {`${formatReadableNumber({
                              input: item.amountOut,
                              showDecimals: 2,
                            })} ${item.toToken.symbol}`}
                          </Box>
                        </td>
                        <td>
                          <PriceWrapper
                            amountOut={item.amountOut}
                            amountIn={item.amountIn}
                            fromTokenSymbol={item.fromToken.symbol}
                            toTokenSymbol={item.toToken.symbol}
                          />
                        </td>
                        <Box
                          component="td"
                          sx={{
                            textAlign: 'right',
                          }}
                        >
                          {formatPercentageNumber({
                            input: totalFeeRate,
                          })}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            textAlign: 'right',
                          }}
                        >{`${formatReadableNumber({
                          input: new BigNumber(item.amountOut).times(
                            totalFeeRate ?? 0,
                          ),
                        })} ${item.toToken.symbol}`}</Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/** load more */}
            {hasMore && (
              <ButtonBase
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 64,
                  width: '100%',
                  borderStyle: 'solid',
                  borderColor: 'border.main',
                  borderWidth: theme.spacing(1, 0, 0, 0),
                  typography: 'body2',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <Trans>Load more</Trans>
                <Box
                  component={ArrowRight}
                  sx={{
                    transform: 'rotate(90deg)',
                  }}
                />
              </ButtonBase>
            )}
          </Box>
        )}
      </CardStatus>
    </Box>
  );
}
