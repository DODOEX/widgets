import { alpha, Box, Button, useTheme } from '@dodoex/components';
import { PoolApi } from '@dodoex/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroller';
import { convertLiquidityTokenToTokenInfo, poolApi } from '../utils';
import { basicTokenMap, ChainId } from '../../../constants/chains';
import React from 'react';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import {
  formatExponentialNotation,
  formatReadableNumber,
} from '../../../utils';
import PoolApyTooltip from './components/PoolApyTooltip';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import { debounce } from 'lodash';

function convertLqData(
  lq: ReturnType<
    Exclude<typeof PoolApi.fetchLiquidityList['__apiType'], undefined>
  >,
) {
  const lqListResult = lq.liquidity_list?.lqList?.map((item) => {
    const baseReserve = new BigNumber(item?.pair?.baseReserve);
    const quoteReserve = new BigNumber(item?.pair?.quoteReserve);
    const baseShowDecimals = +item?.pair?.baseToken.decimals > 6 ? 6 : 4;
    const quoteShowDecimals = +item?.pair?.quoteToken.decimals > 6 ? 6 : 4;
    const pairType = item?.pair?.type.toUpperCase();
    const isSingle = !(pairType === 'DVM' || pairType === 'DSP');
    const isSellPool = pairType === 'DVM' && new BigNumber(quoteReserve).eq(0);
    const isEmptyDspPool =
      pairType === 'DSP' && (quoteReserve.eq(0) || baseReserve.eq(0));
    const i = new BigNumber(+item?.pair?.i || 0);
    // eslint-disable-next-line no-nested-ternary
    const addPortion = isEmptyDspPool
      ? i
      : isSellPool
      ? new BigNumber(1)
      : quoteReserve.div(baseReserve);
    // eslint-disable-next-line no-nested-ternary
    const addPortionText = isEmptyDspPool
      ? formatReadableNumber({
          input: i,
          showDecimals: baseShowDecimals,
        })
      : baseReserve.eq(0)
      ? '-'
      : formatReadableNumber({
          input: quoteReserve.div(baseReserve),
          showDecimals: baseShowDecimals,
        });
    // eslint-disable-next-line no-nested-ternary
    const addPortionReverseText = isEmptyDspPool
      ? formatReadableNumber({
          input: new BigNumber(1).div(i),
          showDecimals: baseShowDecimals,
        })
      : isSellPool
      ? '-'
      : formatReadableNumber({
          input: baseReserve.div(quoteReserve),
          showDecimals: quoteShowDecimals,
        });
    const miningAddressList = item?.pair?.miningAddress ?? [];
    const miningAddress = miningAddressList.length ? miningAddressList[0] : '';
    const EtherToken = basicTokenMap[item?.pair?.chainId as ChainId];
    return {
      ...item?.pair,
      // baseToken: convertToken(
      //   item?.pair
      //     ?.baseToken,
      //     EtherToken,
      // ),
      // quoteToken: convertToken(
      //   item?.pair
      //     ?.quoteToken,
      //     EtherToken,
      // ),
      isSingle,
      isClassical: pairType === 'CLASSICAL',
      isSellPool,
      type: pairType,
      addPortion,
      addPortionText,
      addPortionReverseText,
      baseShowDecimals,
      quoteShowDecimals,
      id: item?.id,
      pairId: item?.pair?.id,
      // @ts-ignore
      tvl: item.pair.tvl,
      // @ts-ignore
      baseApy: item.pair.apy
        ? formatReadableNumber({
            input: new BigNumber(item.pair.apy?.transactionBaseApy).plus(
              item.pair.apy?.miningBaseApy ?? 0,
            ),
          })
        : undefined,
      quoteApy: item.pair.apy
        ? formatReadableNumber({
            input: new BigNumber(item.pair.apy?.transactionQuoteApy).plus(
              item.pair.apy?.miningQuoteApy ?? 0,
            ),
          })
        : undefined,
      miningAddress,
      creator: item.pair?.creator ?? '',
    };
  });
  return {
    liquidity_list: {
      ...item.liquidity_list,
      lqList: lqListResult,
    },
  };
}

