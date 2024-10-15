import {
  alpha,
  Box,
  Button,
  useTheme,
  Tooltip,
  ButtonBase,
  RotatingIcon,
} from '@dodoex/components';
import { PoolApi, PoolType } from '@dodoex/api';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroller';
import {
  convertFetchLiquidityToOperateData,
  convertLiquidityTokenToTokenInfo,
  FetchLiquidityListLqList,
} from '../utils';
import { ChainId } from '@dodoex/api';
import { ArrowRight } from '@dodoex/icons';
import React from 'react';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { Trans, t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import {
  formatApy,
  formatExponentialNotation,
  formatReadableNumber,
} from '../../../utils';
import PoolApyTooltip from './components/PoolApyTooltip';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import { debounce } from 'lodash';
import LoadingCard from './components/LoadingCard';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { usePoolListFilterTokenAndPool } from './hooks/usePoolListFilterTokenAndPool';
import SelectChain from '../../../components/SelectChain';
import TokenAndPoolFilter from './components/TokenAndPoolFilter';
import TokenListPoolItem from './components/TokenListPoolItem';
import { EmptyList } from '../../../components/List/EmptyList';
import { FailedList } from '../../../components/List/FailedList';
import FilterAddressTags from './components/FilterAddressTags';
import FilterTokenTags from './components/FilterTokenTags';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { PoolOperateProps } from '../PoolOperate';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import AddingOrRemovingBtn from './components/AddingOrRemovingBtn';
import LiquidityTable from './components/LiquidityTable';
import SkeletonTable from './components/SkeletonTable';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';

function CardList({
  lqList,
  setOperatePool,
}: {
  lqList: FetchLiquidityListLqList;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
}) {
  const theme = useTheme();
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
        const baseApy = item.apy
          ? formatApy(
              new BigNumber(item.apy?.transactionBaseApy).plus(
                item.apy?.miningBaseApy ?? 0,
              ),
            )
          : undefined;
        const quoteApy =
          PoolApi.utils.singleSideLp(item.type as PoolType) && item.apy
            ? formatApy(
                new BigNumber(item.apy.transactionQuoteApy).plus(
                  item.apy.miningQuoteApy ?? 0,
                ),
              )
            : undefined;
        const hasMining = !!item.miningAddress?.[0];
        return (
          <Box
            key={item.id + item.chainId}
            sx={{
              px: 20,
              pt: 20,
              pb: 12,
              backgroundColor: 'background.paperContrast',
              borderRadius: 16,
            }}
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
                }}
              >
                {baseToken && quoteToken ? (
                  <TokenLogoPair
                    tokens={[baseToken, quoteToken]}
                    width={24}
                    mr={8}
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
                </Box>
              </Box>
              {hasMining ? (
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
                display: 'flex',
                alignItems: 'center',
                mt: 44,
              }}
            >
              <Box>
                <Box
                  sx={{
                    typography: 'h5',
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
                  <Trans>APY</Trans>
                  <PoolApyTooltip
                    chainId={item.chainId}
                    apy={item.apy}
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
              <Box
                sx={{
                  display: 'inline-block',
                  mx: 20,
                  height: 24,
                  width: '1px',
                  backgroundColor: 'custom.border.default',
                }}
              />
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
            <NeedConnectButton
              fullWidth
              size={Button.Size.small}
              sx={{
                mt: 20,
              }}
              onClick={(evt) => {
                evt.stopPropagation();
                setOperatePool({
                  pool: convertFetchLiquidityToOperateData(lq),
                  hasMining,
                });
              }}
            >
              <Trans>Add</Trans>
            </NeedConnectButton>
          </Box>
        );
      })}
    </>
  );
}

