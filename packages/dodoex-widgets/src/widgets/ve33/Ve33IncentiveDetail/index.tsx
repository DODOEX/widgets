import { ChainId, PoolApi } from '@dodoex/api';
import { Box, Button, Skeleton, useTheme } from '@dodoex/components';
import { useQuery } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { FailedList } from '../../../components/List/FailedList';
import WidgetContainer from '../../../components/WidgetContainer';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { GoBack } from '../components/GoBack';
import { PoolHead } from '../components/PoolHead';
import { CardContainer } from '../components/widgets';
import { compositePoolInfo } from '../utils';
import { Trans } from '@lingui/macro';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import PoolInfo from './PoolInfo';
import Dashboard from './Dashboard';
import AddIncentiveDialog from './AddIncentiveDialog';

export interface Ve33IncentiveDetailProps {
  id: string;
  chainId: ChainId;
  onClickGoBack: () => void;
}

export default function Ve33IncentiveDetail({
  id,
  chainId,
  onClickGoBack,
}: Ve33IncentiveDetailProps) {
  const graphQLRequests = useGraphQLRequests();
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  const scrollParentRef = useRef<HTMLDivElement>(null);

  const query = graphQLRequests.getQuery(PoolApi.graphql.fetchVe33Pool, {
    where: {
      pool: id,
    },
  });
  const fetchResult = useQuery({
    ...query,
    enabled: !!id && !!chainId,
  });

  const poolInfo = fetchResult.data?.ve33_getPool
    ? compositePoolInfo(fetchResult.data.ve33_getPool, chainId)
    : null;

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: 28,
        flex: 1,
        pt: 20,
        px: isMobile ? 20 : 40,
        pb: isMobile ? 88 : 20,
      }}
      ref={scrollParentRef}
    >
      <GoBack onClick={onClickGoBack} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 20,
          flexDirection: isMobile ? 'column' : undefined,
        }}
      >
        {fetchResult.error ? (
          <FailedList
            sx={{
              mx: 'auto',
            }}
            refresh={fetchResult.refetch}
          />
        ) : fetchResult.isLoading || !poolInfo ? (
          <>
            <Skeleton
              width={100}
              height={278}
              sx={{
                flex: 1,
                borderRadius: 24,
                maxWidth: '100%',
              }}
            />
            <Skeleton
              width={375}
              height={527}
              sx={{
                borderRadius: 24,
                maxWidth: '100%',
              }}
            />
          </>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                flex: 1,
                overflow: 'hidden',
                height: 'max-content',
                maxHeight: '100%',
                maxWidth: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  px: 20,
                  py: 12,
                  borderRadius: 24,
                  border: `1px solid ${theme.palette.border.main}`,
                }}
              >
                <PoolHead chainId={chainId} poolInfo={poolInfo} size="medium" />
              </Box>
              <Dashboard poolInfo={poolInfo} />
              <CardContainer title="Pool Info">
                <PoolInfo
                  poolInfo={poolInfo}
                  isLoading={fetchResult.isLoading}
                />
              </CardContainer>
            </Box>
            <AddIncentiveDialog
              data={
                !isMobile || showAddDialog
                  ? {
                      chainId,
                      type: poolInfo.type,
                      token: {
                        chainId,
                        symbol: 'MOMO',
                        name: 'MOMO',
                        decimals: 18,
                        address: '0x42EDf453F8483c7168c158d28D610A58308517D1',
                      },
                    }
                  : undefined
              }
              onClose={() => setShowAddDialog(false)}
            />
          </>
        )}
      </Box>
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            left: 0,
            display: 'flex',
            gap: 8,
            padding: 20,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Button fullWidth onClick={() => setShowAddDialog(true)}>
            <Trans>Add incentive</Trans>
          </Button>
        </Box>
      )}
    </WidgetContainer>
  );
}
