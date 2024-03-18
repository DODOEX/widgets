/* eslint-disable no-nested-ternary */
import { Box, ButtonBase, useTheme, alpha, BoxProps } from '@dodoex/components';
import { Trans } from '@lingui/macro';

export function AutoButton({
  active,
  sx,
  onClick,
}: {
  active?: boolean;
  sx?: BoxProps['sx'];
  onClick?: BoxProps['onClick'];
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  let color = theme.palette.primary.main;
  let backgroundColor = 'transparent';
  if (active) {
    color = theme.palette.primary.contrastText;
    backgroundColor = alpha(theme.palette.primary.main, 0.8);
  }

  return (
    <Box
      component={ButtonBase}
      sx={{
        typography: 'body2',
        p: active ? theme.spacing(8, 20, 9) : theme.spacing(7, 19, 8),
        minWidth: 79,
        border: active ? undefined : `1px solid ${color}`,
        color,
        backgroundColor,
        borderRadius: 8,
        fontWeight: 600,
        '&:hover': {
          color: active
            ? theme.palette.primary.contrastText
            : theme.palette.primary.main,
          backgroundColor: active
            ? theme.palette.primary.main
            : isLight
            ? 'rgba(26, 26, 27, 0.04)'
            : 'rgba(241, 249, 2, 0.08)',
        },
        ...sx,
      }}
      onClick={onClick}
    >
      <Trans>Auto</Trans>
    </Box>
  );
}
