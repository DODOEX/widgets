import { Box } from '@dodoex/components';
import { DataTable, Column } from '../../../../components/DataTable';
import TokenLogo from '../../../../components/TokenLogo';
import BigNumber from 'bignumber.js';
import React, { useMemo, useState } from 'react';
import { t } from '@lingui/macro';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { formatReadableNumber } from '../../../../utils';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { cpGraphqlQuery } from '@dodoex/api';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';

interface SwapItem {
  id: string;
  timestamp: number;
  user: {
    id: string;
  };
  action: 'bid' | 'cancel';
  cp: {
    quoteToken: {
      id: string;
      symbol: string;
    };
  };
  quote: string;
  fee: string;
}

function SwapsTable({ poolAddress, chainId }: { poolAddress: string; chainId: number }) {
  const { isMobile } = useWidgetDevice();
  const pageSize = useMemo(() => (isMobile ? 4 : 8), [isMobile]);

  const graphQLRequests = useGraphQLRequests();
  const { data, isLoading } = useQuery({
    ...graphQLRequests.getQuery(cpGraphqlQuery.fetchCPBids, {
      first: 100,
      orderBy: 'timestamp',
      orderDirection: 'desc',
      where: {
        cp: poolAddress?.toLowerCase(),
      },
    }),
    enabled: !!poolAddress,
  });

  const swapList: SwapItem[] = (data?.bidHistories as SwapItem[]) || [];

  const [currentPage, setCurrentPage] = useState(1);
  const currentCount = useMemo(
    () => new BigNumber(currentPage).times(pageSize).toNumber(),
    [currentPage, pageSize],
  );
  const hasMore = useMemo(
    () => swapList.length > currentCount,
    [swapList.length, currentCount],
  );
  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const datas = useMemo(() => {
    return swapList.slice(0, currentCount).map((item) => {
      const {
        id,
        timestamp,
        user,
        action,
        cp: { quoteToken },
        quote,
        fee,
      } = item;

      return {
        key: id,
        time: (
          <Box sx={{ minWidth: 135 }}>
            {dayjs(timestamp * 1000).format('YYYY/MM/DD HH:mm')}
          </Box>
        ),
        trader: (
          <AddressWithLinkAndCopy
            truncate
            address={user.id}
            customChainId={chainId}
            sx={{
              color: 'text.primary',
            }}
          />
        ),
        side: action === 'bid' ? t`Added` : t`Removed`,
        pay: (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              minWidth: 120,
            }}
          >
            <TokenLogo
              address={quoteToken.id}
              width={18}
              height={18}
              marginRight={8}
              chainId={chainId}
            />
            {`${formatReadableNumber({
              input: quote,
              showDecimals: 2,
            })} ${quoteToken.symbol}`}
          </Box>
        ),
        fee: `${fee}`,
        rate: `${new BigNumber(fee).div(quote).multipliedBy(100).toFixed(0)}%`,
      };
    });
  }, [swapList, currentCount, chainId]);

  const columns: Column[] = useMemo(
    () => [
      {
        key: 'time',
        label: t`Time`,
      },
      {
        key: 'trader',
        label: t`Trader`,
      },
      {
        key: 'side',
        label: t`Side`,
      },
      {
        key: 'pay',
        label: t`Pay`,
      },
      {
        key: 'fee',
        label: t`Fee`,
      },
      {
        key: 'rate',
        label: t`Fee Rate`,
      },
    ],
    [],
  );

  const isEmpty = !datas.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        pb: hasMore || isEmpty ? 0 : 30,
      }}
    >
      <DataTable
        columns={columns}
        datas={datas}
        sxHeader={{
          fontSize: 12,
          p: 20,
          pb: 5,
          fontWeight: 500,
          color: 'text.secondary',
          borderColor: 'transparent',
        }}
        loading={isLoading}
        loadMore={hasMore ? loadMore : undefined}
        sx={{
          flex: 1,
          '.data-table_empty-wrapper': {
            p: 0,
          },
        }}
      />
    </Box>
  );
}

export default React.memo(SwapsTable);
