import { alpha, Box, BoxProps, Tooltip, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';

export default function RangeBadge({
  removed,
  inRange,
}: {
  removed?: boolean;
  inRange?: boolean;
}) {
  const theme = useTheme();

  const sx: BoxProps['sx'] = {
    py: 4,
    px: 8,
    color: theme.palette.success.main,
    borderRadius: 4,
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    typography: 'h6',
  };

  return removed ? (
    <Tooltip
      sx={{
        ...sx,
        color: theme.palette.warning.main,
        backgroundColor: alpha(theme.palette.warning.main, 0.1),
      }}
      title={t`Your position has 0 liquidity, and is not earning fees.`}
    >
      <Box>{t`Closed`}</Box>
    </Tooltip>
  ) : inRange ? (
    <Tooltip
      sx={sx}
      title={t`The price of this pool is within your selected range. Your position is currently earning fees.`}
    >
      <Box>{t`In range`}</Box>
    </Tooltip>
  ) : (
    <Tooltip
      sx={{
        ...sx,
        color: theme.palette.error.main,
        backgroundColor: alpha(theme.palette.error.main, 0.1),
      }}
      title={t`The price of this pool is outside of your selected range. Your position is not currently earning fees.`}
    >
      <Box>{t`Out of range`}</Box>
    </Tooltip>
  );
}
