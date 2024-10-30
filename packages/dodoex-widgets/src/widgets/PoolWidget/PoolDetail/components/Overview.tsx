import { Box, Skeleton, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { formatShortNumber } from '../../../../utils';
import { usePoolDetail } from '../../hooks/usePoolDetail';
import { usePoolDashboard } from '../hooks/usePoolDashboard';
import QuestionTooltip from '../../../../components/Tooltip/QuestionTooltip';

interface OverviewItem {
  description: string;
  text: string | React.ReactNode;
  question?: string | React.ReactNode;
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
      ) : !pairsStat?.feeNear24h === null && !pairsStat?.mtFeeNear24h ? (
        '-'
      ) : (
        `$${formatShortNumber(
          new BigNumber(pairsStat?.feeNear24h ?? 0).plus(
            pairsStat?.mtFeeNear24h ?? 0,
          ),
        )}`
      ),
      question: dashboardQuery.isLoading ? undefined : (
        <Box
          sx={{
            width: 198,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Trans>LP Fee</Trans>
            <Box>
              {!pairsStat?.feeNear24h
                ? '-'
                : `$${formatShortNumber(new BigNumber(pairsStat?.feeNear24h))}`}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Trans>MT Fee</Trans>
            <Box>
              {!pairsStat?.mtFeeNear24h
                ? '-'
                : `$${formatShortNumber(
                    new BigNumber(pairsStat?.mtFeeNear24h),
                  )}`}
            </Box>
          </Box>
        </Box>
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              typography: 'h6',
              color: 'text.secondary',
              gap: 4,
            }}
          >
            {item.description}
            {item.question ? <QuestionTooltip title={item.question} /> : ''}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
