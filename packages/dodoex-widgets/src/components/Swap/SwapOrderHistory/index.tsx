import { ChainId } from '@dodoex/api';
import { Box, BoxProps, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useTradeSwapOrderList } from '../../../hooks/Swap/useTradeSwapOrderList';
import { CardStatus } from '../../CardWidgets';
import LoadMore from '../../LoadMore';
import SelectChain from '../../SelectChain';
import Table from '../../Table';
import { useUserOptions } from '../../UserOptionsProvider';
import SameOrderCard from './SameOrderCard';

export default function SwapOrderHistory({
  swapOrderListQuery: swapOrderListQueryProps,
}: {
  swapOrderListQuery?: ReturnType<typeof useTradeSwapOrderList>;
}) {
  const theme = useTheme();
  const { onlyChainId } = useUserOptions();
  const { isMobile } = useWidgetDevice();
  const { account } = useWeb3React();
  const [filterChainId, setFilterChainId] =
    React.useState<ChainId | undefined>();
  const swapOrderListQueryLocal = useTradeSwapOrderList({
    account: swapOrderListQueryProps ? undefined : account,
    chainId: onlyChainId ?? filterChainId,
    limit: isMobile ? 10 : 5,
  });
  const swapOrderListQuery = swapOrderListQueryProps ?? swapOrderListQueryLocal;

  return (
    <CardStatus
      isMobile={isMobile}
      empty={!swapOrderListQuery.orderList.length}
      loading={swapOrderListQuery.isLoading}
    >
      {isMobile ? (
        <Box
          sx={{
            px: 16,
          }}
        >
          {swapOrderListQuery.orderList.map((item) => (
            <SameOrderCard key={item.hash} data={item} isMobile={isMobile} />
          ))}
          <LoadMore
            loading={swapOrderListQuery.isFetchingNextPage}
            onClick={swapOrderListQuery.fetchNextPage}
            hasMore={swapOrderListQuery.hasNextPage}
            height={68}
          />
        </Box>
      ) : (
        <>
          <Table
            loadMoreLoading={swapOrderListQuery.isFetchingNextPage}
            loadMore={swapOrderListQuery.fetchNextPage}
            hasMore={swapOrderListQuery.hasNextPage}
          >
            <thead>
              <tr>
                <th>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Trans>Pay</Trans>
                    {!onlyChainId && (
                      <SelectChain
                        chainId={filterChainId}
                        setChainId={setFilterChainId}
                        valueOnlyIcon
                        sx={{
                          '& .MuiSelect-select.MuiSelect-select.MuiSelect-select':
                            {
                              padding: theme.spacing(5, 28, 5, 8),
                              backgroundColor: 'custom.background.disabled',
                              border: 'none',
                              borderRadius: 4,
                              '& > svg, & > img': {
                                width: 14,
                                height: 14,
                              },
                              '&:hover, &[aria-expanded="true"]': {
                                backgroundColor: 'custom.background.disabled',
                              },
                            },
                        }}
                      />
                    )}
                  </Box>
                </th>
                <th>
                  <Trans>Receive</Trans>
                </th>
                <th>
                  <Trans>Status</Trans>
                </th>
                <th>
                  <Trans>Rate</Trans>
                </th>
                <Box
                  component="th"
                  sx={{
                    width: 140,
                  }}
                >
                  <Trans>Details</Trans>
                </Box>
              </tr>
            </thead>
            <tbody>
              {swapOrderListQuery.orderList.map((item) => (
                <SameOrderCard
                  key={item.hash}
                  data={item}
                  isMobile={isMobile}
                />
              ))}
            </tbody>
          </Table>
        </>
      )}
    </CardStatus>
  );
}
