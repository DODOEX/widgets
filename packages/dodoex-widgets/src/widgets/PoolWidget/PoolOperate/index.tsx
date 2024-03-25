import { Box, TabPanel, Tabs, TabsGroup } from '@dodoex/components';
import Dialog from '../../../components/Dialog';
import {
  PoolOrMiningTab,
  usePoolOrMiningTabs,
} from './hooks/usePoolOrMiningTabs';
import { Error } from '@dodoex/icons';
import PoolOperateInner, { PoolOperateInnerProps } from './PoolOperateInner';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { graphQLRequests } from '../../../constants/api';
import { PoolApi } from '@dodoex/api';
import { convertFetchPoolToOperateData } from '../utils';

export interface PoolOperateProps {
  onClose: () => void;
  account: string | undefined;
  pool?: PoolOperateInnerProps['pool'];
  address?: string;
  operate?: PoolOperateInnerProps['operate'];
  chainId?: number;
}

export default function PoolOperate({
  onClose,
  pool: poolProps,
  address,
  operate,
  chainId,
}: PoolOperateProps) {
  const { poolOrMiningTab, poolOrMiningTabs, handleChangeTab } =
    usePoolOrMiningTabs();

  const fetchResult = useQuery({
    ...graphQLRequests.getQuery(PoolApi.graphql.fetchPoolList, {
      where: {
        id: address?.toLocaleLowerCase() ?? '',
        chain: 'gor',
      },
    }),
    enabled: !!address && !!chainId,
  });
  const fetchPool = fetchResult.data?.pairs?.[0];
  const convertFetchPool =
    fetchPool && chainId
      ? convertFetchPoolToOperateData(fetchPool, chainId)
      : undefined;
  const pool = address && chainId ? convertFetchPool : poolProps;

  const poolErrorRefetch = fetchResult.error ? fetchResult.refetch : undefined;
  return (
    <Dialog open={!!pool || !!address} onClose={onClose}>
      <Box
        sx={{
          pb: 20,
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <Tabs
          value={poolOrMiningTab}
          onChange={(_, value) => {
            handleChangeTab(value as PoolOrMiningTab);
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <TabsGroup
            tabs={poolOrMiningTabs}
            tabsListSx={{
              mx: 20,
            }}
            rightSlot={
              <Box
                component={Error}
                sx={{
                  color: 'text.secondary',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  onClose && onClose();
                }}
              />
            }
          />
          <TabPanel
            value={PoolOrMiningTab.Liquidity}
            sx={{
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <PoolOperateInner
              pool={pool}
              operate={operate}
              errorRefetch={poolErrorRefetch}
            />
          </TabPanel>
        </Tabs>
      </Box>
    </Dialog>
  );
}
