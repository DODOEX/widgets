import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { ArrowRight } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import dayjs from 'dayjs';
import React from 'react';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { CardStatus } from '../../../../components/CardWidgets';
import TokenLogo from '../../../../components/TokenLogo';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { formatTokenAmountNumber } from '../../../../utils';
import { usePoolSwapList } from '../hooks/usePoolSwapList';

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

export function SwapsTable({
  chainId,
  address,
}: {
  chainId: number | undefined;
  address: string | undefined;
}) {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();

  const swapListQuery = usePoolSwapList({
    address,
    chainId,
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
                        <td>{formatDateTimeStr(item.time * 1000)}</td>
                        <td>
                          <AddressWithLinkAndCopy
                            address={item.user}
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
                              address={item.paidToken.id}
                              chainId={chainId}
                              width={24}
                              height={24}
                              noBorder
                              noShowChain
                            />
                            {`${formatTokenAmountNumber({
                              input: item.paidAmount,
                              decimals: item.paidToken.decimals,
                            })} ${item.paidToken.symbol}`}
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
                              address={item.receivedToken.id}
                              chainId={chainId}
                              width={18}
                              height={18}
                              noBorder
                              noShowChain
                            />
                            {`${formatTokenAmountNumber({
                              input: item.receivedAmount,
                              decimals: item.receivedToken.decimals,
                            })} ${item.receivedToken.symbol}`}
                          </Box>
                        </td>
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
