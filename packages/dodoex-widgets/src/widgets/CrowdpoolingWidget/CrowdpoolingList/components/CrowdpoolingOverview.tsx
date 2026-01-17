import { Box, LoadingSkeleton, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { CrowdpoolingOverviewItem } from '../../types';

function OverviewSkeleton() {
  return (
    <LoadingSkeleton
      sx={{
        width: 90,
      }}
    />
  );
}

export default function CrowdpoolingOverview({
  overviewList,
  loading,
}: {
  overviewList: CrowdpoolingOverviewItem[];
  loading?: boolean;
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  return (
    <Box
      sx={{
        mt: isMobile ? 20 : 28,
      }}
    >
      <Box sx={{ typography: 'h5' }}>
        <Trans>Overview</Trans>
      </Box>
      <Box
        sx={{
          display: 'grid',
          mt: 20,
          gap: {
            tablet: 20,
          },
          gridTemplateColumns: {
            tablet: 'repeat(3, 1fr)',
          },
        }}
      >
        {overviewList.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: 16,
              pb: 20,
              backgroundColor: 'background.paper',
              borderRadius: 16,
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                backgroundColor: 'primary.main',
                borderRadius: 8,
              }}
            >
              <Box
                component={item.icon}
                sx={{
                  '& path': {
                    fill: theme.palette.background.paper,
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                typography: 'h2',
                mt: 12,
              }}
            >
              <LoadingSkeleton loading={loading}>
                {(index === 1 ? '$' : '') + item.value}
              </LoadingSkeleton>
            </Box>
            <Box
              sx={{
                typography: 'body2',
                mt: 2,
                color: 'text.secondary',
              }}
            >
              <Trans>{item.description}</Trans>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
