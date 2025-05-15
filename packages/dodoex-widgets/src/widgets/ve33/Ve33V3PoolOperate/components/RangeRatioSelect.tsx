import { Box, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';

export default function RangeRatioSelect() {
  const theme = useTheme();
  const options = [
    {
      type: t`Narrow`,
      ratio: '(±3%)',
      apr: '153.8%',
      borderRadius: theme.spacing(8, 0, 0, 0),
    },
    {
      type: t`Common`,
      ratio: '(±8%)',
      apr: '153.8%',
      borderRadius: theme.spacing(0, 8, 0, 0),
    },
    {
      type: t`Wide`,
      ratio: '(±15%)',
      apr: '153.8%',
      borderRadius: theme.spacing(0, 0, 0, 8),
    },
    {
      type: t`Full`,
      ratio: '(∞)',
      apr: '153.8%',
      borderRadius: theme.spacing(0, 0, 8, 0),
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        fontWeight: 600,
      }}
    >
      {options.map((item) => {
        // @TODO: replace this
        const active = item.ratio === '(∞)';
        return (
          <Box
            sx={{
              p: 12,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: active ? 'text.primary' : 'border.main',
              borderRadius: item.borderRadius,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.7,
              },
              ...(active
                ? {
                    backgroundColor: 'background.paperDarkContrast',
                  }
                : {
                    '&:nth-child(odd)': {
                      borderRightWidth: 0,
                    },
                    '&:not(:nth-child(-n + 2))': {
                      borderTopWidth: 0,
                    },
                  }),
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {item.type}
              <Box
                sx={{
                  typography: 'h6',
                  color: 'text.secondary',
                }}
              >
                {item.ratio}
              </Box>
            </Box>
            <Box
              sx={{
                mt: 8,
                typography: 'h6',
              }}
            >
              <Trans>APR</Trans>
              {' ' + item.apr}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
