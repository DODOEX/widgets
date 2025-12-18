import { ChainId, PoolApi, PoolType } from '@dodoex/api';
import { alpha, Box, Button, Tooltip, useTheme } from '@dodoex/components';
import { Share } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { CardStatus } from '../../../components/CardWidgets';
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
  formatPercentageNumber,
  formatTokenAmountNumber,
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
  toColorfulNumString,
} from '../utils';
import AddingOrRemovingBtn from './components/AddingOrRemovingBtn';
import FilterAddressTags from './components/FilterAddressTags';
import { FilterGroup } from './components/FilterGroup';
import FilterTokenTags from './components/FilterTokenTags';
import GoPoolDetailBtn from './components/GoPoolDetailBtn';
import LiquidityTable from './components/LiquidityTable';
import LoadingCard from './components/LoadingCard';
import { MigrationTag } from './components/migationWidget';
import PoolApyTooltip from './components/PoolApyTooltip';
import { SortButtonGroup } from './components/SortButtonGroup';
import { TableSortButton } from './components/TableSortButton';
import { PoolFeeRateTag, PoolTypeTag } from './components/tags';
import TokenAndPoolFilter from './components/TokenAndPoolFilter';
import TokenListPoolItem from './components/TokenListPoolItem';
import {
  TokenAndPoolFilterUserOptions,
  usePoolListFilterTokenAndPool,
} from './hooks/usePoolListFilterTokenAndPool';

