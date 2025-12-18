import { ChainId, PoolApi, PoolType } from '@dodoex/api';
import { alpha, Box, Button, Tooltip, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { CardStatus } from '../../../components/CardWidgets';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import LiquidityLpPartnerReward from '../../../components/LiquidityLpPartnerReward';
import { EmptyList } from '../../../components/List/EmptyList';
import { FailedList } from '../../../components/List/FailedList';
import SelectChain from '../../../components/SelectChain';
import TokenLogo from '../../../components/TokenLogo';
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
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../../utils';
import { InRangeDot } from '../AMMV3/components/InRangeDot';
import { FEE_AMOUNT_DETAIL } from '../AMMV3/components/shared';
import { FeeAmount } from '../AMMV3/sdks/v3-sdk';
import { Bound } from '../AMMV3/types';
import { formatTickPrice } from '../AMMV3/utils/formatTickPrice';
import { PoolOperateProps } from '../PoolOperate';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import {
  convertFetchMyLiquidityToOperateData,
  convertLiquidityTokenToTokenInfo,
  FetchMyLiquidityListLqList,
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
import { PoolFeeRateTag, PoolTypeTag } from './components/tags';
import TokenAndPoolFilter from './components/TokenAndPoolFilter';
import TokenListPoolItem from './components/TokenListPoolItem';
import {
  TokenAndPoolFilterUserOptions,
  usePoolListFilterTokenAndPool,
} from './hooks/usePoolListFilterTokenAndPool';
import { SortButtonGroup } from './components/SortButtonGroup';
import { TableSortButton } from './components/TableSortButton';

function CardList({
  account,
  lqList,
  setOperatePool,
  getMigrationPairAndMining,
  supportAMM,
  timeRange,
}: {
  account?: string;
  lqList: FetchMyLiquidityListLqList;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  getMigrationPairAndMining?: (p: { address: string; chainId: number }) => void;
  supportAMM?: boolean;
  timeRange: '1' | '7' | '14' | '30';
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
        const timeRangeApy = item.apyList?.find(
          (apy) => apy?.timeRange === `${timeRange}D`,
        );
        const singleSideLp = PoolApi.utils.singleSideLp(item.type as PoolType);
        const baseApy = timeRangeApy
          ? formatApy(
              new BigNumber(timeRangeApy?.transactionBaseApy)
                .plus(timeRangeApy?.miningBaseApy ?? 0)
                .plus(timeRangeApy?.metromMiningApy ?? 0),
            )
          : undefined;
        const quoteApy =
          singleSideLp && timeRangeApy
            ? formatApy(
                new BigNumber(timeRangeApy.transactionQuoteApy).plus(
                  timeRangeApy.miningQuoteApy ?? 0,
                ),
              )
            : undefined;

        let baseLpTokenBalance: BigNumber | undefined;
        let quoteLpTokenBalance: BigNumber | undefined;
        if (lq.liquidityPositions?.length) {
          lq.liquidityPositions.forEach((position) => {
            if (position?.liquidityTokenBalance) {
              const idArray = position.id?.split('-');
              if (idArray?.length === 2) {
                const positionLpTokenAddressLow =
                  idArray[1].toLocaleLowerCase();
                if (
                  item?.baseLpToken?.id?.toLocaleLowerCase() ===
                  positionLpTokenAddressLow
                ) {
                  baseLpTokenBalance = new BigNumber(
                    position.liquidityTokenBalance,
                  );
                  return;
                }
                if (
                  item?.quoteLpToken?.id?.toLocaleLowerCase() ===
                  positionLpTokenAddressLow
                ) {
                  quoteLpTokenBalance = new BigNumber(
                    position.liquidityTokenBalance,
                  );
                }
              }
            }
          });
        }
        const hasMining = !!item.miningAddress?.[0];
        const hasMetromMining =
          !!timeRangeApy?.metromMiningApy &&
          Number(timeRangeApy?.metromMiningApy) > 0;

        const position = lq.liquidityPositions?.[0];

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
            key={isAMMV3 ? position?.id : item.id + item.chainId}
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
                  {baseApy || '-%'}
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

              {isAMMV3 ? null : (
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
              )}

              {type === 'AMMV2' && (
                <Box>
                  <Box
                    sx={{
                      typography: 'h5',
                    }}
                  >
                    {formatPercentageNumber({
                      input: lq.liquidityPositions?.[0]?.poolShare,
                    })}
                  </Box>
                  <Box
                    sx={{
                      typography: 'h6',
                      color: 'text.secondary',
                    }}
                  >
                    <Trans>My Pool Share</Trans>
                  </Box>
                </Box>
              )}

              {/* my liquidity */}
              <Box>
                <Box
                  sx={{
                    typography: 'h5',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {isAMMV3 ? (
                    position?.liquidityUSD ? (
                      `$${formatTokenAmountNumber({
                        input: position.liquidityUSD,
                        decimals: 2,
                      })}`
                    ) : (
                      '-'
                    )
                  ) : (
                    <>
                      {singleSideLp ? (
                        <TokenLogo
                          address={baseToken?.address}
                          chainId={item.chainId}
                          url={baseToken?.logoURI}
                          width={18}
                          height={18}
                          sx={{
                            mr: 4,
                          }}
                        />
                      ) : (
                        <TokenLogoPair
                          tokens={
                            baseToken && quoteToken
                              ? [baseToken, quoteToken]
                              : []
                          }
                          width={18}
                          mr={4}
                          showChainLogo={false}
                          chainId={item.chainId}
                        />
                      )}
                      {baseLpTokenBalance
                        ? formatReadableNumber({
                            input: baseLpTokenBalance,
                          })
                        : ''}
                      {singleSideLp && (
                        <>
                          {' / '}
                          <TokenLogo
                            address={quoteToken?.address}
                            chainId={item.chainId}
                            url={quoteToken?.logoURI}
                            width={18}
                            height={18}
                            sx={{
                              mx: 4,
                            }}
                          />
                          {quoteLpTokenBalance
                            ? formatReadableNumber({
                                input: quoteLpTokenBalance,
                              })
                            : '0'}
                        </>
                      )}
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <Trans>My Liquidity</Trans>
                </Box>
              </Box>
            </Box>

            {isAMMV3 && (
              <Box
                sx={{
                  mt: 20,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: 'text.primary',
                  }}
                >
                  <InRangeDot outOfRange={position?.outOfRange ?? false} />
                  <Box>
                    <>
                      <span>
                        {formatTickPrice({
                          price: position?.priceRange?.token0LowerPrice,
                          atLimit: {},
                          direction: Bound.LOWER,
                        })}
                        &nbsp;
                      </span>
                      {baseToken?.symbol}
                    </>
                  </Box>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M15.75 9.50293L12.75 12.5029L11.7 11.4529L12.8813 10.2529L5.11875 10.2529L6.3 11.4529L5.25 12.5029L2.25 9.50293L5.25 6.50293L6.31875 7.55293L5.11875 8.75293L12.8813 8.75293L11.7 7.55293L12.75 6.50293L15.75 9.50293Z"
                      fill="currentColor"
                      fillOpacity="0.5"
                    />
                  </svg>
                  <Box>
                    <>
                      <span>
                        {formatTickPrice({
                          price: position?.priceRange?.token1LowerPrice,
                          atLimit: {},
                          direction: Bound.UPPER,
                        })}
                        &nbsp;
                      </span>
                      {baseToken?.symbol}
                    </>
                  </Box>
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <Trans>Price Range</Trans>
                </Box>
              </Box>
            )}

            {/* operate */}
            <Box
              sx={{
                mt: 20,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isAMMV3
                ? null
                : !!account && (
                    <Button
                      fullWidth
                      variant={Button.Variant.outlined}
                      size={Button.Size.small}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        setOperatePool({
                          operate: OperateTab.Remove,
                          pool: convertFetchMyLiquidityToOperateData(lq),
                          hasMining,
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
                  setOperatePool({
                    operate: OperateTab.Add,
                    pool: convertFetchMyLiquidityToOperateData(lq),
                    hasMining,
                  });
                }}
              >
                <Trans>{isAMMV3 ? 'Manage' : 'Add'}</Trans>
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
  account,
  lqList,
  loading,
  operatePool,
  setOperatePool,
  supportAMM,
  onlyV3,
  getMigrationPairAndMining,
  timeRange,
  setOrderBy,
  setOrderDirection,
  orderBy,
  orderDirection,
}: {
  account?: string;
  lqList: FetchMyLiquidityListLqList;
  loading: boolean;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  supportAMM?: boolean;
  onlyV3?: boolean;
  getMigrationPairAndMining?: (p: { address: string; chainId: number }) => void;
  timeRange: '1' | '7' | '14' | '30';
  orderBy: 'updatedAt' | 'tvl' | 'apy' | 'liquidity' | 'volume' | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
  setOrderBy: (
    orderBy: 'updatedAt' | 'tvl' | 'apy' | 'liquidity' | 'volume' | undefined,
  ) => void;
  setOrderDirection: (orderDirection: 'asc' | 'desc' | undefined) => void;
}) {
  const theme = useTheme();
  return (
    <LiquidityTable empty={!lqList?.length} loading={loading}>
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
          {onlyV3 ? null : (
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
          )}
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
          <Box component="th">
            <Trans>My Liquidity</Trans>
          </Box>

          {onlyV3 ? (
            <Box component="th">
              <Trans>Price Range</Trans>
            </Box>
          ) : null}

          <Box
            component="th"
            sx={{
              width: 210,
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
          const singleSideLp = PoolApi.utils.singleSideLp(
            item.type as PoolType,
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
            singleSideLp && timeRangeApy
              ? formatApy(
                  new BigNumber(timeRangeApy.transactionQuoteApy).plus(
                    timeRangeApy.miningQuoteApy ?? 0,
                  ),
                )
              : undefined;

          let baseLpTokenBalance: BigNumber | undefined;
          let quoteLpTokenBalance: BigNumber | undefined;
          if (lq.liquidityPositions?.length) {
            lq.liquidityPositions.forEach((position) => {
              if (position?.liquidityTokenBalance) {
                const idArray = position.id?.split('-');
                if (idArray?.length === 2) {
                  const positionLpTokenAddressLow =
                    idArray[1].toLocaleLowerCase();
                  if (
                    item?.baseLpToken?.id?.toLocaleLowerCase() ===
                    positionLpTokenAddressLow
                  ) {
                    baseLpTokenBalance = new BigNumber(
                      position.liquidityTokenBalance,
                    );
                    return;
                  }
                  if (
                    item?.quoteLpToken?.id?.toLocaleLowerCase() ===
                    positionLpTokenAddressLow
                  ) {
                    quoteLpTokenBalance = new BigNumber(
                      position.liquidityTokenBalance,
                    );
                  }
                }
              }
            });
          }

          const position = lq.liquidityPositions?.[0];

          const type = item.type as PoolType;
          const poolType = getPoolAMMOrPMM(type);
          const isAMMV2 = type === 'AMMV2';
          const isAMMV3 = type === 'AMMV3';

          let operateBtnText = '';
          if (isAMMV3) {
            if (
              operatePool?.pool?.liquidityPositions?.[0]?.id === position?.id
            ) {
              operateBtnText = t`Managing`;
            }
          } else {
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
          }
          const hasMining = !!item.miningAddress?.[0];
          const hasMetromMining =
            !!timeRangeApy?.metromMiningApy &&
            Number(timeRangeApy?.metromMiningApy) > 0;
          const hoverBg = theme.palette.hover.default;

          const migrationItem = getMigrationPairAndMining?.({
            address: item.id,
            chainId: item.chainId,
          });

          return (
            <Box
              component="tr"
              key={isAMMV3 ? position?.id : item.id + item.chainId}
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
                      sx={{
                        typography: 'h6',
                        color: 'text.secondary',
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
              {isAMMV3 ? null : (
                <Box component="td">
                  <Box
                    sx={{
                      typography: 'body2',
                    }}
                    title={
                      item.tvl
                        ? `$${formatReadableNumber({
                            input: item.tvl || 0,
                          })}`
                        : undefined
                    }
                  >
                    $
                    {toColorfulNumString({
                      input: item.tvl || 0,
                      decimals: 2,
                    })}
                  </Box>
                </Box>
              )}

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
                      {baseApy || '-%'}
                      {quoteApy ? `/${quoteApy}` : ''}
                    </Box>
                  </PoolApyTooltip>
                </Box>
              </Box>

              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    typography: 'body2',
                  }}
                >
                  {isAMMV3 ? (
                    position?.liquidityUSD ? (
                      `$${formatTokenAmountNumber({
                        input: position.liquidityUSD,
                        decimals: 2,
                      })}`
                    ) : (
                      '-'
                    )
                  ) : (
                    <>
                      {singleSideLp ? (
                        <TokenLogo
                          address={baseToken?.address}
                          chainId={item.chainId}
                          url={baseToken?.logoURI}
                          width={24}
                          height={24}
                          noShowChain
                          sx={{
                            mr: 4,
                          }}
                        />
                      ) : (
                        <TokenLogoPair
                          tokens={
                            baseToken && quoteToken
                              ? [baseToken, quoteToken]
                              : []
                          }
                          width={24}
                          mr={4}
                          showChainLogo={false}
                          chainId={item.chainId}
                        />
                      )}
                      {baseLpTokenBalance
                        ? formatReadableNumber({
                            input: baseLpTokenBalance,
                          })
                        : '-'}
                      {singleSideLp && (
                        <>
                          {' / '}
                          <TokenLogo
                            address={quoteToken?.address}
                            chainId={item.chainId}
                            url={quoteToken?.logoURI}
                            width={24}
                            height={24}
                            noShowChain
                            sx={{
                              mx: 4,
                            }}
                          />
                          {quoteLpTokenBalance
                            ? formatReadableNumber({
                                input: quoteLpTokenBalance,
                              })
                            : '0'}
                        </>
                      )}
                      {isAMMV2 && (
                        <Tooltip title={<Trans>My pool share</Trans>}>
                          <Box
                            sx={{
                              ml: 4,
                              px: 8,
                              py: 4,
                              borderRadius: 4,
                              typography: 'h6',
                              backgroundColor: 'background.tag',
                              color: 'text.secondary',
                            }}
                          >
                            {formatPercentageNumber({
                              input: lq.liquidityPositions?.[0]?.poolShare,
                            })}
                          </Box>
                        </Tooltip>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {onlyV3 ? (
                <Box component="td">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'text.primary',
                    }}
                  >
                    <InRangeDot outOfRange={position?.outOfRange ?? false} />
                    <Box>
                      <>
                        <span>
                          {formatTickPrice({
                            price: position?.priceRange?.token0LowerPrice,
                            atLimit: {},
                            direction: Bound.LOWER,
                          })}
                          &nbsp;
                        </span>
                        {baseToken?.symbol}
                      </>
                    </Box>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                    >
                      <path
                        d="M15.75 9.50293L12.75 12.5029L11.7 11.4529L12.8813 10.2529L5.11875 10.2529L6.3 11.4529L5.25 12.5029L2.25 9.50293L5.25 6.50293L6.31875 7.55293L5.11875 8.75293L12.8813 8.75293L11.7 7.55293L12.75 6.50293L15.75 9.50293Z"
                        fill="currentColor"
                        fillOpacity="0.5"
                      />
                    </svg>
                    <Box>
                      <>
                        <span>
                          {formatTickPrice({
                            price: position?.priceRange?.token0UpperPrice,
                            atLimit: {},
                            direction: Bound.UPPER,
                          })}
                          &nbsp;
                        </span>
                        {baseToken?.symbol}
                      </>
                    </Box>
                  </Box>
                </Box>
              ) : null}

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
                    <>
                      {isAMMV3
                        ? null
                        : !!account && (
                            <Button
                              variant={Button.Variant.second}
                              size={Button.Size.small}
                              onClick={(evt) => {
                                evt.stopPropagation();
                                setOperatePool({
                                  operate: OperateTab.Remove,
                                  pool: convertFetchMyLiquidityToOperateData(
                                    lq,
                                  ),
                                  hasMining,
                                });
                              }}
                              sx={{
                                py: 0,
                                height: 32,
                              }}
                            >
                              <Trans>Remove</Trans>
                              {!!migrationItem && <MigrationTag isRightTop />}
                            </Button>
                          )}
                      <Button
                        size={Button.Size.small}
                        onClick={() => {
                          setOperatePool({
                            pool: convertFetchMyLiquidityToOperateData(lq),
                            hasMining,
                          });
                        }}
                        sx={{
                          py: 0,
                          height: 32,
                        }}
                      >
                        {isAMMV3 ? t`Manage` : t`Add`}
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

export default function MyLiquidity({
  account,
  filterChainIds,
  activeChainId,
  handleChangeActiveChainId,
  operatePool,
  setOperatePool,
  getMigrationPairAndMining,
  tokenAndPoolFilter,
  children,
}: {
  account?: string;
  filterChainIds?: ChainId[];

  activeChainId: ChainId | undefined;
  handleChangeActiveChainId: (chainId: number | undefined) => void;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  getMigrationPairAndMining?: (p: { address: string; chainId: number }) => void;
  tokenAndPoolFilter?: TokenAndPoolFilterUserOptions;
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  const { minDevice, isMobile } = useWidgetDevice();
  const queryClient = useQueryClient();
  const { onlyChainId, supportAMMV2, supportAMMV3, notSupportPMM } =
    useUserOptions();

  const [poolType, setPoolType] = useState<'v3' | 'pmm&v2'>('pmm&v2');
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

  let filterTypes: PoolType[] = notSupportPMM
    ? []
    : ['CLASSICAL', 'DVM', 'DSP', 'GSP', 'DPP'];
  if (supportAMMV2) {
    filterTypes.push('AMMV2');
  }
  if (supportAMMV3 && poolType === 'v3') {
    filterTypes = ['AMMV3'];
  }

  const defaultQueryFilter = {
    chainIds: filterChainIds,
    currentPage: 1,
    pageSize: 1000,
    user: account,
    filterState: {
      viewOnlyOwn: true,
      filterTypes,
    },
    order: {
      timeRange: `${timeRange}D`,
      orderDirection,
      orderBy,
    },
  };

  const graphQLRequests = useGraphQLRequests();
  const query = graphQLRequests.getQuery(PoolApi.graphql.fetchMyLiquidityList, {
    where: {
      ...defaultQueryFilter,
      filterState: {
        filterASymbol,
        filterBSymbol,
        ...defaultQueryFilter.filterState,
      },
    },
  });
  const fetchResult = useQuery({
    ...query,
  });

  let lqList = fetchResult.data?.liquidity_list?.lqList ?? [];
  const hasFilterAddress = !!filterAddressLqList?.length;
  if (hasFilterAddress) {
    lqList = [...filterAddressLqList];
  } else if (filterChainIds) {
    lqList =
      fetchResult.data?.liquidity_list?.lqList?.filter((lq) =>
        filterChainIds.includes(lq?.pair?.chainId ?? 0),
      ) ?? [];
  }

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

        {supportAMMV3 && (
          <FilterGroup
            filterList={[
              {
                label: 'V3',
                value: 'v3',
              },
              {
                label: 'V2 & PMM',
                value: 'pmm&v2',
              },
            ]}
            value={poolType}
            onChange={(value) => {
              setPoolType(value);
              setOrderBy(undefined);
              setOrderDirection(undefined);
            }}
          />
        )}

        <SortButtonGroup
          sortList={(poolType === 'v3'
            ? []
            : [
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
              ]
          ).concat([
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
          ])}
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
          <CardList
            account={account}
            lqList={lqList}
            setOperatePool={setOperatePool}
            supportAMM={supportAMMV2 || supportAMMV3}
            getMigrationPairAndMining={getMigrationPairAndMining}
            timeRange={timeRange}
          />
        </DataCardGroup>
      ) : (
        <>
          <TableList
            account={account}
            lqList={lqList}
            loading={fetchResult.isLoading}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
            supportAMM={supportAMMV2 || supportAMMV3}
            onlyV3={poolType === 'v3'}
            orderBy={orderBy}
            orderDirection={orderDirection}
            setOrderBy={setOrderBy}
            setOrderDirection={setOrderDirection}
            getMigrationPairAndMining={getMigrationPairAndMining}
            timeRange={timeRange}
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
