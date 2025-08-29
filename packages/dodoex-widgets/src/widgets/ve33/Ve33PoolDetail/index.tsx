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
import { formatApy, formatReadableNumber } from '../../../utils';
import PoolInfo from './PoolInfo';
import MyAssets from './MyAssets';
import Ve33PoolOperateDialog from '../Ve33PoolOperate';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import MyPosition from './MyPosition';
import { OperateTypeE, PoolTypeE } from '../types';

export interface Ve33PoolDetailProps {
  id: string;
  chainId: ChainId;
  onClickGoBack: () => void;
}

export const Ve33PoolDetail = ({
  id,
  chainId,
  onClickGoBack,
}: Ve33PoolDetailProps) => {
  const graphQLRequests = useGraphQLRequests();
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { account } = useWalletInfo();
  const [showOperate, setShowOperate] = React.useState<OperateTypeE | null>(
    null,
  );

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
  const isV3 = poolInfo?.type === PoolTypeE.CLPool;

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: 28,
        flex: 1,
        pb: isMobile ? 88 : undefined,
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
              <CardContainer title="Pool Info">
                <PoolInfo
                  poolInfo={poolInfo}
                  isLoading={fetchResult.isLoading}
                />
              </CardContainer>
              {!!account &&
                (isV3 ? (
                  <CardContainer title="My Position">
                    <MyPosition poolInfo={poolInfo} account={account} />
                  </CardContainer>
                ) : (
                  <CardContainer title="My Assets">
                    <MyAssets poolInfo={poolInfo} account={account} />
                  </CardContainer>
                ))}
            </Box>
            <Ve33PoolOperateDialog
              pool={showOperate || !isMobile ? poolInfo : undefined}
              operate={showOperate || undefined}
              onClose={() => setShowOperate(null)}
              account={account}
              errorRefetch={
                fetchResult.isError ? fetchResult.refetch : undefined
              }
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
          {isV3 ? (
            <Button fullWidth onClick={() => setShowOperate(OperateTypeE.Add)}>
              <Trans>Create position</Trans>
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                onClick={() => setShowOperate(OperateTypeE.Add)}
              >
                <Trans>Add</Trans>
              </Button>
              <Button
                fullWidth
                onClick={() => setShowOperate(OperateTypeE.Remove)}
                variant={Button.Variant.second}
              >
                <Trans>Remove</Trans>
              </Button>
            </>
          )}
        </Box>
      )}
    </WidgetContainer>
  );
};
