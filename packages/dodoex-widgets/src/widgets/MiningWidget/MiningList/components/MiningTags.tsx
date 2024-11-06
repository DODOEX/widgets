import { MiningStatusE } from '@dodoex/api';
import { alpha, Box, BoxProps, useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';

export function MiningTags({
  type,
  sx,
}: {
  type: MiningStatusE;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const { i18n } = useLingui();

  const commonStyles: BoxProps['sx'] = {
    typography: 'h6',
    fontWeight: 600,
    padding: 8,
    borderRadius: 8,
    ...sx,
  };

  switch (type) {
    case MiningStatusE.upcoming:
      return (
        <Box
          sx={{
            ...commonStyles,
            color: theme.palette.warning.main,
            backgroundColor: alpha(theme.palette.warning.main, 0.1),
          }}
        >
          {i18n._('Upcoming')}
        </Box>
      );

    case MiningStatusE.active:
      return (
        <Box
          sx={{
            ...commonStyles,
            color: theme.palette.success.main,
            backgroundColor: alpha(theme.palette.success.main, 0.1),
          }}
        >
          {i18n._('Active')}
        </Box>
      );

    case MiningStatusE.ended:
      return (
        <Box
          sx={{
            ...commonStyles,
            color: theme.palette.text.disabled,
            backgroundColor: theme.palette.background.paperDarkContrast,
          }}
        >
          {i18n._('Ended')}
        </Box>
      );
    default:
      return null;
  }
}