function CardList({
  lqList,
  setOperatePool,
  getMigrationPairAndMining,
  supportAMM,
  timeRange,
}: {
  lqList: FetchLiquidityListLqList;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  getMigrationPairAndMining?: (p: { address: string; chainId: number }) => void;
  supportAMM?: boolean;
  timeRange: '1' | '7' | '14' | '30';
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
          (apy) => apy?.timeRange === `${timeRange}D`,
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

        const migrationItem = getMigrationPairAndMining?.({
          address: item.id,
          chainId: item.chainId,
        });

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
                {!!migrationItem && <MigrationTag />}
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
              {supportAMM && (
                <Box>
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
                  {timeRange}d&nbsp;<Trans>APY</Trans>
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
                  $
                  {toColorfulNumString({
                    input: item.tvl,
                    decimals: 2,
                  })}
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
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    $
                    {toColorfulNumString({
                      input: item.volumeList?.find(
                        (volume) => volume?.timeRange === `${timeRange}D`,
                      )?.volume,
                      decimals: 2,
                    })}
                  </Box>
                  <Box
                    sx={{
                      typography: 'h6',
                      color: 'text.secondary',
                    }}
                  >
                    <Trans>Volume ({timeRange}d)</Trans>
                  </Box>
                </Box>
              )}
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
  loading,
  operatePool,
  setOperatePool,
  getMigrationPairAndMining,
  hasMore,
  loadMore,
  loadMoreLoading,
  supportAMM,
  timeRange,
  setOrderBy,
  setOrderDirection,
  orderBy,
  orderDirection,
}: {
  lqList: FetchLiquidityListLqList;
  loading: boolean;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  getMigrationPairAndMining?: (p: { address: string; chainId: number }) => void;
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
  supportAMM?: boolean;
  timeRange: '1' | '7' | '14' | '30';
  orderBy: 'updatedAt' | 'tvl' | 'apy' | 'liquidity' | 'volume' | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
  setOrderBy: (
    orderBy: 'updatedAt' | 'tvl' | 'apy' | 'liquidity' | 'volume' | undefined,
  ) => void;
  setOrderDirection: (orderDirection: 'asc' | 'desc' | undefined) => void;
}) {
  const theme = useTheme();
  const { onSharePool } = useUserOptions();
  return (
    <LiquidityTable
      hasMore={hasMore}
      loadMore={loadMore}
      loadMoreLoading={loadMoreLoading}
      empty={!lqList?.length}
      loading={loading}
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
            <TableSortButton
              direction={orderBy === 'tvl' ? orderDirection : undefined}
              onClick={() => {
                if (orderBy === 'tvl') {
                  if (orderDirection === 'desc') {
                    setOrderDirection('asc');
                    return;
                  }

                  setOrderBy(undefined);
                  setOrderDirection(undefined);
                  return;
                }

                setOrderBy('tvl');
                setOrderDirection('desc');
              }}
            >
              TVL
            </TableSortButton>
          </Box>
          <Box component="th">
            <TableSortButton
              direction={orderBy === 'apy' ? orderDirection : undefined}
              onClick={() => {
                if (orderBy === 'apy') {
                  if (orderDirection === 'desc') {
                    setOrderDirection('asc');
                    return;
                  }

                  setOrderBy(undefined);
                  setOrderDirection(undefined);
                  return;
                }

                setOrderBy('apy');
                setOrderDirection('desc');
              }}
            >
              {timeRange}d&nbsp;APY
            </TableSortButton>
          </Box>
          {supportAMM && (
            <th>
              <TableSortButton
                direction={orderBy === 'volume' ? orderDirection : undefined}
                onClick={() => {
                  if (orderBy === 'volume') {
                    if (orderDirection === 'desc') {
                      setOrderDirection('asc');
                      return;
                    }

                    setOrderBy(undefined);
                    setOrderDirection(undefined);
                    return;
                  }

                  setOrderBy('volume');
                  setOrderDirection('desc');
                }}
              >
                {timeRange}d&nbsp;Volume
              </TableSortButton>
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
          const timeRangeApy = item.apyList?.find(
            (apy) => apy?.timeRange === `${timeRange}D`,
          );
          const baseApy = timeRangeApy
            ? formatApy(
                new BigNumber(timeRangeApy?.transactionBaseApy)
                  .plus(timeRangeApy?.miningBaseApy ?? 0)
                  .plus(timeRangeApy?.metromMiningApy ?? 0),
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
            !!timeRangeApy?.metromMiningApy &&
            Number(timeRangeApy?.metromMiningApy) > 0;

          const type = item.type as PoolType;
          const poolType = getPoolAMMOrPMM(type);
          const isAMMV2 = type === 'AMMV2';
          const isAMMV3 = type === 'AMMV3';

          const hoverBg = theme.palette.hover.default;

          const migrationItem = getMigrationPairAndMining?.({
            address: item.id,
            chainId: item.chainId,
          });
          return (
            <Box
              component="tr"
              key={item.id + item.chainId}
              sx={{
                [`&:hover td${operateBtnText ? ', & td' : ''}`]: {
                  backgroundImage: `linear-gradient(${hoverBg}, ${hoverBg})`,
                },
              }}
            >
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
                      mr={8}
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
                      }}
                    >
                      {`${baseToken?.symbol}/${quoteToken?.symbol}`}
                      <LiquidityLpPartnerReward
                        address={item.id}
                        chainId={item.chainId}
                      />
                      {!!migrationItem && <MigrationTag />}
                    </Box>
                    <AddressWithLinkAndCopy
                      address={item.id}
                      customChainId={item.chainId}
                      truncate
                      showCopy
                      iconDarkHover
                      iconSize={14}
                      iconSpace={4}
                      onShareClick={
                        onSharePool
                          ? () =>
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
                          : undefined
                      }
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
                    }}
                  >
                    <PoolTypeTag poolType={poolType} />
                    <PoolFeeRateTag
                      isAMMV2={isAMMV2}
                      isAMMV3={isAMMV3}
                      lpFeeRate={item.lpFeeRate}
                      mtFeeRate={item.mtFeeRate}
                    />
                  </Box>
                </Box>
              )}
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                  }}
                  title={
                    item.tvl
                      ? `$${formatTokenAmountNumber({
                          input: item.tvl,
                          decimals: 2,
                        })}`
                      : undefined
                  }
                >
                  $
                  {toColorfulNumString({
                    input: item.tvl,
                    decimals: 2,
                  })}
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
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
                    apy={timeRangeApy}
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
                <Box
                  component="td"
                  sx={{
                    typography: 'body2',
                  }}
                >
                  $
                  {toColorfulNumString({
                    input: item.volumeList?.find(
                      (volume) => volume?.timeRange === `${timeRange}D`,
                    )?.volume,
                    decimals: 2,
                  })}
                </Box>
              )}
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                  }}
                >
                  {supportAMM && poolType === 'PMM' && (
                    <GoPoolDetailBtn chainId={item.chainId} address={item.id} />
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

export default function AddLiquidityList({
  scrollParentRef,
  filterChainIds,
  activeChainId,
  handleChangeActiveChainId,
  operatePool,
  setOperatePool,
  tokenAndPoolFilter,
  getMigrationPairAndMining,
  children,
}: {
  scrollParentRef: React.MutableRefObject<HTMLDivElement | null>;
  account?: string;
  filterChainIds?: ChainId[];

  activeChainId: ChainId | undefined;
  handleChangeActiveChainId: (chainId: number | undefined) => void;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  tokenAndPoolFilter?: TokenAndPoolFilterUserOptions;
  getMigrationPairAndMining?: (p: { address: string; chainId: number }) => void;
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  const { onlyChainId, supportAMMV2, supportAMMV3, notSupportPMM } =
    useUserOptions();
  const { minDevice, isMobile } = useWidgetDevice();
  const queryClient = useQueryClient();

  const [poolType, setPoolType] = useState<'all' | 'pmm' | 'v2' | 'v3'>('all');
  const [timeRange, setTimeRange] = useState<'1' | '7' | '14' | '30'>('1');
  const [orderDirection, setOrderDirection] = useState<
    'asc' | 'desc' | undefined
  >();
  // updatedAt tvl apy liquidity volume
  // undefined 默认排序
  const [orderBy, setOrderBy] = useState<
    'updatedAt' | 'tvl' | 'apy' | 'liquidity' | 'volume' | undefined
  >();

  const {
    filterTokens,
    filterASymbol,
    filterBSymbol,
    filterAddressLqList,

    handleDeleteToken,
    handleChangeFilterTokens,
    handleChangeFilterAddress,
  } = usePoolListFilterTokenAndPool(tokenAndPoolFilter);

  const filterTypes = useMemo(() => {
    if (supportAMMV3 && poolType === 'v3') {
      return ['AMMV3'];
    }
    if (supportAMMV2 && poolType === 'v2') {
      return ['AMMV2'];
    }
    if (!notSupportPMM && poolType === 'pmm') {
      return ['CLASSICAL', 'DVM', 'DSP', 'GSP'];
    }

    let filterTypes = notSupportPMM ? [] : ['CLASSICAL', 'DVM', 'DSP', 'GSP'];
    if (supportAMMV2) {
      filterTypes.push('AMMV2');
    }
    if (supportAMMV3) {
      filterTypes.push('AMMV3');
    }
    return filterTypes;
  }, [notSupportPMM, supportAMMV2, supportAMMV3, poolType]);

  const defaultQueryFilter = useMemo(() => {
    return {
      chainIds: filterChainIds,
      pageSize: isMobile ? 4 : 8,
      filterState: {
        viewOnlyOwn: false,
        filterTypes,
      },
      order: {
        timeRange: `${timeRange}D`,
        orderDirection,
        orderBy,
      },
    };
  }, [
    filterChainIds,
    filterTypes,
    isMobile,
    timeRange,
    orderBy,
    orderDirection,
  ]);

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

        {!onlyChainId && (
          <SelectChain
            chainId={activeChainId}
            setChainId={handleChangeActiveChainId}
          />
        )}

        {(supportAMMV2 || supportAMMV3) && (
          <FilterGroup
            filterList={[
              {
                label: 'All',
                value: 'all',
              },
            ]
              .concat(
                notSupportPMM
                  ? []
                  : [
                      {
                        label: 'PMM',
                        value: 'pmm',
                      },
                    ],
              )
              .concat(
                supportAMMV2
                  ? [
                      {
                        label: 'V2',
                        value: 'v2',
                      },
                    ]
                  : [],
              )
              .concat(
                supportAMMV3
                  ? [
                      {
                        label: 'V3',
                        value: 'v3',
                      },
                    ]
                  : [],
              )}
            value={poolType}
            onChange={(value) =>
              setPoolType(value as 'all' | 'pmm' | 'v2' | 'v3')
            }
          />
        )}

        <SortButtonGroup
          sortList={[
            {
              label: 'TVL',
              direction: orderBy === 'tvl' ? orderDirection : undefined,
              onClick: () => {
                if (orderBy === 'tvl') {
                  if (orderDirection === 'desc') {
                    setOrderDirection('asc');
                    return;
                  }

                  setOrderBy(undefined);
                  setOrderDirection(undefined);
                  return;
                }

                setOrderBy('tvl');
                setOrderDirection('desc');
              },
            },
            {
              label: `${timeRange}d APY`,
              direction: orderBy === 'apy' ? orderDirection : undefined,
              onClick: () => {
                if (orderBy === 'apy') {
                  if (orderDirection === 'desc') {
                    setOrderDirection('asc');
                    return;
                  }

                  setOrderBy(undefined);
                  setOrderDirection(undefined);
                  return;
                }

                setOrderBy('apy');
                setOrderDirection('desc');
              },
            },
            {
              label: `${timeRange}d Volume`,
              direction: orderBy === 'volume' ? orderDirection : undefined,
              onClick: () => {
                if (orderBy === 'volume') {
                  if (orderDirection === 'desc') {
                    setOrderDirection('asc');
                    return;
                  }

                  setOrderBy(undefined);
                  setOrderDirection(undefined);
                  return;
                }

                setOrderBy('volume');
                setOrderDirection('desc');
              },
            },
          ]}
        >
          <FilterGroup
            filterList={[
              {
                label: '1d',
                value: '1',
              },
              {
                label: '7d',
                value: '7',
              },
              {
                label: '14d',
                value: '14',
              },
              {
                label: '30d',
                value: '30',
              },
            ]}
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
            sx={{
              flex: 1,
            }}
          />
        </SortButtonGroup>

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
              lqList={lqList}
              setOperatePool={setOperatePool}
              supportAMM={supportAMMV2 || supportAMMV3}
              getMigrationPairAndMining={getMigrationPairAndMining}
              timeRange={timeRange}
            />
          </DataCardGroup>
        </InfiniteScroll>
      ) : (
        <>
          <TableList
            lqList={lqList}
            loading={fetchResult.isLoading}
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
            timeRange={timeRange}
            getMigrationPairAndMining={getMigrationPairAndMining}
            orderBy={orderBy}
            orderDirection={orderDirection}
            setOrderBy={setOrderBy}
            setOrderDirection={setOrderDirection}
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
