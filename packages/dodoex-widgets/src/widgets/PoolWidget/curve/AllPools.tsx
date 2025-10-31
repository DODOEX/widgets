import { ChainId, CurveApi } from '@dodoex/api';
import { Box, Button, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
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
import { formatTokenAmountNumber } from '../../../utils';
import AddingOrRemovingBtn from '../PoolList/components/AddingOrRemovingBtn';
import FilterTokenTags from '../PoolList/components/FilterTokenTags';
import GoPoolDetailBtn from '../PoolList/components/GoPoolDetailBtn';
import LiquidityTable from '../PoolList/components/LiquidityTable';
import LoadingCard from '../PoolList/components/LoadingCard';
import TokenAndPoolFilter from '../PoolList/components/TokenAndPoolFilter';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import { toColorfulNumString } from '../utils';
import { ApyTooltip } from './components/ApyTooltip';
import { CoinsLogoList } from './components/CoinsLogoList';
import FilterAddressTags from './components/FilterAddressTags';
import TokenListPoolItem from './components/TokenListPoolItem';
import { usePoolListFilterTokenAndPool } from './hooks/usePoolListFilterTokenAndPool';
import { CurvePoolT, OperateCurvePoolT } from './types';
import { convertRawPoolListToCurvePoolListT } from './utils';

function CardList({
  poolList,
  isMyPool,
  setOperateCurvePool,
}: {
  poolList: CurvePoolT[];
  isMyPool: boolean;
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
                    ? toColorfulNumString({
                        input: pool.tvl,
                        decimals: 2,
                      })
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
                  {isMyPool ? (
                    pool.lpTokenBalance ? (
                      formatTokenAmountNumber({
                        input: pool.lpTokenBalance,
                        decimals: pool.decimals,
                      })
                    ) : (
                      '-'
                    )
                  ) : (
                    <>
                      $
                      {pool.volume
                        ? toColorfulNumString({
                            input: pool.volume,
                            decimals: 2,
                          })
                        : '-'}
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                >
                  {isMyPool ? 'My LP tokens' : 'Volume'}
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
              {isMyPool && (
                <Button
                  fullWidth
                  variant={Button.Variant.outlined}
                  size={Button.Size.small}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    setOperateCurvePool({
                      pool: pool,
                      type: OperateTab.Remove,
                    });
                  }}
                >
                  <Trans>Remove</Trans>
                </Button>
              )}

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
  poolList,
  isMyPool,
  loading,
  operateCurvePool,
  setOperateCurvePool,
  hasMore,
  loadMore,
  loadMoreLoading,
}: {
  poolList: CurvePoolT[];
  isMyPool: boolean;
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
          <Box component="th">{isMyPool ? 'My LP tokens' : 'Volume'}</Box>
          <Box
            component="th"
            sx={{
              width: isMyPool ? 249 : 155,
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
                    ? toColorfulNumString({
                        input: pool.tvl,
                        decimals: 2,
                      })
                    : '-'}
                </Box>
              </Box>
              <Box component="td">
                {isMyPool ? (
                  <Box
                    sx={{
                      typography: 'body2',
                      fontWeight: 600,
                    }}
                    title={`$${formatTokenAmountNumber({
                      input: pool.lpTokenBalance,
                      decimals: 2,
                    })}`}
                  >
                    {pool.lpTokenBalance
                      ? formatTokenAmountNumber({
                          input: pool.lpTokenBalance,
                          decimals: pool.decimals,
                        })
                      : '-'}
                  </Box>
                ) : (
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
                      ? toColorfulNumString({
                          input: pool.volume,
                          decimals: 2,
                        })
                      : '-'}
                  </Box>
                )}
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
                    <>
                      {isMyPool && (
                        <Button
                          variant={Button.Variant.second}
                          size={Button.Size.small}
                          onClick={() => {
                            setOperateCurvePool({
                              pool,
                              type: OperateTab.Remove,
                            });
                          }}
                          sx={{
                            py: 0,
                            height: 32,
                          }}
                        >
                          {t`Remove`}
                        </Button>
                      )}
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
                    </>
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
  account?: string;
  scrollParentRef: React.MutableRefObject<HTMLDivElement | null>;
  activeChainId: ChainId | undefined;
  operateCurvePool: OperateCurvePoolT | null;
  setOperateCurvePool: React.Dispatch<
    React.SetStateAction<OperateCurvePoolT | null>
  >;
  children?: React.ReactNode;
  isMyPool?: boolean;
}

export const AllPools = ({
  account,
  scrollParentRef,
  activeChainId,
  operateCurvePool,
  setOperateCurvePool,
  children,
  isMyPool = false,
}: AllPoolsProps) => {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const graphQLRequests = useGraphQLRequests();
  const queryClient = useQueryClient();
  const { onlyChainId } = useUserOptions();

  const {
    filterTokens,

    filterAddressLqList,

    handleDeleteToken,
    handleChangeFilterTokens,
    handleChangeFilterAddress,
  } = usePoolListFilterTokenAndPool();

  const defaultQueryFilter = useMemo(() => {
    return {
      chainId: activeChainId,
      pageSize: isMobile ? 4 : 8,
      order: {
        orderBy: 'tvl',
        orderDirection: 'desc',
      },
      user: isMyPool ? account?.toLowerCase() : null,
      filterState: {
        // poolAddress: null,
        // poolType: null,
        tokenAddress: filterTokens[0]?.address.toLowerCase() ?? null,
      },
    };
  }, [activeChainId, isMobile, isMyPool, account, filterTokens]);

  const query = graphQLRequests.getInfiniteQuery(
    CurveApi.graphql.curve_stableswap_ng_getAllPools,
    'currentPage',
    {
      where: {
        ...defaultQueryFilter,
      },
    },
  );

  const queryMyPool = graphQLRequests.getInfiniteQuery(
    CurveApi.graphql.curve_stableswap_ng_getMyLiquidity,
    'currentPage',
    {
      where: {
        ...defaultQueryFilter,
      },
    },
  );

  const fetchResult = useInfiniteQuery({
    ...query,
    enabled: !isMyPool,
    initialPageParam: 1,
    getNextPageParam: (item) => {
      if (!item.curve_stableswap_ng_getAllPools) {
        return null;
      }

      const { currentPage, totalCount, pageSize } =
        item.curve_stableswap_ng_getAllPools;
      if (!currentPage || !totalCount || !pageSize) {
        return null;
      }

      let totalPage = Math.floor(totalCount / pageSize);
      if (totalCount % pageSize) {
        totalPage += 1;
      }
      if (currentPage >= totalPage) {
        return null;
      }
      return currentPage + 1;
    },
  });

  const fetchResultMyPool = useInfiniteQuery({
    ...queryMyPool,
    enabled: isMyPool && account != null,
    initialPageParam: 1,
    getNextPageParam: (item) => {
      if (!item.curve_stableswap_ng_getMyLiquidity) {
        return null;
      }

      const { currentPage, totalCount, pageSize } =
        item.curve_stableswap_ng_getMyLiquidity;
      if (!currentPage || !totalCount || !pageSize) {
        return null;
      }

      let totalPage = Math.floor(totalCount / pageSize);
      if (totalCount % pageSize) {
        totalPage += 1;
      }
      if (currentPage >= totalPage) {
        return null;
      }
      return currentPage + 1;
    },
  });

  const hasFilterAddress = !!filterAddressLqList?.length;

  const poolList = useMemo(() => {
    let lqList: CurvePoolT[] = [];
    if (hasFilterAddress) {
      lqList = [...filterAddressLqList];
    } else if (!isMyPool) {
      fetchResult.data?.pages.forEach((page) => {
        const list = convertRawPoolListToCurvePoolListT(
          page.curve_stableswap_ng_getAllPools?.lqList,
          activeChainId,
        );

        lqList = [...lqList, ...list];
      });
    } else {
      fetchResultMyPool.data?.pages.forEach((page) => {
        const list = convertRawPoolListToCurvePoolListT(
          page.curve_stableswap_ng_getMyLiquidity?.lqList,
          activeChainId,
        );

        lqList = [...lqList, ...list];
      });
    }

    return lqList;
  }, [
    hasFilterAddress,
    isMyPool,
    filterAddressLqList,
    fetchResult.data?.pages,
    activeChainId,
    fetchResultMyPool.data?.pages,
  ]);

  const hasMore =
    (isMyPool ? fetchResultMyPool.hasNextPage : fetchResult.hasNextPage) &&
    !hasFilterAddress;

  const fetchResultStatus = isMyPool ? fetchResultMyPool : fetchResult;

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
            <TokenAndPoolFilter
              value={filterTokens}
              onChange={handleChangeFilterTokens}
              searchAddress={async (address, onClose) => {
                const query = graphQLRequests.getInfiniteQuery(
                  CurveApi.graphql.curve_stableswap_ng_getAllPools,
                  'currentPage',
                  {
                    where: {
                      ...defaultQueryFilter,
                      filterState: {
                        poolAddress: address.toLowerCase(),
                      },
                    },
                  },
                );

                const queryMyPool = graphQLRequests.getInfiniteQuery(
                  CurveApi.graphql.curve_stableswap_ng_getMyLiquidity,
                  'currentPage',
                  {
                    where: {
                      ...defaultQueryFilter,
                      filterState: {
                        poolAddress: address.toLowerCase(),
                      },
                    },
                  },
                );

                const lqList = isMyPool
                  ? (await queryClient.fetchQuery(queryMyPool))
                      .curve_stableswap_ng_getMyLiquidity?.lqList
                  : (await queryClient.fetchQuery(query))
                      .curve_stableswap_ng_getAllPools?.lqList;

                const list = convertRawPoolListToCurvePoolListT(
                  lqList,
                  activeChainId,
                );
                if (list?.length) {
                  return (
                    <TokenListPoolItem
                      list={list}
                      onClick={() => {
                        handleChangeFilterAddress(list);
                        onClose();
                      }}
                    />
                  );
                }
                return null;
              }}
            />
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
              ) : null}
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
            if (
              fetchResultStatus.hasNextPage &&
              !fetchResultStatus.isFetching
            ) {
              fetchResultStatus.fetchNextPage();
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
            {fetchResultStatus.isLoading ? <LoadingCard /> : ''}
            {!fetchResultStatus.isLoading &&
              !poolList?.length &&
              !fetchResultStatus.error && (
                <EmptyList
                  sx={{
                    mt: 40,
                  }}
                  hasSearch={!!(activeChainId && !onlyChainId)}
                />
              )}
            {!!fetchResultStatus.error && (
              <FailedList
                refresh={fetchResultStatus.refetch}
                sx={{
                  mt: 40,
                }}
              />
            )}
            <CardList
              isMyPool={isMyPool}
              poolList={poolList}
              setOperateCurvePool={setOperateCurvePool}
            />
          </DataCardGroup>
        </InfiniteScroll>
      ) : (
        <>
          <TableList
            isMyPool={isMyPool}
            poolList={poolList}
            loading={fetchResultStatus.isLoading}
            operateCurvePool={operateCurvePool}
            setOperateCurvePool={setOperateCurvePool}
            hasMore={hasMore}
            loadMoreLoading={fetchResultStatus.isFetchingNextPage}
            loadMore={() => {
              if (
                fetchResultStatus.hasNextPage &&
                !fetchResultStatus.isFetching
              ) {
                fetchResultStatus.fetchNextPage();
              }
            }}
          />
          <CardStatus
            loading={fetchResultStatus.isLoading}
            refetch={
              fetchResultStatus.error ? fetchResultStatus.refetch : undefined
            }
            empty={!poolList?.length}
            hasSearch={!!(activeChainId && !onlyChainId)}
          />
        </>
      )}
    </>
  );
};