export default function AddLiquidityList({
  scrollParentRef,
  account,
  filterASymbol,
  filterBSymbol,
  filterAddress,
  filterChainIds,
}: {
  scrollParentRef: React.MutableRefObject<HTMLDivElement | undefined>;
  account?: string;
  filterASymbol?: string;
  filterBSymbol?: string;
  filterAddress?: string;
  filterChainIds?: ChainId[];
}) {
  const theme = useTheme();
  const query = poolApi.getInfiniteQuery(PoolApi.fetchLiquidityList, {
    where: {
      user: account,
      filterState: {
        filterASymbol,
        filterBSymbol,
        address: filterAddress,
        viewOnlyOwn: false,
        filterTypes: ['CLASSICAL', 'DVM', 'DSP'],
      },
      chainIds: filterChainIds,
    },
  });
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
  const goDetailPage = () => {};

  return (
    <DataCardGroup>
      <InfiniteScroll
        hasMore={fetchResult.hasNextPage}
        threshold={300}
        loadMore={debounce(() => {
          console.log('jie', fetchResult);
          if (fetchResult.hasNextPage && !fetchResult.isFetching) {
            fetchResult.fetchNextPage();
          }
        }, 500)}
        useWindow={false}
        getScrollParent={() => scrollParentRef.current || null}
      >
        <>
          {fetchResult.data?.pages.map((page) => (
            <React.Fragment key={page.liquidity_list?.currentPage}>
              {page.liquidity_list?.lqList?.map((lq) => {
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
                  ? formatReadableNumber({
                      input: new BigNumber(item.apy?.transactionBaseApy).plus(
                        item.apy?.miningBaseApy ?? 0,
                      ),
                    })
                  : undefined;
                const quoteApy =
                  !(item.type === 'DVM' || item.type === 'DSP') && item.apy
                    ? formatReadableNumber({
                        input: new BigNumber(item.apy.transactionQuoteApy).plus(
                          item.apy.miningQuoteApy ?? 0,
                        ),
                      })
                    : undefined;
                return (
                  <Box
                    key={item.id}
                    sx={{
                      px: 20,
                      pt: 20,
                      pb: 12,
                      backgroundColor: 'background.paperContrast',
                      borderRadius: 16,
                      mb: 12,
                    }}
                    onClick={() => {
                      goDetailPage(item);
                    }}
                  >
                    {/* title */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
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
                    <Button
                      fullWidth
                      size={Button.Size.small}
                      sx={{
                        mt: 20,
                      }}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        // useSwitchNetworkStore.getState().openSwitchNetworkConfirm({
                        //   chainId: item.chainId,
                        //   title: 'pool.switch-network.title.add',
                        //   autoSwitchKey: AccountStatusType.AutoSwitchNetworkPool,
                        //   successCallback: () => {
                        //     usePoolOperateStore.getState().addPool(
                        //       {
                        //         address: item.pairId,
                        //         ...item,
                        //         baseToken: convertLiquidityToken(item.baseToken),
                        //         quoteToken: convertLiquidityToken(item.quoteToken),
                        //         baseReserve: item.baseReserve,
                        //         quoteReserve: item.quoteReserve,
                        //         poolType: item.type,
                        //         baseLpToken: item.baseLpToken ?? undefined,
                        //         quoteLpToken: item.quoteLpToken ?? undefined,
                        //         i: item.i,
                        //         miningAddress: item.miningAddress,
                        //         creator: item.creator,
                        //       },
                        //       {
                        //         chainId: item.chainId,
                        //         client,
                        //       },
                        //     );
                        //   },
                        // });
                      }}
                    >
                      <Trans>Add</Trans>
                    </Button>
                  </Box>
                );
              })}
            </React.Fragment>
          ))}
        </>
      </InfiniteScroll>
    </DataCardGroup>
  );
}
