import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';

export interface LaunchItem {
  title: string;
  description: string;
}

export default function LaunchCampaign({
  launchList,
}: {
  launchList: LaunchItem[];
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box
      sx={{
        mt: 28,
      }}
    >
      <Box sx={{ typography: 'h5' }}>
        <Trans>How to Launch</Trans>
      </Box>
      <Box
        sx={{
          mt: 20,
          display: 'flex',
          gap: 34,
        }}
      >
        {launchList.map(({ title, description }, index) => (
          <Box
            key={description}
            sx={{
              minHeight: 138,
              padding: 20,
              borderRadius: 10,
              flex: 1,
              backgroundColor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                mb: 20,
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  minWidth: 20,
                  fontWeight: 600,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  mr: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'background.default',
                  typography: 'h6',
                }}
              >
                {index + 1}
              </Box>
              <Box
                sx={{
                  color: 'custom.text.purple',
                }}
              >
                <Trans>{title}</Trans>
              </Box>
            </Box>
            <Box
              sx={{
                typography: 'body2',
                color: 'text.secondary',
              }}
            >
              <Trans>{description}</Trans>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
