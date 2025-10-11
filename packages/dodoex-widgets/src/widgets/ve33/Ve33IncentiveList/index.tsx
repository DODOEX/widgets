import React from 'react';
import { Box, useMediaDevices, useTheme } from '@dodoex/components';
import WidgetContainer from '../../../components/WidgetContainer';
import { t } from '@lingui/macro';
import TokenSelect from '../../../components/TokenSelect';
import { TokenInfo } from '../../../hooks/Token';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { PoolApi } from '@dodoex/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Ve33PoolInfoI } from '../types';
import { compositePoolInfo } from '../utils';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { TableList } from './TableList';
import { CardStatus } from '../../../components/CardWidgets';
import InfiniteScroll from 'react-infinite-scroller';
import { debounce } from 'lodash';
import { CardItem, CardList } from './CardList';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';

export default function Ve33IncentiveList({
  aToken: aTokenProps,
  bToken: bTokenProps,
  onGoIncentiveDetail,
}: {
  aToken?: TokenInfo | null;
  bToken?: TokenInfo | null;
  onGoIncentiveDetail: (pool: Ve33PoolInfoI) => void;
}) {
  const scrollParentRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { isMobile } = useMediaDevices();
  const { onlyChainId } = useUserOptions();
  const { chainId: connectedChainId } = useWalletInfo();
  const chainId = onlyChainId ?? connectedChainId;
  const [aToken, setAToken] = React.useState<TokenInfo | null>(
    aTokenProps || null,
  );
  const [bToken, setBToken] = React.useState<TokenInfo | null>(
    bTokenProps || null,
  );

  React.useEffect(() => {
    if (
      aTokenProps &&
      (aTokenProps.address !== aToken?.address ||
        aTokenProps.chainId !== aToken?.chainId)
    ) {
      setAToken(aTokenProps);
    }
  }, [aTokenProps]);
  React.useEffect(() => {
    if (
      bTokenProps &&
      (bTokenProps.address !== bToken?.address ||
        bTokenProps.chainId !== bToken?.chainId)
    ) {
      setAToken(bTokenProps);
    }
  }, [bTokenProps]);

  const graphQLRequests = useGraphQLRequests();
  const query = graphQLRequests.getInfiniteQuery(
    PoolApi.graphql.fetchVe33PoolList,
    'page',
    {
      where: {
        size: isMobile ? 4 : 8,
      },
    },
  );
  const fetchResult = useInfiniteQuery({
    ...query,
    initialPageParam: 1,
    getNextPageParam: (item) => {
      return null;
      // const { currentPage, totalCount, pageSize } = item.ve33_getPoolList ?? {};
      // if (!currentPage || !totalCount || !pageSize) {
      //   return null;
      // }
      // let totalPage = Math.floor(totalCount / pageSize);
      // if (totalCount % pageSize) {
      //   totalPage += 1;
      // }
      // if (currentPage >= totalPage) {
      //   return null;
      // }
      // return currentPage + 1;
    },
  });

  const hasMore = fetchResult.hasNextPage;
  const poolList = React.useMemo(() => {
    const list = [] as Ve33PoolInfoI[];
    fetchResult.data?.pages.forEach((page) => {
      page.ve33_getPoolList?.forEach((pool) => {
        if (pool) {
          list.push(compositePoolInfo(pool, chainId));
        }
      });
    });
    return list;
  }, [chainId, fetchResult.data?.pages]);

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 16 : 28,
        py: 20,
        px: isMobile ? 20 : 40,
        flex: 1,
      }}
      ref={scrollParentRef}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: isMobile ? undefined : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 8 : 28,
          p: isMobile ? 20 : 28,
          borderRadius: 24,
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
          typography: isMobile ? 'body2' : undefined,
          '& > svg': {
            flexShrink: 0,
            ...(isMobile && {
              width: 24,
              height: 24,
            }),
          },
        }}
      >
        <svg
          width="36"
          height="40"
          viewBox="0 0 36 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19.404 0.387311L33.404 5.63731C34.1666 5.92318 34.8238 6.43502 35.2877 7.10442C35.7516 7.77382 36.0001 8.56888 36 9.38331V20.1093C36.0001 23.4522 35.0693 26.729 33.3119 29.5726C31.5545 32.4162 29.0399 34.7143 26.05 36.2093L19.342 39.5613C18.9253 39.7697 18.4659 39.8782 18 39.8782C17.5341 39.8782 17.0747 39.7697 16.658 39.5613L9.95 36.2073C6.96008 34.7123 4.44554 32.4142 2.68814 29.5706C0.930742 26.727 -7.13141e-05 23.4502 7.80325e-07 20.1073V9.38531C-0.000508019 8.57054 0.247811 7.77504 0.711737 7.10524C1.17566 6.43545 1.83307 5.9233 2.596 5.63731L16.596 0.387311C17.5012 0.0479798 18.4988 0.0479798 19.404 0.387311ZM18 23.9973C17.4696 23.9973 16.9609 24.208 16.5858 24.5831C16.2107 24.9582 16 25.4669 16 25.9973C16 26.5277 16.2107 27.0365 16.5858 27.4115C16.9609 27.7866 17.4696 27.9973 18 27.9973C18.5304 27.9973 19.0391 27.7866 19.4142 27.4115C19.7893 27.0365 20 26.5277 20 25.9973C20 25.4669 19.7893 24.9582 19.4142 24.5831C19.0391 24.208 18.5304 23.9973 18 23.9973ZM18 9.99731C17.5101 9.99738 17.0373 10.1772 16.6713 10.5027C16.3052 10.8283 16.0713 11.2768 16.014 11.7633L16 11.9973V19.9973C16.0006 20.5071 16.1958 20.9974 16.5457 21.368C16.8956 21.7387 17.3739 21.9618 17.8828 21.9917C18.3917 22.0215 18.8928 21.856 19.2837 21.5288C19.6746 21.2016 19.9258 20.7375 19.986 20.2313L20 19.9973V11.9973C20 11.4669 19.7893 10.9582 19.4142 10.5831C19.0391 10.208 18.5304 9.99731 18 9.99731Z"
            fill="currentColor"
          />
        </svg>
        {t`Warning: The incentivize feature is mainly used by protocols. Please make sure you understand how it works before using it as any transaction is final and cannot be reverted.`}
      </Box>
      <Box>
        <Box
          sx={{ fontWeight: 600 }}
        >{t`Select pool pair you want to incentive`}</Box>
        <Box
          sx={{
            mt: 12,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
          }}
        >
          <TokenSelect
            token={aToken}
            onTokenChange={setAToken}
            highlightDefault
            border
            sx={{
              width: isMobile ? '100%' : 274,
              borderRadius: 24,
            }}
          />
          <TokenSelect
            token={bToken}
            onTokenChange={setBToken}
            highlightDefault
            border
            sx={{
              width: isMobile ? '100%' : 274,
              borderRadius: 24,
            }}
          />
        </Box>
      </Box>

      <Box>
        <Box sx={{ mb: 12, fontWeight: 600 }}>{t`Available Pools`}</Box>

        {isMobile ? (
          <InfiniteScroll
            hasMore={hasMore}
            threshold={300}
            loadMore={debounce(() => {
              if (fetchResult.hasNextPage && !fetchResult.isFetching) {
                fetchResult.fetchNextPage();
              }
            }, 500)}
            useWindow={false}
            getScrollParent={() => scrollParentRef.current || null}
            loader={<CardItem key="loader" />}
          >
            <DataCardGroup>
              <CardStatus
                loading={fetchResult.isLoading}
                refetch={fetchResult.error ? fetchResult.refetch : undefined}
                empty={!poolList?.length}
                loadingCard={<CardItem />}
              >
                <CardList poolList={poolList} onAdd={onGoIncentiveDetail} />
              </CardStatus>
            </DataCardGroup>
          </InfiniteScroll>
        ) : (
          <CardStatus
            loading={fetchResult.isLoading}
            refetch={fetchResult.error ? fetchResult.refetch : undefined}
            empty={!poolList?.length}
          >
            <TableList
              chainId={chainId}
              poolList={poolList}
              hasMore={hasMore}
              loadMoreLoading={fetchResult.isFetchingNextPage}
              loadMore={() => {
                if (fetchResult.hasNextPage && !fetchResult.isFetching) {
                  fetchResult.fetchNextPage();
                }
              }}
              onAdd={onGoIncentiveDetail}
            />
          </CardStatus>
        )}
      </Box>
    </WidgetContainer>
  );
}
