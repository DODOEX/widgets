import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useCrossSwapOrderList } from '../../../hooks/Swap/useCrossSwapOrderList';
import { CardStatus } from '../../CardWidgets';
import LoadMore from '../../LoadMore';
import Table from '../../Table';
import CrossOrderCard from './CrossOrderCard';

export default function CrossChainOrderList({ account }: { account: string }) {
  const { isMobile } = useWidgetDevice();

  const swapOrderListQuery = useCrossSwapOrderList({
    account,
    limit: isMobile ? 10 : 5,
  });

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
            <CrossOrderCard key={item.hash} data={item} isMobile={isMobile} />
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
                <CrossOrderCard
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
