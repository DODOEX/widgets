import { ChainId, PoolApi } from '@dodoex/api';
import {
  Box,
  Button,
  SearchInput,
  TabPanel,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import { CardStatus } from '../../../components/CardWidgets';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { TableList } from './TableList';
import { useVoteTabs, VoteTab } from '../hooks/useVoteTabs';
import {
  useVotePoolFilters,
  VotePoolFilters,
} from '../hooks/useVotePoolFilters';
import { VotePoolInfoI } from '../types';
import { compositeVotePoolInfo } from '../utils';

export const VotePoolList = () => {
  // TODO: need replace
  const chainId = ChainId.MORPH_HOLESKY_TESTNET;
  const { account } = useWalletInfo();
  const { isMobile } = useWidgetDevice();
  const graphQLRequests = useGraphQLRequests();
  const theme = useTheme();
  const [filterToken, setFilterToken] = useState<string>('');
  const [selectedPoolList, setSelectedPoolList] = useState<{
    [key: string]: boolean;
  }>({});
  const { voteTab, tabs, handleChangeVoteTab } = useVoteTabs();
  const { votePoolFilter, filters, handleChangeVotePoolFilter } =
    useVotePoolFilters();

  const scrollParentRef = useRef<HTMLDivElement>(null);
  const onSelectPool = useCallback(
    (id: string, selected: boolean) => {
      setSelectedPoolList({ ...selectedPoolList, [id]: selected });
    },
    [selectedPoolList, setSelectedPoolList],
  );

  const query = graphQLRequests.getInfiniteQuery(
    PoolApi.graphql.fetchVotePoolList,
    'page',
    {
      where: {
        token_starts_with: filterToken,
        size: isMobile ? 4 : 8,
        user: voteTab === VoteTab.MyVoted ? account : null,
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
    const list = [] as VotePoolInfoI[];
    fetchResult.data?.pages.forEach((page) => {
      page.ve33_getVotePoolList?.forEach((pool) => {
        if (pool) {
          const votePool = compositeVotePoolInfo(pool, chainId);
          if (
            votePoolFilter === VotePoolFilters.All ||
            //@ts-ignore
            votePool.type === votePoolFilter
          ) {
            list.push(compositeVotePoolInfo(pool, chainId));
          }
        }
      });
    });
    return list;
  }, [chainId, fetchResult.data?.pages, votePoolFilter]);

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        gap: 20,
        flex: 1,
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
        <Tabs
          value={voteTab}
          onChange={(_, value) => {
            handleChangeVoteTab(value as VoteTab);
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16,
            flex: 1,
            overflow: 'hidden',
            height: 'max-content',
            maxHeight: '100%',
          }}
          className={'gradient-card-border'}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 20,
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <TabsGroup
                tabs={tabs}
                variant="rounded"
                tabsListSx={{
                  justifyContent: 'space-between',
                  borderBottomWidth: 0,
                  border: `1px solid ${theme.palette.border.main}`,
                  borderRadius: 24,
                }}
                tabSx={{
                  mb: 0,
                  borderRadius: 0,
                  padding: '0 20px',
                }}
              />
              <SearchInput
                placeholder="Select by token"
                sx={{
                  backgroundColor: theme.palette.background.paperDarkContrast,
                  borderRadius: 24,
                  marginLeft: 8,
                }}
                height={40}
                value={filterToken}
                onChange={(e) => {
                  setFilterToken(e.target.value);
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                border: `border: 1px solid ${theme.palette.border.main}`,
                borderRadius: '24px',
              }}
            >
              {filters.map(({ key, value }, index) => {
                return (
                  <Box
                    sx={{
                      backgroundColor:
                        key === votePoolFilter
                          ? 'rgba(81, 62, 43, 0.1)'
                          : 'transparent',
                      borderRadius:
                        index === 0
                          ? '24px 0 0 24px'
                          : index === filters.length - 1
                            ? '0 24px 24px 0'
                            : '0',
                      display: 'flex',
                      padding: '0 20px',
                      alignItems: 'center',
                      cursor: 'pointer',
                      justifyContent: 'center',
                    }}
                    onClick={() => handleChangeVotePoolFilter(key)}
                    key={key}
                  >
                    {value}
                  </Box>
                );
              })}
            </Box>
          </Box>
          <TabPanel
            value={VoteTab.SelectToVote}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              padding: '0 20px',
              flex: 1,
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
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
              onSelectPool={onSelectPool}
              selectedPoolList={selectedPoolList}
            />

            <CardStatus
              loading={fetchResult.isLoading}
              refetch={fetchResult.error ? fetchResult.refetch : undefined}
              empty={!poolList?.length}
              hasSearch={!!filterToken}
            />
          </TabPanel>
          <TabPanel
            value={VoteTab.MyVoted}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              padding: '0 20px',
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
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
              onSelectPool={onSelectPool}
              selectedPoolList={selectedPoolList}
            />

            <CardStatus
              loading={fetchResult.isLoading}
              refetch={fetchResult.error ? fetchResult.refetch : undefined}
              empty={!poolList?.length}
              hasSearch={!!filterToken}
            />
          </TabPanel>
        </Tabs>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          boxShadow: `0px -4px 16px 0px ${theme.shadows}`,
          height: 120,
          borderRadius: '24px 24px 0 0',
          backgroundColor: theme.palette.background.paper,
          padding: '0 20px',
        }}
      >
        <Box>Select A Lock</Box>
        <Box>
          <Button>Clear</Button>
          <Button sx={{ marginLeft: 8 }}>
            Vote ({Object.values(selectedPoolList).length})
          </Button>
        </Box>
      </Box>
    </WidgetContainer>
  );
};
