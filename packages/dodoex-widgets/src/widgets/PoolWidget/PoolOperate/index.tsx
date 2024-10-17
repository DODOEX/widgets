import {
  alpha,
  Box,
  BoxProps,
  TabPanel,
  Tabs,
  TabsGroup,
  Modal,
} from '@dodoex/components';
import Dialog from '../../../components/Dialog';
import {
  PoolOrMiningTab,
  usePoolOrMiningTabs,
} from './hooks/usePoolOrMiningTabs';
import { Error } from '@dodoex/icons';
import PoolOperateInner, { PoolOperateInnerProps } from './PoolOperateInner';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChainId, PoolApi } from '@dodoex/api';
import { convertFetchPoolToOperateData } from '../utils';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { ThegraphKeyMap } from '../../../constants/chains';
import LpTokenMiningOperate from '../../MiningWidget/LpTokenMiningOperate';
import { useWeb3React } from '@web3-react/core';
import { usePoolBalanceInfo } from '../hooks/usePoolBalanceInfo';
import { t } from '@lingui/macro';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { GSPPairRiskWarning } from './components/GSPPairRiskWarning';

export interface PoolOperateProps {
  onClose?: () => void;
  account: string | undefined;
  pool?: PoolOperateInnerProps['pool'];
  address?: string;
  operate?: PoolOperateInnerProps['operate'];
  chainId?: number;
  hasMining?: boolean;
  sx?: BoxProps['sx'];
}

export function PoolOperate({
  onClose,
  pool: poolProps,
  address,
  operate,
  chainId,
  hasMining,
  sx,
}: PoolOperateProps) {
  const { account } = useWeb3React();
  const chain = chainId ? ThegraphKeyMap[chainId as ChainId] : '';

  const graphQLRequests = useGraphQLRequests();
  const fetchResult = useQuery({
    ...graphQLRequests.getQuery(PoolApi.graphql.fetchPoolList, {
      where: {
        id: address?.toLocaleLowerCase() ?? '',
        chain,
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

  const { poolOrMiningTab, poolOrMiningTabs, handleChangeTab } =
    usePoolOrMiningTabs({
      hasMining,
    });

  const balanceInfo = usePoolBalanceInfo({
    account,
    pool,
  });
  const hasLp =
    !!balanceInfo.userBaseLpBalance?.gt(0) ||
    !!balanceInfo.userQuoteLpBalance?.gt(0);

  const poolChainId = chainId ?? pool?.chainId;
  const poolAddress = address ?? pool?.address;

  return (
    <Box sx={sx}>
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
            justifyContent: onClose ? 'space-between' : 'flex-start',
            ...(hasMining && hasLp
              ? {
                  '& button:last-child': {
                    position: 'relative',
                    '&::before': {
                      content: `"${t`LP Tokens`}"`,
                      position: 'absolute',
                      top: 16,
                      right: 20,
                      px: 8,
                      py: 2,
                      borderRadius: 12,
                      transform: 'scale(0.66667) translateX(100%)',
                      transformOrigin: 'right top',
                      backgroundColor: alpha('#DABB1B', 0.2),
                      color: '#DABB1B',
                    },
                  },
                }
              : {}),
          }}
          rightSlot={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {pool?.type === 'GSP' && <GSPPairRiskWarning />}
              {onClose ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    borderWidth: 1,
                    color: 'text.secondary',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    component={Error}
                    sx={{
                      width: 16,
                      height: 16,
                    }}
                    onClick={() => {
                      onClose();
                    }}
                  />
                </Box>
              ) : undefined}
            </Box>
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
            submittedBack={() => {
              if (hasMining) {
                handleChangeTab(PoolOrMiningTab.Mining);
              }
            }}
          />
        </TabPanel>
        <TabPanel
          value={PoolOrMiningTab.Mining}
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {poolChainId && poolAddress ? (
            <LpTokenMiningOperate
              chainId={poolChainId}
              account={account}
              poolAddress={poolAddress}
              goLpLink={() => {
                handleChangeTab(PoolOrMiningTab.Liquidity);
              }}
            />
          ) : (
            ''
          )}
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default function PoolOperateDialog({
  modal,
  ...props
}: PoolOperateProps & {
  modal?: boolean;
}) {
  const { isMobile } = useWidgetDevice();

  return (
    <Dialog
      open={!!props.pool || !!props.address}
      onClose={props.onClose}
      scope={!isMobile}
      modal={modal}
      id="pool-operate"
    >
      <PoolOperate {...props} />
    </Dialog>
  );
}
