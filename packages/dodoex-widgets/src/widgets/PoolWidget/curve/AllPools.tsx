import { ChainId, PoolApi, PoolType } from '@dodoex/api';
import { alpha, Box, Button, useTheme } from '@dodoex/components';
import { Share } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import React, { useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { CardStatus } from '../../../components/CardWidgets';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import LiquidityLpPartnerReward from '../../../components/LiquidityLpPartnerReward';
import { EmptyList } from '../../../components/List/EmptyList';
import { FailedList } from '../../../components/List/FailedList';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import {
  formatApy,
  formatExponentialNotation,
  formatTokenAmountNumber,
} from '../../../utils';
import AddingOrRemovingBtn from '../PoolList/components/AddingOrRemovingBtn';
import FilterAddressTags from '../PoolList/components/FilterAddressTags';
import FilterTokenTags from '../PoolList/components/FilterTokenTags';
import GoPoolDetailBtn from '../PoolList/components/GoPoolDetailBtn';
import LiquidityTable from '../PoolList/components/LiquidityTable';
import LoadingCard from '../PoolList/components/LoadingCard';
import PoolApyTooltip from '../PoolList/components/PoolApyTooltip';
import TokenAndPoolFilter from '../PoolList/components/TokenAndPoolFilter';
import TokenListPoolItem from '../PoolList/components/TokenListPoolItem';
import {
  TokenAndPoolFilterUserOptions,
  usePoolListFilterTokenAndPool,
} from '../PoolList/hooks/usePoolListFilterTokenAndPool';
import { PoolOperateProps } from '../PoolOperate';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import {
  convertFetchLiquidityToOperateData,
  convertLiquidityTokenToTokenInfo,
  FetchLiquidityListLqList,
  getPoolAMMOrPMM,
} from '../utils';
import { CoinsLogoList } from './components/CoinsLogoList';
import { CurvePoolT, OperateCurvePoolT } from './types';
import { mockCurvePoolList } from './utils';
import { ApyTooltip } from './components/ApyTooltip';

function CardList({
  lqList,
  setOperatePool,
}: {
  lqList: FetchLiquidityListLqList;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
}) {
  const theme = useTheme();
  const { onSharePool } = useUserOptions();
  return (
    <>
      {lqList?.map((lq) => {
        if (!lq?.pair) return null;
        const item = lq.pair;
        const baseToken = convertLiquidityTokenToTokenInfo(
          item.baseToken,
          item.chainId,
        );
        const quoteToken = convertLiquidityTokenToTokenInfo(
          item.quoteToken,
          item.chainId,
        );
        const timeRangeApy = item.apyList?.find(
          (apy) => apy?.timeRange === `1D`,
        );
        const baseApy = timeRangeApy
          ? formatApy(
              new BigNumber(timeRangeApy?.transactionBaseApy).plus(
                timeRangeApy?.miningBaseApy ?? 0,
              ),
            )
          : undefined;
        const quoteApy =
          PoolApi.utils.singleSideLp(item.type as PoolType) && timeRangeApy
            ? formatApy(
                new BigNumber(timeRangeApy.transactionQuoteApy).plus(
                  timeRangeApy.miningQuoteApy ?? 0,
                ),
              )
            : undefined;
        const hasMining = !!item.miningAddress?.[0];
        const hasMetromMining =
          !!timeRangeApy?.metromMiningApy &&
          Number(timeRangeApy?.metromMiningApy) > 0;

        const type = item.type as PoolType;
        const poolType = getPoolAMMOrPMM(type);
        const isAMMV2 = type === 'AMMV2';
        const isAMMV3 = type === 'AMMV3';

        return (
          <Box
            key={item.id + item.chainId}
            sx={{
              px: 20,
              pt: 20,
              pb: 12,
              backgroundColor: 'background.paper',
              borderRadius: 16,
            }}
            className="gradient-card-border"
            onClick={() => {
              useRouterStore.getState().push({
                type: PageType.PoolDetail,
                params: {
                  chainId: item.chainId as ChainId,
                  address: item.id as string,
                },
              });
            }}
          >
            {/* title */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {baseToken && quoteToken ? (
                  <TokenLogoPair
                    tokens={[baseToken, quoteToken]}
                    width={24}
                    mr={6}
                    chainId={item.chainId}
                    showChainLogo
                  />
                ) : (
                  ''
                )}
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                  }}
                >
                  {`${baseToken?.symbol}/${quoteToken?.symbol}`}
                  {!!onSharePool && (
                    <Box
                      component={Share}
                      sx={{
                        ml: 2,
                        width: 12,
                        height: 12,
                      }}
                      onClick={() =>
                        onSharePool({
                          chainId: item.chainId,
                          baseToken,
                          quoteToken,
                          poolId: item.id,
                          apy: timeRangeApy,
                          isSingle: PoolApi.utils.singleSideLp(
                            item.type as PoolType,
                          ),
                        })
                      }
                    />
                  )}
                  <LiquidityLpPartnerReward
                    address={item.id}
                    chainId={item.chainId}
                  />
                </Box>
              </Box>
              {hasMining || hasMetromMining ? (
                <Box
                  sx={{
                    p: 8,
                    typography: 'h6',
                    fontWeight: 'bold',
                    background: `linear-gradient(180deg, ${alpha(
                      theme.palette.secondary.main,
                      0.3,
                    )} 0%, ${alpha(theme.palette.purple.main, 0.3)} 100%)`,
                    borderRadius: 8,
                    color: 'purple.main',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✨ <Trans>Mining</Trans>
                </Box>
              ) : (
                ''
              )}
            </Box>
            {/* info */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                rowGap: 20,
                mt: 44,
                '& > div:nth-child(odd)': {
                  pr: 20,
                },
                '& > div:nth-child(even)': {
                  position: 'relative',
                  pl: 20,
                  '&::before': {
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'inline-block',
                    content: '""',
                    height: 24,
                    width: '1px',
                    backgroundColor: 'border.main',
                  },
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    typography: 'h5',
                    color: 'success.main',
                  }}
                >
                  {baseApy}
                  {quoteApy ? `/${quoteApy}` : ''}
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                  }}
                >
                  {1}d&nbsp;<Trans>APY</Trans>
                  <PoolApyTooltip
                    chainId={item.chainId}
                    apy={timeRangeApy}
                    baseToken={baseToken}
                    quoteToken={quoteToken}
                    hasQuote={!!quoteApy}
                    hasMining={hasMining}
                    sx={{
                      width: 14,
                      height: 14,
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Box
                  sx={{
                    typography: 'h5',
                  }}
                >
                  ${formatExponentialNotation(new BigNumber(item.tvl))}
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
            </Box>
            {/* operate */}
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
                  setOperatePool({
                    pool: convertFetchLiquidityToOperateData(lq),
                    hasMining,
                  });
                }}
              >
                <Trans>Add</Trans>
              </Button>
              <GoPoolDetailBtn
                chainId={item.chainId}
                address={item.id}
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
            {/* <CardList lqList={lqList} setOperatePool={setOperatePool} /> */}
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