function TableList({
  lqList,
  operatePool,
  setOperatePool,
  hasMore,
  loadMore,
  loadMoreLoading,
}: {
  lqList: FetchLiquidityListLqList;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
}) {
  return (
    <LiquidityTable
      hasMore={hasMore}
      loadMore={loadMore}
      loadMoreLoading={loadMoreLoading}
    >
      <Box component="thead">
        <Box component="tr">
          <Box component="th">
            <Trans>Pair</Trans>
          </Box>
          <Box component="th">
            <Trans>TVL</Trans>
          </Box>
          <Box component="th">
            <Trans>APY</Trans>
          </Box>
          <Box component="th"></Box>
        </Box>
      </Box>
      <Box component="tbody">
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
          const baseApy = item.apy
            ? formatApy(
                new BigNumber(item.apy?.transactionBaseApy).plus(
                  item.apy?.miningBaseApy ?? 0,
                ),
              )
            : undefined;
          const quoteApy =
            PoolApi.utils.singleSideLp(item.type as PoolType) && item.apy
              ? formatApy(
                  new BigNumber(item.apy.transactionQuoteApy).plus(
                    item.apy.miningQuoteApy ?? 0,
                  ),
                )
              : undefined;

          let operateBtnText = '';
          if (
            operatePool?.pool?.address === item.id ||
            operatePool?.address === item.id
          ) {
            switch (operatePool.operate) {
              case OperateTab.Remove:
                operateBtnText = t`Removing`;
                break;
              default:
                operateBtnText = t`Adding`;
                break;
            }
          }

          const hasMining = !!item.miningAddress?.[0];

          return (
            <Box component="tr" key={item.id + item.chainId}>
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {baseToken && quoteToken ? (
                    <TokenLogoPair
                      tokens={[baseToken, quoteToken]}
                      width={24}
                      mr={10}
                      chainId={item.chainId}
                      showChainLogo
                    />
                  ) : (
                    ''
                  )}
                  <Box>
                    <Box
                      sx={{
                        typography: 'body2',
                        fontWeight: 600,
                      }}
                    >
                      {`${baseToken?.symbol}/${quoteToken?.symbol}`}
                    </Box>
                    <AddressWithLinkAndCopy
                      address={item.id}
                      customChainId={item.chainId}
                      truncate
                      showCopy
                      iconDarkHover
                      iconSize={14}
                      iconSpace={4}
                      sx={{
                        typography: 'h6',
                        color: 'text.secondary',
                      }}
                      onAddressClick={() => {
                        useRouterStore.getState().push({
                          type: PageType.PoolDetail,
                          params: {
                            chainId: item.chainId as ChainId,
                            address: item.id as string,
                          },
                        });
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                  }}
                  title={
                    item.tvl
                      ? `$${formatReadableNumber({
                          input: item.tvl,
                        })}`
                      : undefined
                  }
                >
                  ${formatExponentialNotation(new BigNumber(item.tvl))}
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {hasMining ? (
                    <Tooltip title={t`Mining`}>
                      <Box
                        component="span"
                        sx={{
                          typography: 'body2',
                          color: 'success.main',
                        }}
                      >
                        ✨{' '}
                      </Box>
                    </Tooltip>
                  ) : (
                    ''
                  )}
                  <PoolApyTooltip
                    chainId={item.chainId}
                    apy={item.apy}
                    baseToken={baseToken}
                    quoteToken={quoteToken}
                    hasQuote={!!quoteApy}
                    hasMining={hasMining}
                  >
                    <Box
                      component="span"
                      sx={{
                        typography: 'body2',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        width: 'max-content',
                        color: 'success.main',
                        cursor: 'auto',
                      }}
                    >
                      {baseApy}
                      {quoteApy ? `/${quoteApy}` : ''}
                    </Box>
                  </PoolApyTooltip>
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    textAlign: 'right',
                  }}
                >
                  {operateBtnText ? (
                    <AddingOrRemovingBtn
                      text={operateBtnText}
                      onClick={() => setOperatePool(null)}
                    />
                  ) : (
                    <Button
                      size={Button.Size.small}
                      onClick={() => {
                        setOperatePool({
                          pool: convertFetchLiquidityToOperateData(lq),
                          hasMining,
                        });
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

export default function AddLiquidityList({
  scrollParentRef,
  filterChainIds,
  activeChainId,
  handleChangeActiveChainId,
  operatePool,
  setOperatePool,
}: {
  scrollParentRef: React.MutableRefObject<HTMLDivElement | undefined>;
  account?: string;
  filterChainIds?: ChainId[];

  activeChainId: ChainId | undefined;
  handleChangeActiveChainId: (chainId: number | undefined) => void;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
}) {
  const theme = useTheme();
  const { onlyChainId } = useUserOptions();
  const { minDevice, isMobile } = useWidgetDevice();
  const queryClient = useQueryClient();

  const {
    filterTokens,
    filterASymbol,
    filterBSymbol,
    filterAddressLqList,

    handleDeleteToken,
    handleChangeFilterTokens,
    handleChangeFilterAddress,
  } = usePoolListFilterTokenAndPool();

  const defaultQueryFilter = {
    chainIds: filterChainIds,
    pageSize: isMobile ? 4 : 8,
    filterState: {
      viewOnlyOwn: false,
      filterTypes: ['CLASSICAL', 'DVM', 'DSP'],
    },
  };

  const graphQLRequests = useGraphQLRequests();

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

  const filterSmallDeviceWidth = 475;

  const hasMore = fetchResult.hasNextPage && !hasFilterAddress;

  return (
    <>
      <Box
        sx={{
          py: 16,
          display: 'flex',
          gap: 8,
          ...(minDevice(filterSmallDeviceWidth)
            ? {}
            : {
                flexDirection: 'column',
              }),
          ...(isMobile
            ? {}
            : {
                px: 20,
                borderBottomWidth: 1,
              }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            ...(minDevice(filterSmallDeviceWidth)
              ? {}
              : {
                  '& > button': {
                    flex: 1,
                  },
                }),
          }}
        >
          {!onlyChainId && (
            <SelectChain
              chainId={activeChainId}
              setChainId={handleChangeActiveChainId}
            />
          )}
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
            {!fetchResult.isLoading && !lqList?.length && !fetchResult.error && (
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
            <CardList lqList={lqList} setOperatePool={setOperatePool} />
          </DataCardGroup>
        </InfiniteScroll>
      ) : (
        <>
          <TableList
            lqList={lqList}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
            hasMore={hasMore}
            loadMoreLoading={fetchResult.isFetchingNextPage}
            loadMore={() => {
              if (fetchResult.hasNextPage && !fetchResult.isFetching) {
                fetchResult.fetchNextPage();
              }
            }}
          />
          {fetchResult.isLoading && !lqList?.length && <SkeletonTable />}
          {!fetchResult.isLoading && !lqList?.length && !fetchResult.error && (
            <EmptyList
              sx={{
                my: 40,
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
                my: 40,
              }}
            />
          )}
        </>
      )}
    </>
  );
}
