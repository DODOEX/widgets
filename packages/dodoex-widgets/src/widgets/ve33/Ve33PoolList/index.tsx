import { ChainId, PoolApi } from '@dodoex/api';
import { Box, SearchInput, Switch, useTheme } from '@dodoex/components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { CardStatus } from '../../../components/CardWidgets';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { Ve33PoolInfoI, Ve33PoolOperateProps } from '../types';
import { compositePoolInfo } from '../utils';
import { TableList } from './TableList';
import PoolOperateDialog from '../Ve33PoolOperate';

export interface Ve33PoolListProps {
  onClickPoolListRow: (id: string, chainId: ChainId) => void;
}

export const Ve33PoolList = ({ onClickPoolListRow }: Ve33PoolListProps) => {
  // TODO: need replace
  const chainId = ChainId.MORPH_HOLESKY_TESTNET;
  const { account } = useWalletInfo();
  const { isMobile } = useWidgetDevice();
  const graphQLRequests = useGraphQLRequests();
  const theme = useTheme();

  const [filterToken, setFilterToken] = useState<string>('');
  const [usdValueChecked, setUsdValueChecked] = useState(false);
  const [operatePool, setOperatePool] = useState<Ve33PoolOperateProps | null>(
    // null,
    {
      poolInfo: {
        id: '0x2f63a87bf42dc4c021af8be085cece16269e3b67',
        title: 'V3.CL=200',
        version: 'v3',
        gaugeAddress: '0x640be2253a65740152dc933fab757606e9c7bd52',
        feeRate: '3000',
        apr: {
          fees: '0',
          incentives: '0',
        },
        tvl: '0',
        totalValueLockedUSD: '0',
        totalValueLockedToken0: '0',
        totalValueLockedToken1: '0',
        volumeUSD: '0',
        volumeToken0: '0',
        volumeToken1: '0',
        feesUSD: '0',
        feesToken0: '0',
        feesToken1: '0',
        token0Address: '0x42edf453f8483c7168c158d28d610a58308517d1',
        token0Name: 'Momodrome',
        token0Symbol: 'MOMO',
        token0Decimals: 18,
        token1Address: '0x5300000000000000000000000000000000000011',
        token1Name: 'Wrapped Ether',
        token1Symbol: 'WETH',
        token1Decimals: 18,
        chainId: 2810,
        stable: true,
        fee: '3000',
        type: 2,
        baseToken: {
          chainId: 2810,
          address: '0x42edf453f8483c7168c158d28d610a58308517d1',
          name: 'Momodrome',
          decimals: 18,
          symbol: 'MOMO',
        },
        quoteToken: {
          chainId: 2810,
          address: '0x5300000000000000000000000000000000000011',
          name: 'Wrapped Ether',
          decimals: 18,
          symbol: 'WETH',
        },
      },
      operateType: 1,
    },
  );

  const scrollParentRef = useRef<HTMLDivElement>(null);

  const query = graphQLRequests.getInfiniteQuery(
    PoolApi.graphql.fetchVe33PoolList,
    'page',
    {
      where: {
        token_starts_with: filterToken,
        size: isMobile ? 4 : 8,
      },
    },
  );
  const fetchResult = useInfiniteQuery({
    ...query,
    initialPageParam: 1,
    getNextPageParam: (item) => {
      return null;
      // const { currentPage, totalCount, pageSize } = item.ve33_getPoolList ?? {};
      // if (!currentPage || !totalCount || !pageSize) {
      //   return null;
      // }
      // let totalPage = Math.floor(totalCount / pageSize);
      // if (totalCount % pageSize) {
      //   totalPage += 1;
      // }
      // if (currentPage >= totalPage) {
      //   return null;
      // }
      // return currentPage + 1;
    },
  });

  const hasMore = fetchResult.hasNextPage;
  const poolList = useMemo(() => {
    const list = [] as Ve33PoolInfoI[];
    fetchResult.data?.pages.forEach((page) => {
      page.ve33_getPoolList?.forEach((pool) => {
        if (pool) {
          list.push(compositePoolInfo(pool, chainId));
        }
      });
    });
    return list;
  }, [chainId, fetchResult.data?.pages]);

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        gap: 20,
        flex: 1,
      }}
      ref={scrollParentRef}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flex: 1,
          overflow: 'hidden',
          height: 'max-content',
          maxHeight: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <SearchInput
            placeholder="Select by token"
            sx={{
              backgroundColor: theme.palette.background.paperDarkContrast,
              borderRadius: 24,
            }}
            height={40}
            value={filterToken}
            onChange={(e) => {
              setFilterToken(e.target.value);
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              px: 20,
              py: 8,
              borderRadius: 24,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: theme.palette.border.main,
            }}
          >
            <Box
              sx={{
                typography: 'body2',
                color: theme.palette.text.primary,
                fontWeight: 600,
              }}
            >
              $VALUE
            </Box>
            <Switch
              checked={usdValueChecked}
              onChange={(e, checked) => {
                setUsdValueChecked(checked);
              }}
            />
          </Box>
        </Box>

        <TableList
          chainId={chainId}
          poolList={poolList}
          usdValueChecked={usdValueChecked}
          operatePool={operatePool}
          setOperatePool={setOperatePool}
          hasMore={hasMore}
          loadMoreLoading={fetchResult.isFetchingNextPage}
          loadMore={() => {
            if (fetchResult.hasNextPage && !fetchResult.isFetching) {
              fetchResult.fetchNextPage();
            }
          }}
          onClickPoolListRow={onClickPoolListRow}
        />

        <CardStatus
          loading={fetchResult.isLoading}
          refetch={fetchResult.error ? fetchResult.refetch : undefined}
          empty={!poolList?.length}
          hasSearch={!!filterToken}
        />
      </Box>
      {operatePool && (
        <PoolOperateDialog
          account={account}
          onClose={() => setOperatePool(null)}
          pool={operatePool?.poolInfo}
          operate={operatePool.operateType}
        />
      )}
    </WidgetContainer>
  );
};
