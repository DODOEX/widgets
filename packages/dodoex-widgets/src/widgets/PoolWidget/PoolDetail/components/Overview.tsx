import { Box, Skeleton, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { formatShortNumber } from '../../../../utils';
import { usePoolDetail } from '../../hooks/usePoolDetail';
import { usePoolDashboard } from '../hooks/usePoolDashboard';

interface OverviewItem {
  description: string;
  text: string | React.ReactNode;
}

function OverviewSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      sx={{
        width: 90,
      }}
    />
  );
}

export default function Overview({
  poolDetail,
}: {
  poolDetail: ReturnType<typeof usePoolDetail>['poolDetail'];
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const dashboardQuery = usePoolDashboard({
    address: poolDetail?.address,
    chainId: poolDetail?.chainId,
  });
  const pairsStat = dashboardQuery.dashboard;

  const overviewList: OverviewItem[] = [
    {
      description: t`Traders (24H)`,
      text: dashboardQuery.isLoading ? (
        <OverviewSkeleton />
      ) : pairsStat?.txUserNear24h === null ||
        pairsStat?.txUserNear24h === undefined ? (
        '-'
      ) : (
        formatShortNumber(new BigNumber(pairsStat?.txUserNear24h))
      ),
    },
    {
      description: t`Total Liquidity`,
      text: dashboardQuery.isLoading ? (
        <OverviewSkeleton />
      ) : pairsStat?.tvl === null || pairsStat?.tvl === undefined ? (
        '-'
      ) : (
        `$${formatShortNumber(new BigNumber(pairsStat?.tvl))}`
      ),
    },
    {
      description: t`Volume (24H)`,
      text: dashboardQuery.isLoading ? (
        <OverviewSkeleton />
      ) : pairsStat?.volume === null || pairsStat?.volume === undefined ? (
        '-'
      ) : (
        `$${formatShortNumber(new BigNumber(pairsStat?.volume))}`
      ),
    },
    {
      description: t`Fees (24H)`,
      text: dashboardQuery.isLoading ? (
        <OverviewSkeleton />
      ) : pairsStat?.fee === null || pairsStat?.fee === undefined ? (
        '-'
      ) : (
        `$${formatShortNumber(new BigNumber(pairsStat?.fee))}`
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 12,
        ...(isMobile
          ? {
              mt: 24,
              gridTemplateColumns: 'repeat(2, 1fr)',
            }
          : {
              mt: 32,
              gridTemplateColumns: 'repeat(4, 1fr)',
            }),
      }}
    >
      {overviewList.map((item) => (
        <Box
          key={item.description}
          sx={{
            borderRadius: 8,
            p: 16,
            backgroundColor: 'background.paper',
          }}
        >
          <Box
            sx={{
              typography: 'caption',
              fontWeight: 600,
              lineHeight: 1,
              mb: 2,
            }}
          >
            {item.text}
          </Box>
          <Box sx={{ typography: 'h6', color: 'text.secondary' }}>
            {item.description}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
