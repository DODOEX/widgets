import { ChainId, PoolApi, PoolType } from '@dodoex/api';
import {
  alpha,
  Box,
  Button,
  createTheme,
  ThemeProvider,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { CardStatus } from '../../../components/CardWidgets';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import LiquidityLpPartnerReward from '../../../components/LiquidityLpPartnerReward';
import { EmptyList } from '../../../components/List/EmptyList';
import { FailedList } from '../../../components/List/FailedList';
import SelectChain from '../../../components/SelectChain';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import {
  byWei,
  formatApy,
  formatExponentialNotation,
  formatPercentageNumber,
  formatReadableNumber,
} from '../../../utils';
import { FEE_AMOUNT_DETAIL } from '../AMMV3/components/shared';
import { FeeAmount } from '../AMMV3/sdks/v3-sdk';
import { PoolOperateProps } from '../PoolOperate';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import {
  convertFetchLiquidityToOperateData,
  convertLiquidityTokenToTokenInfo,
  FetchLiquidityListLqList,
  getPoolAMMOrPMM,
} from '../utils';
import AddingOrRemovingBtn from './components/AddingOrRemovingBtn';
import FilterAddressTags from './components/FilterAddressTags';
import FilterTokenTags from './components/FilterTokenTags';
import GoPoolDetailBtn from './components/GoPoolDetailBtn';
import LiquidityTable from './components/LiquidityTable';
import LoadingCard from './components/LoadingCard';
import PoolApyTooltip from './components/PoolApyTooltip';
import TokenAndPoolFilter from './components/TokenAndPoolFilter';
import TokenListPoolItem from './components/TokenListPoolItem';
import { usePoolListFilterTokenAndPool } from './hooks/usePoolListFilterTokenAndPool';

function CardList({
  lqList,
  setOperatePool,
  supportAMM,
}: {
  lqList: FetchLiquidityListLqList;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  supportAMM?: boolean;
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
        const hasMetromMining =
          !!item.apy?.metromMiningApy && Number(item.apy?.metromMiningApy) > 0;

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
              backgroundColor: theme.palette.tabActive.main,
              borderRadius: 16,
            }}
            className="gradient-card-border"
            onClick={() => {
              if (supportAMM) return;
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
                mt: 28,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 8,
              }}
            >
              {supportAMM && (
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: 8,
                    p: 12,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {poolType}
                    <Tooltip title={<Trans>Fee rate</Trans>}>
                      <Box
                        sx={{
                          px: 8,
                          py: 4,
                          borderRadius: 4,
                          typography: 'h6',
                          backgroundColor: 'background.tag',
                          color: 'text.secondary',
                        }}
                      >
                        {isAMMV3
                          ? (FEE_AMOUNT_DETAIL[item.lpFeeRate as FeeAmount]
                              ?.label ?? '-')
                          : formatPercentageNumber({
                              input: new BigNumber(item.lpFeeRate ?? 0).plus(
                                item.mtFeeRate
                                  ? byWei(item.mtFeeRate, isAMMV2 ? 4 : 18)
                                  : 0,
                              ),
                            })}
                      </Box>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      typography: 'h6',
                      color: 'text.secondary',
                    }}
                  >
                    <Trans>Pool Type</Trans>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  borderRadius: 8,
                  p: 12,
                }}
              >
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
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  borderRadius: 8,
                  p: 12,
                }}
              >
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

              {supportAMM && (
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: 8,
                    p: 12,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      typography: 'h5',
                    }}
                  >
                    ${formatReadableNumber({ input: item.volume24H || 0 })}
                  </Box>
                  <Box
                    sx={{
                      typography: 'h6',
                      color: 'text.secondary',
                    }}
                  >
                    <Trans>Volume (1D)</Trans>
                  </Box>
                </Box>
              )}
            </Box>
            {/* operate */}
            <Box
              sx={{
                mt: 20,
                display: 'flex',
                gap: 4,
              }}
            >
              <NeedConnectButton
                fullWidth
                size={Button.Size.small}
                variant={Button.Variant.darken}
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
              {supportAMM && poolType === 'PMM' && (
                <GoPoolDetailBtn chainId={item.chainId} address={item.id} />
              )}
            </Box>
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
  supportAMM,
}: {
  lqList: FetchLiquidityListLqList;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
  supportAMM?: boolean;
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
          {supportAMM && (
            <Box component="th">
              <Trans>Pool Type</Trans>
            </Box>
          )}
          <Box component="th">
            <Trans>TVL</Trans>
          </Box>
          <Box component="th">
            <Trans>APY</Trans>
          </Box>
          {supportAMM && (
            <th>
              <Trans>Volume (1D)</Trans>
            </th>
          )}
          <Box
            component="th"
            sx={{
              width: 80,
            }}
          ></Box>
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
          const hasMetromMining =
            !!item.apy?.metromMiningApy &&
            Number(item.apy?.metromMiningApy) > 0;

          const type = item.type as PoolType;
          const poolType = getPoolAMMOrPMM(type);
          const isAMMV2 = type === 'AMMV2';
          const isAMMV3 = type === 'AMMV3';

          const mt = 6;
          const mb = 6;
          const currentTheme = createTheme({
            mode: operateBtnText ? 'dark' : 'light',
            theme: undefined,
            lang: 'en-US',
          });
          return (
            <ThemeProvider theme={currentTheme} key={item.id + item.chainId}>
              <Box component="tr">
                <Box component="td">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt,
                      mb,
                      py: 20,
                      px: 24,
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                      backgroundColor: 'background.paper',
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
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          typography: 'body2',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {`${baseToken?.symbol}/${quoteToken?.symbol}`}
                        <LiquidityLpPartnerReward
                          address={item.id}
                          chainId={item.chainId}
                        />
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
                        disabledAddress={supportAMM}
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
                {supportAMM && (
                  <Box component="td">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        minHeight: 79,
                        mt,
                        mb,
                        py: 20,
                        px: 24,
                        backgroundColor: 'background.paper',
                      }}
                    >
                      <Box
                        sx={{
                          px: 8,
                          py: 4,
                          borderRadius: 4,
                          typography: 'h6',
                          backgroundColor: 'background.tag',
                          color: 'text.secondary',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {poolType}
                      </Box>
                      <Tooltip title={<Trans>Fee rate</Trans>}>
                        <Box
                          sx={{
                            px: 8,
                            py: 4,
                            borderRadius: 4,
                            typography: 'h6',
                            backgroundColor: 'background.tag',
                            color: 'text.secondary',
                          }}
                        >
                          {isAMMV3
                            ? (FEE_AMOUNT_DETAIL[item.lpFeeRate as FeeAmount]
                                ?.label ?? '-')
                            : formatPercentageNumber({
                                input: new BigNumber(item.lpFeeRate ?? 0).plus(
                                  item.mtFeeRate
                                    ? byWei(item.mtFeeRate, isAMMV2 ? 4 : 18)
                                    : 0,
                                ),
                              })}
                        </Box>
                      </Tooltip>
                    </Box>
                  </Box>
                )}
                <Box component="td">
                  <Box
                    sx={{
                      typography: 'body2',
                      minHeight: 79,
                      mt,
                      mb,
                      py: 20,
                      px: 24,
                      backgroundColor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.primary',
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
                      minHeight: 79,
                      mt,
                      mb,
                      py: 20,
                      px: 24,
                      backgroundColor: 'background.paper',
                    }}
                  >
                    {hasMining || hasMetromMining ? (
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
                {supportAMM && (
                  <Box component="td">
                    <Box
                      sx={{
                        minHeight: 79,
                        mt,
                        mb,
                        py: 20,
                        px: 24,
                        backgroundColor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.primary',
                      }}
                    >
                      ${formatReadableNumber({ input: item.volume24H || 0 })}
                    </Box>
                  </Box>
                )}
                <Box component="td">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      mt,
                      mb,
                      py: 20,
                      px: 24,
                      backgroundColor: 'background.paper',
                      minHeight: 79,
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                  >
                    {supportAMM && poolType === 'PMM' && (
                      <GoPoolDetailBtn
                        chainId={item.chainId}
                        address={item.id}
                      />
                    )}
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
            </ThemeProvider>
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
  scrollParentRef: React.MutableRefObject<HTMLDivElement | null>;
  account?: string;
  filterChainIds?: ChainId[];

  activeChainId: ChainId | undefined;
  handleChangeActiveChainId: (chainId: number | undefined) => void;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
}) {
  const theme = useTheme();
  const { onlyChainId, supportAMMV2, supportAMMV3, notSupportPMM } =
    useUserOptions();
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

  const filterTypes = notSupportPMM ? [] : ['CLASSICAL', 'DVM', 'DSP', 'GSP'];
  if (supportAMMV2) {
    filterTypes.push('AMMV2');
  }
  if (supportAMMV3) {
    filterTypes.push('AMMV3');
  }
  const defaultQueryFilter = {
    chainIds: filterChainIds,
    pageSize: isMobile ? 4 : 8,
    filterState: {
      viewOnlyOwn: false,
      filterTypes,
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
          display: 'flex',
          gap: 8,
          ...(minDevice(filterSmallDeviceWidth)
            ? {}
            : {
                flexDirection: 'column',
              }),
          ...(isMobile
            ? {
                pt: 16,
                pb: 16,
              }
            : {
                px: 24,
                pt: 24,
                pb: 20,
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
              lqList={lqList}
              setOperatePool={setOperatePool}
              supportAMM={supportAMMV2 || supportAMMV3}
            />
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
            supportAMM={supportAMMV2 || supportAMMV3}
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
}
