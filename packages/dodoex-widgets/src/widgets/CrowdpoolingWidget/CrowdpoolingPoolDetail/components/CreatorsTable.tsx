import { Box } from '@dodoex/components';
import { DataTable, Column } from '../../../../components/DataTable';
import { CPDetail } from '../../types';
import BigNumber from 'bignumber.js';
import React, { useMemo, useState } from 'react';
import { t } from '@lingui/macro';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { useQuery } from '@tanstack/react-query';
import { cpGraphqlQuery } from '@dodoex/api';
import { graphQLRequestsLocal } from '../../../../hooks/useGraphQLRequests';
import { useFetchFiatPriceBatch } from '../../../../hooks/useFetchFiatPriceBatch';
import { ThegraphKeyMap } from '../../../../constants/chains';

interface Props {
  detail: CPDetail;
}

function CreatorsTableInner({ detail }: Props) {
  const { isMobile } = useWidgetDevice();
  const pageSize = useMemo(() => (isMobile ? 4 : 8), [isMobile]);

  const fetchBidPositions = useQuery({
    ...graphQLRequestsLocal.getQuery(cpGraphqlQuery.fetchBidPosition, {
      where: {
        cp: detail?.id?.toLowerCase(),
        chain: detail ? ThegraphKeyMap[detail?.chainId] : undefined,
      },
    }),
    enabled: !!detail?.id,
  });
  const bidPositions = useMemo(
    () => fetchBidPositions.data?.bidPositions,
    [fetchBidPositions.data?.bidPositions],
  );

  const tokens = useMemo(
    () => [detail.baseToken, detail.quoteToken],
    [detail.baseToken, detail.quoteToken],
  );
  const fiatPriceQuery = useFetchFiatPriceBatch({ tokens });

  const baseTokenFiatPrice = detail.baseToken
    ? fiatPriceQuery.data?.get(detail.baseToken.address)
    : undefined;
  const quoteTokenFiatPrice = detail.quoteToken
    ? fiatPriceQuery.data?.get(detail.quoteToken.address)
    : undefined;

  const [currentPage, setCurrentPage] = useState(1);
  const currentCount = useMemo(
    () => new BigNumber(currentPage).times(pageSize).toNumber(),
    [currentPage, pageSize],
  );
  const hasMore = useMemo(
    () => bidPositions && bidPositions.length > currentCount,
    [bidPositions, currentCount],
  );
  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const datas = useMemo(() => {
    if (!bidPositions) return [];
    return bidPositions.slice(0, currentCount).map((item, index) => {
      const { user, investedQuote, shares } = item;
      let fiatValue = '-';
      if (quoteTokenFiatPrice) {
        fiatValue = `$${new BigNumber(investedQuote)
          .multipliedBy(quoteTokenFiatPrice)
          .toFixed(2)}`;
      } else if (baseTokenFiatPrice) {
        fiatValue = `$${new BigNumber(investedQuote)
          .div(detail.price)
          .multipliedBy(baseTokenFiatPrice)
          .toFixed(2)}`;
      }
      return {
        key: index,
        creator: (
          <AddressWithLinkAndCopy
            truncate
            address={user.id}
            customChainId={detail.chainId}
            sx={{
              color: 'text.primary',
            }}
          />
        ),
        totalPay: `${investedQuote} ${detail.quoteToken.symbol}`,
        dollarValue: fiatValue,
        share: `${
          Number(detail.totalShares) > 0
            ? new BigNumber(shares)
                .div(detail.totalShares)
                .multipliedBy(100)
                .toFixed(2)
            : 0
        }%`,
      };
    });
  }, [
    baseTokenFiatPrice,
    bidPositions,
    detail,
    currentCount,
    quoteTokenFiatPrice,
  ]);

  const columns: Column[] = useMemo(
    () => [
      {
        key: 'creator',
        label: t`Creator`,
        sx: {
          minWidth: '200px',
        },
      },
      {
        key: 'totalPay',
        label: t`Total Pay`,
      },
      {
        key: 'dollarValue',
        label: t`Dollar Value`,
      },
      {
        key: 'share',
        label: t`Share`,
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
        loading={false}
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

export const CreatorsTable = React.memo(CreatorsTableInner);
