import { ChainId, PoolApi } from '@dodoex/api';
import { Box, Skeleton, useTheme } from '@dodoex/components';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
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
      }}
      ref={scrollParentRef}
    >
      <GoBack onClick={onClickGoBack} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 20,
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
              }}
            />
            <Skeleton
              width={375}
              height={527}
              sx={{
                borderRadius: 24,
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
              <CardContainer title="My Assets">
                <Box>My Assets</Box>
              </CardContainer>
              <CardContainer title="My Position">
                <Box>My Position</Box>
              </CardContainer>
            </Box>
            <Box
              sx={{
                position: 'relative',
                width: 375,
              }}
            >
              {poolInfo?.title}
            </Box>
          </>
        )}
      </Box>
    </WidgetContainer>
  );
};
