import { alpha, Box, Button, useTheme } from '@dodoex/components';
import { PoolApi, PoolType } from '@dodoex/api';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroller';
import {
  convertFetchLiquidityToOperateData,
  convertLiquidityTokenToTokenInfo,
  FetchLiquidityListLqList,
} from '../utils';
import { ChainId } from '../../../constants/chains';
import React from 'react';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { formatApy, formatExponentialNotation } from '../../../utils';
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
import PoolOperate from '../PoolOperate';
import { graphQLRequests } from '../../../constants/api';

export default function AddLiquidityList({
  scrollParentRef,
  account,
  filterChainIds,
  activeChainId,
  handleChangeActiveChainId,
}: {
  scrollParentRef: React.MutableRefObject<HTMLDivElement | undefined>;
  account?: string;
  filterChainIds?: ChainId[];

  activeChainId: ChainId | undefined;
  handleChangeActiveChainId: (chainId: number | undefined) => void;
}) {
  const theme = useTheme();
  const { minDevice } = useWidgetDevice();
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
    filterState: {
      viewOnlyOwn: false,
      filterTypes: ['CLASSICAL', 'DVM', 'DSP'],
    },
  };

  const query = graphQLRequests.getInfiniteQuery(
    PoolApi.graphql.fetchLiquidityList,
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
  const [addPool, setAddPool] = React.useState<any>();
  // const [addPool, setAddPool] = React.useState<any>(
  //   convertFetchLiquidityToOperateData({
  //     id: '0xc9f93163c99695c6526b799ebca2207fdf7d61ad',
  //     isPrivatePool: null,
  //     isMyLiquidity: null,
  //     pair: {
  //       id: '0xc9f93163c99695c6526b799ebca2207fdf7d61ad',
  //       chainId: 1,
  //       type: 'CLASSICAL',
  //       baseReserve: '6223352.84278',
  //       quoteReserve: '1698689.198812',
  //       lastTradePrice: '0.9996493338113731760351689297828013',
  //       lpFeeRate: '0',
  //       i: '0',
  //       creator: '0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0',
  //       baseLpToken: {
  //         id: '0x50b11247bf14ee5116c855cde9963fa376fcec86',
  //         decimals: '6',
  //       },
  //       quoteLpToken: {
  //         id: '0x05a54b466f01510e92c02d3a180bae83a64baab8',
  //         decimals: '6',
  //       },
  //       baseToken: {
  //         id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         symbol: 'USDT',
  //         name: 'Tether USD',
  //         decimals: 6,
  //         usdPrice: '0.9998246361586016449575791900876106',
  //         logoImg:
  //           'https://storage.googleapis.com/dodo-media-staging/1/0xdac17f958d2ee523a2206206994597c13d831ec7',
  //       },
  //       quoteToken: {
  //         id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  //         symbol: 'USDC',
  //         name: 'USD//C',
  //         decimals: 6,
  //         usdPrice: '1.00017536384139835504242080991239',
  //         logoImg:
  //           'https://storage.googleapis.com/dodo-media-staging/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  //       },
  //       tvl: '7916647.273600018612',
  //       apy: {
  //         miningBaseApy: '0.128321',
  //         miningQuoteApy: '0.105205',
  //         transactionBaseApy: '0',
  //         transactionQuoteApy: '0',
  //       },
  //       miningAddress: ['0xaed7384f03844af886b830862ff0a7afce0a632c'],
  //     },
  //   }),
  // );

  const goDetailPage = () => {};

  const filterSmallDeviceWidth = 475;

  return (
    <>
      <Box
        sx={{
          my: 16,
          display: 'flex',
          gap: 8,
          ...(minDevice(filterSmallDeviceWidth)
            ? {}
            : {
                flexDirection: 'column',
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
          <SelectChain
            chainId={activeChainId}
            setChainId={handleChangeActiveChainId}
          />
          <TokenAndPoolFilter
            value={filterTokens}
            onChange={handleChangeFilterTokens}
            searchAddress={async (address, onClose) => {
              const query = graphQLRequests.getInfiniteQuery(
                PoolApi.graphql.fetchLiquidityList,
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
      <InfiniteScroll
        hasMore={fetchResult.hasNextPage && !hasFilterAddress}
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
          {!fetchResult.isLoading && !lqList?.length && !!fetchResult.error && (
            <EmptyList
              sx={{
                mt: 40,
              }}
              hasSearch={!!(activeChainId || filterASymbol || filterBSymbol)}
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
                    // goDetailPage(item);
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
                    {item.miningAddress ? (
                      <Box
                        sx={{
                          p: 8,
                          typography: 'h6',
                          fontWeight: 'bold',
                          background: `linear-gradient(180deg, ${alpha(
                            theme.palette.secondary.main,
                            0.3,
                          )} 0%, ${alpha(
                            theme.palette.purple.main,
                            0.3,
                          )} 100%)`,
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
                          hasMining={!!item.miningAddress}
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
                      setAddPool(convertFetchLiquidityToOperateData(lq));
                    }}
                  >
                    <Trans>Add</Trans>
                  </NeedConnectButton>
                </Box>
              );
            })}
          </>
        </DataCardGroup>
      </InfiniteScroll>
      <PoolOperate
        pool={addPool}
        account={account}
        onClose={() => setAddPool(undefined)}
      />
    </>
  );
}
