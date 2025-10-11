import { ChainId, PoolApi } from '@dodoex/api';
import { Box, SearchInput, Switch, useTheme } from '@dodoex/components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { CardStatus } from '../../../components/CardWidgets';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { Ve33PoolInfoI, Ve33PoolOperateProps } from '../types';
import { compositePoolInfo } from '../utils';
import { TableList } from './TableList';
import PoolOperateDialog from '../Ve33PoolOperate';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import InfiniteScroll from 'react-infinite-scroller';
import { debounce } from 'lodash';
import { CardItem, CardList } from './CardList';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';

export interface Ve33PoolListProps {
  onClickPoolListRow: (id: string, chainId: ChainId) => void;
}

export const Ve33PoolList = ({ onClickPoolListRow }: Ve33PoolListProps) => {
  const { onlyChainId } = useUserOptions();
  const { chainId: connectedChainId, account } = useWalletInfo();
  const chainId = onlyChainId ?? connectedChainId;
  const { isMobile } = useWidgetDevice();
  const graphQLRequests = useGraphQLRequests();
  const theme = useTheme();

  const [filterToken, setFilterToken] = useState<string>('');
  const [usdValueChecked, setUsdValueChecked] = useState(false);
  const [operatePool, setOperatePool] = useState<Ve33PoolOperateProps | null>(
    null,
  );

  const scrollParentRef = useRef<HTMLDivElement>(null);

  const query = graphQLRequests.getInfiniteQuery(
    PoolApi.graphql.fetchVe33PoolList,
    'page',
    {
      where: {
        token_starts_with: filterToken,
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
  const poolList = useMemo(() => {
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
        gap: 20,
        flex: 1,
        px: isMobile ? 20 : 40,
        py: 20,
      }}
      ref={scrollParentRef}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flex: 1,
          overflow: 'hidden',
          height: 'max-content',
          maxHeight: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <SearchInput
            placeholder="Select by token"
            sx={{
              backgroundColor: theme.palette.background.paperDarkContrast,
              borderRadius: 24,
            }}
            height={40}
            value={filterToken}
            onChange={(e) => {
              setFilterToken(e.target.value);
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              px: 20,
              py: 8,
              borderRadius: 24,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: theme.palette.border.main,
            }}
          >
            <Box
              sx={{
                typography: 'body2',
                color: theme.palette.text.primary,
                fontWeight: 600,
              }}
            >
              $VALUE
            </Box>
            <Switch
              checked={usdValueChecked}
              onChange={(e, checked) => {
                setUsdValueChecked(checked);
              }}
            />
          </Box>
        </Box>
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
                <CardList
                  poolList={poolList}
                  chainId={chainId}
                  usdValueChecked={usdValueChecked}
                  operatePool={operatePool}
                  setOperatePool={setOperatePool}
                  onClickPoolListRow={onClickPoolListRow}
                />
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
              usdValueChecked={usdValueChecked}
              operatePool={operatePool}
              setOperatePool={setOperatePool}
              hasMore={hasMore}
              loadMoreLoading={fetchResult.isFetchingNextPage}
              loadMore={() => {
                if (fetchResult.hasNextPage && !fetchResult.isFetching) {
                  fetchResult.fetchNextPage();
                }
              }}
              onClickPoolListRow={onClickPoolListRow}
            />
          </CardStatus>
        )}
      </Box>
      {operatePool && (
        <PoolOperateDialog
          account={account}
          onClose={() => setOperatePool(null)}
          pool={operatePool?.poolInfo}
          operate={operatePool.operateType}
        />
      )}
    </WidgetContainer>
  );
};
