import { PoolApi } from '@dodoex/api';
import { alpha, Box, SearchInput, Switch, useTheme } from '@dodoex/components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useRef, useState } from 'react';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { Ve33PoolOperateProps } from '../types';
import { CardStatus } from '../../../components/CardWidgets';
import { TableList } from './TableList';

export interface Ve33PoolListProps {}

export const Ve33PoolList = (props: Ve33PoolListProps) => {
  const { account, chainId: currentChainId } = useWeb3React();
  const { onlyChainId: chainId } = useUserOptions();
  const { isMobile } = useWidgetDevice();
  const graphQLRequests = useGraphQLRequests();
  const theme = useTheme();

  const [filterToken, setFilterToken] = useState<string>('');
  const [usdValueChecked, setUsdValueChecked] = useState(false);
  const [operatePool, setOperatePool] =
    useState<Partial<Ve33PoolOperateProps> | null>(null);

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
      const { currentPage, totalCount, pageSize } = item.ve33_getPoolList ?? {};
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

  const hasMore = fetchResult.hasNextPage;

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        gap: 12,
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
              backgroundColor: alpha(theme.palette.text.primary, 0.1),
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
          empty
          hasSearch
        />
      </Box>
      {operatePool && (
        <Box
          sx={{
            position: 'relative',
            width: 375,
          }}
        >
          {operatePool.poolInfo?.title ?? '-'}
        </Box>
      )}
    </WidgetContainer>
  );
};
