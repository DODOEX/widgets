import { alpha, Box, Button, useTheme } from '@dodoex/components';
import { PoolApi, PoolType } from '@dodoex/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  convertFetchLiquidityToOperateData,
  convertLiquidityTokenToTokenInfo,
} from '../utils';
import { ChainId } from '../../../constants/chains';
import React from 'react';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import {
  formatApy,
  formatExponentialNotation,
  formatReadableNumber,
} from '../../../utils';
import PoolApyTooltip from './components/PoolApyTooltip';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
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
import PoolOperate, { PoolOperateProps } from '../PoolOperate';
import { graphQLRequests } from '../../../constants/api';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import { OperatePool } from '../PoolOperate/types';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import TokenLogo from '../../../components/TokenLogo';

export default function MyLiquidity({
  account,
  filterChainIds,
  activeChainId,
  handleChangeActiveChainId,
}: {
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
    currentPage: 1,
    pageSize: 1000,
    user: account,
    filterState: {
      viewOnlyOwn: true,
    },
  };

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
  const [operatePool, setOperatePool] =
    React.useState<{
      pool: PoolOperateProps['pool'];
      operate: PoolOperateProps['operate'];
    } | null>(null);

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
            const singleSideLp = PoolApi.utils.singleSideLp(
              item.type as PoolType,
            );
            const baseApy = item.apy
              ? formatApy(
                  new BigNumber(item.apy?.transactionBaseApy).plus(
                    item.apy?.miningBaseApy ?? 0,
                  ),
                )
              : undefined;
            const quoteApy =
              singleSideLp && item.apy
                ? formatApy(
                    new BigNumber(item.apy.transactionQuoteApy).plus(
                      item.apy.miningQuoteApy ?? 0,
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
                  {item.miningAddress ? (
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
                {/* my liquidity */}
                <Box>
                  <Box
                    sx={{
                      mt: 12,
                      typography: 'h5',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 'bold',
                    }}
                  >
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
                          baseToken && quoteToken ? [baseToken, quoteToken] : []
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
                {/* operate */}
                <Box
                  sx={{
                    mt: 20,
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  {!!account && (
                    <NeedConnectButton
                      fullWidth
                      variant={Button.Variant.outlined}
                      size={Button.Size.small}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        setOperatePool({
                          operate: OperateTab.Remove,
                          pool: convertFetchLiquidityToOperateData(lq),
                        });
                      }}
                    >
                      <Trans>Remove</Trans>
                    </NeedConnectButton>
                  )}
                  <NeedConnectButton
                    fullWidth
                    size={Button.Size.small}
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setOperatePool({
                        operate: OperateTab.Add,
                        pool: convertFetchLiquidityToOperateData(lq),
                      });
                    }}
                  >
                    <Trans>Add</Trans>
                  </NeedConnectButton>
                </Box>
              </Box>
            );
          })}
        </>
      </DataCardGroup>
      <PoolOperate
        account={account}
        pool={operatePool?.pool}
        operate={operatePool?.operate}
        onClose={() => setOperatePool(null)}
      />
    </>
  );
}
