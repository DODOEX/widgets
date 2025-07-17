import { ChainId, PoolApi } from '@dodoex/api';
import { Box, Button, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import React, { useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { CardStatus } from '../../../components/CardWidgets';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import { EmptyList } from '../../../components/List/EmptyList';
import { FailedList } from '../../../components/List/FailedList';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import {
  formatExponentialNotation,
  formatTokenAmountNumber,
} from '../../../utils';
import AddingOrRemovingBtn from '../PoolList/components/AddingOrRemovingBtn';
import FilterAddressTags from '../PoolList/components/FilterAddressTags';
import FilterTokenTags from '../PoolList/components/FilterTokenTags';
import GoPoolDetailBtn from '../PoolList/components/GoPoolDetailBtn';
import LiquidityTable from '../PoolList/components/LiquidityTable';
import LoadingCard from '../PoolList/components/LoadingCard';
import TokenAndPoolFilter from '../PoolList/components/TokenAndPoolFilter';
import TokenListPoolItem from '../PoolList/components/TokenListPoolItem';
import {
  TokenAndPoolFilterUserOptions,
  usePoolListFilterTokenAndPool,
} from '../PoolList/hooks/usePoolListFilterTokenAndPool';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import { FetchLiquidityListLqList } from '../utils';
import { ApyTooltip } from './components/ApyTooltip';
import { CoinsLogoList } from './components/CoinsLogoList';
import { CurvePoolT, OperateCurvePoolT } from './types';
import { mockCurvePoolList } from './utils';

function CardList({
  poolList,
  setOperateCurvePool,
}: {
  poolList: CurvePoolT[];
  setOperateCurvePool: React.Dispatch<
    React.SetStateAction<OperateCurvePoolT | null>
  >;
}) {
  const theme = useTheme();

  return (
    <>
      {poolList.map((pool) => {
        return (
          <Box
            key={`${pool.chainId}-${pool.address}`}
            sx={{
              px: 20,
              pt: 20,
              pb: 12,
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.border.main}`,
              borderRadius: 16,
            }}
            className="gradient-card-border"
            onClick={() => {
              useRouterStore.getState().push({
                type: PageType.CurvePoolDetail,
                params: {
                  chainId: pool.chainId,
                  address: pool.address,
                },
              });
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Box
                  sx={{
                    typography: 'body1',
                    fontWeight: 600,
                  }}
                >
                  {pool.name}
                </Box>
                <Box
                  sx={{
                    maxWidth: 146,
                    wordBreak: 'break-word',
                    typography: 'body2',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {pool.coins.map((coin, index) => {
                    return (
                      <Box component="span" key={coin.address}>
                        {coin.symbol}
                        {index !== pool.coins.length - 1 && '/'}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <CoinsLogoList pool={pool} separate={true} wrap={true} />
            </Box>

            <Box
              sx={{
                mt: 40,
              }}
            >
              <ApyTooltip
                apy={pool.apy}
                dailyApy={pool.dailyApy}
                weeklyApy={pool.weeklyApy}
              />
              <Box
                sx={{
                  typography: 'h6',
                  color: 'text.secondary',
                }}
              >
                <Trans>APY</Trans>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <Box
                sx={{
                  flexBasis: '100%',
                  flexGrow: 1,
                  flexShrink: 1,
                }}
              >
                <Box
                  sx={{
                    typography: 'h5',
                  }}
                >
                  $
                  {pool.tvl
                    ? formatExponentialNotation(new BigNumber(pool.tvl))
                    : '-'}
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                >
                  <Trans>TVL</Trans>
                </Box>
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  flexGrow: 0,
                  width: '1px',
                  height: 24,
                  backgroundColor: theme.palette.border.main,
                }}
              />
              <Box
                sx={{
                  flexBasis: '100%',
                  flexGrow: 1,
                  flexShrink: 1,
                }}
              >
                <Box
                  sx={{
                    typography: 'h5',
                  }}
                >
                  $
                  {pool.volume
                    ? formatExponentialNotation(new BigNumber(pool.volume))
                    : '-'}
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                >
                  <Trans>Volume </Trans>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 20,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Button
                fullWidth
                size={Button.Size.small}
                onClick={(evt) => {
                  evt.stopPropagation();
                  setOperateCurvePool({
                    pool: pool,
                    type: OperateTab.Add,
                  });
                }}
              >
                <Trans>Add</Trans>
              </Button>
              <GoPoolDetailBtn
                chainId={pool.chainId}
                address={pool.address}
                type={PageType.CurvePoolDetail}
              />
            </Box>
          </Box>
        );
      })}
    </>
  );
}

function TableList({
  poolList = mockCurvePoolList,
  loading,
  operateCurvePool,
  setOperateCurvePool,
  hasMore,
  loadMore,
  loadMoreLoading,
}: {
  poolList: CurvePoolT[];
  loading: boolean;
  operateCurvePool: OperateCurvePoolT | null;
  setOperateCurvePool: React.Dispatch<
    React.SetStateAction<OperateCurvePoolT | null>
  >;
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
}) {
  const theme = useTheme();

  return (
    <LiquidityTable
      hasMore={hasMore}
      loadMore={loadMore}
      loadMoreLoading={loadMoreLoading}
      empty={!poolList?.length}
      loading={loading}
    >
      <Box component="thead">
        <Box component="tr">
          <Box component="th">Pool</Box>
          <Box component="th">Assets</Box>
          <Box component="th">APY</Box>
          <Box component="th">TVL</Box>
          <Box component="th">Volume</Box>
          <Box
            component="th"
            sx={{
              width: 155,
            }}
          ></Box>
        </Box>
      </Box>
      <Box component="tbody">
        {poolList.map((pool) => {
          let operateBtnText = '';
          if (
            operateCurvePool?.pool?.address.toLowerCase() ===
            pool.address.toLowerCase()
          ) {
            switch (operateCurvePool.type) {
              case OperateTab.Remove:
                operateBtnText = t`Removing`;
                break;
              default:
                operateBtnText = t`Adding`;
                break;
            }
          }

          const hoverBg = theme.palette.hover.default;
          return (
            <Box
              component="tr"
              key={`${pool.chainId}-${pool.address}`}
              sx={{
                [`&:hover td${operateBtnText ? ', & td' : ''}`]: {
                  backgroundImage: `linear-gradient(${hoverBg}, ${hoverBg})`,
                },
              }}
            >
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                    lineHeight: '19px',
                    fontWeight: 600,
                  }}
                >
                  {pool.name}
                </Box>

                <AddressWithLinkAndCopy
                  address={pool.address}
                  customChainId={pool.chainId}
                  truncate
                  showCopy
                  iconDarkHover
                  iconSize={14}
                  iconSpace={4}
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                />
              </Box>
              <Box component="td">
                <CoinsLogoList pool={pool} separate={true} wrap={false} />
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ApyTooltip
                    apy={pool.apy}
                    dailyApy={pool.dailyApy}
                    weeklyApy={pool.weeklyApy}
                  />
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                  }}
                  title={`$${formatTokenAmountNumber({
                    input: pool.tvl,
                    decimals: 2,
                  })}`}
                >
                  $
                  {pool.tvl
                    ? formatExponentialNotation(new BigNumber(pool.tvl))
                    : '-'}
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                  }}
                  title={`$${formatTokenAmountNumber({
                    input: pool.volume,
                    decimals: 2,
                  })}`}
                >
                  $
                  {pool.volume
                    ? formatExponentialNotation(new BigNumber(pool.volume))
                    : '-'}
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                  }}
                >
                  <GoPoolDetailBtn
                    chainId={pool.chainId}
                    address={pool.address}
                    type={PageType.CurvePoolDetail}
                  />

                  {operateBtnText ? (
                    <AddingOrRemovingBtn
                      text={operateBtnText}
                      onClick={() => setOperateCurvePool(null)}
                    />
                  ) : (
                    <Button
                      size={Button.Size.small}
                      onClick={() => {
                        setOperateCurvePool({
                          pool,
                          type: OperateTab.Add,
                        });
                      }}
                      sx={{
                        py: 0,
                        height: 32,
                      }}
                    >
                      {t`Add`}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </LiquidityTable>
  );
}

export interface AllPoolsProps {
  scrollParentRef: React.MutableRefObject<HTMLDivElement | null>;
  filterChainIds?: ChainId[];
  activeChainId: ChainId | undefined;
  operateCurvePool: OperateCurvePoolT | null;
  setOperateCurvePool: React.Dispatch<
    React.SetStateAction<OperateCurvePoolT | null>
  >;
  tokenAndPoolFilter?: TokenAndPoolFilterUserOptions;
  children?: React.ReactNode;
}

export const AllPools = ({
  scrollParentRef,
  filterChainIds,
  activeChainId,
  operateCurvePool,
  setOperateCurvePool,
  children,
  tokenAndPoolFilter,
}: AllPoolsProps) => {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const graphQLRequests = useGraphQLRequests();
  const queryClient = useQueryClient();
  const { onlyChainId } = useUserOptions();

  const {
    filterTokens,
    filterASymbol,
    filterBSymbol,
    filterAddressLqList,

    handleDeleteToken,
    handleChangeFilterTokens,
    handleChangeFilterAddress,
  } = usePoolListFilterTokenAndPool();

  const defaultQueryFilter = useMemo(() => {
    return {
      chainIds: filterChainIds,
      pageSize: isMobile ? 4 : 8,
      filterState: {
        viewOnlyOwn: false,
        filterTypes: ['CURVE'],
      },
    };
  }, [filterChainIds, isMobile]);

  const query = graphQLRequests.getInfiniteQuery(
    PoolApi.graphql.fetchLiquidityList,
    'currentPage',
    {
      where: {
        ...defaultQueryFilter,
        filterState: {
          filterASymbol,
          filterBSymbol,
          ...defaultQueryFilter.filterState,
        },
      },
    },
  );
  const fetchResult = useInfiniteQuery({
    ...query,
    initialPageParam: 1,
    getNextPageParam: (item) => {
      const { currentPage, totalCount, pageSize } = item.liquidity_list ?? {};
      if (!currentPage || !totalCount || !pageSize) return null;
      let totalPage = Math.floor(totalCount / pageSize);
      if (totalCount % pageSize) {
        totalPage += 1;
      }
      if (currentPage >= totalPage) return null;
      return currentPage + 1;
    },
  });

  let lqList = [] as FetchLiquidityListLqList;
  const hasFilterAddress = !!filterAddressLqList?.length;
  if (hasFilterAddress) {
    lqList = [...filterAddressLqList];
  } else {
    fetchResult.data?.pages.forEach((page) => {
      page.liquidity_list?.lqList?.forEach((lq) => {
        lqList?.push(lq);
      });
    });
  }

  const hasMore = fetchResult.hasNextPage && !hasFilterAddress;

  return (
    <>
      <Box
        sx={{
          pb: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          [theme.breakpoints.up('tablet')]: {
            py: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            px: 0,
            justifyContent: 'space-between',
          },
        }}
      >
        <Box
          sx={{
            [theme.breakpoints.up('tablet')]: {
              mr: 'auto',
            },
          }}
        >
          {children}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              ...(isMobile
                ? {}
                : {
                    '& > button': {
                      flex: 1,
                    },
                  }),
            }}
          >
            {tokenAndPoolFilter?.element ?? (
              <TokenAndPoolFilter
                value={filterTokens}
                onChange={handleChangeFilterTokens}
                searchAddress={async (address, onClose) => {
                  const query = graphQLRequests.getInfiniteQuery(
                    PoolApi.graphql.fetchLiquidityList,
                    'currentPage',
                    {
                      where: {
                        ...defaultQueryFilter,
                        filterState: {
                          address,
                          ...defaultQueryFilter.filterState,
                        },
                      },
                    },
                  );
                  const result = await queryClient.fetchQuery(query);
                  const lqList = result.liquidity_list?.lqList;
                  if (lqList?.length) {
                    return (
                      <TokenListPoolItem
                        list={lqList}
                        onClick={() => {
                          handleChangeFilterAddress(lqList);
                          onClose();
                        }}
                      />
                    );
                  }
                  return null;
                }}
              />
            )}
          </Box>

          {/* filter tag */}
          {(hasFilterAddress || !!filterTokens.length) && (
            <Box
              sx={{
                my: 0,
              }}
            >
              {hasFilterAddress ? (
                <FilterAddressTags
                  lqList={filterAddressLqList}
                  onDeleteTag={() => handleChangeFilterAddress([])}
                />
              ) : (
                ''
              )}
              <FilterTokenTags
                tags={filterTokens}
                onDeleteTag={handleDeleteToken}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* list */}
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
          loader={
            <LoadingCard
              key="loader"
              sx={{
                mt: 20,
              }}
            />
          }
        >
          <DataCardGroup>
            {fetchResult.isLoading ? <LoadingCard /> : ''}
            {!fetchResult.isLoading &&
              !lqList?.length &&
              !fetchResult.error && (
                <EmptyList
                  sx={{
                    mt: 40,
                  }}
                  hasSearch={
                    !!(
                      (activeChainId && !onlyChainId) ||
                      filterASymbol ||
                      filterBSymbol
                    )
                  }
                />
              )}
            {!!fetchResult.error && (
              <FailedList
                refresh={fetchResult.refetch}
                sx={{
                  mt: 40,
                }}
              />
            )}
            <CardList
              poolList={mockCurvePoolList}
              setOperateCurvePool={setOperateCurvePool}
            />
          </DataCardGroup>
        </InfiniteScroll>
      ) : (
        <>
          <TableList
            poolList={mockCurvePoolList}
            loading={fetchResult.isLoading}
            operateCurvePool={operateCurvePool}
            setOperateCurvePool={setOperateCurvePool}
            hasMore={hasMore}
            loadMoreLoading={fetchResult.isFetchingNextPage}
            loadMore={() => {
              if (fetchResult.hasNextPage && !fetchResult.isFetching) {
                fetchResult.fetchNextPage();
              }
            }}
          />
          <CardStatus
            loading={fetchResult.isLoading}
            refetch={fetchResult.error ? fetchResult.refetch : undefined}
            empty={!lqList?.length}
            hasSearch={
              !!(
                (activeChainId && !onlyChainId) ||
                filterASymbol ||
                filterBSymbol
              )
            }
          />
        </>
      )}
    </>
  );
};
