import { Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';

/**
 * Text type Switch button: supports On and Off states
 * @param param0
 * @returns
 */
export function TextSwitch({
  checked,
  onChange,
  sx,
  disabled,
}: {
  sx?: BoxProps['sx'];
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const theme = useTheme();

  let bgColor = theme.palette.background.paper;
  if (checked) {
    bgColor = theme.palette.secondary.main;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        borderRadius: 8,
        backgroundColor: theme.palette.background.input,
        opacity: disabled ? 0.5 : 1,
        ...sx,
      }}
      component={ButtonBase}
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          return;
        }
        onChange(!checked);
      }}
    >
      <Box
        sx={{
          typography: 'body2',
          fontWeight: 600,
          pl: 12,
          pr: 13,
          pt: 8,
          pb: 9,
          width: '50%',
          zIndex: 1,
          color: theme.palette.text.primary,
          whiteSpace: 'nowrap',
        }}
      >
        <Trans>Off</Trans>
      </Box>
      <Box
        sx={{
          typography: 'body2',
          fontWeight: 600,
          pl: 12,
          pr: 13,
          pt: 8,
          pb: 9,
          width: '50%',
          zIndex: 1,
          color: checked
            ? theme.palette.secondary.contrastText
            : theme.palette.text.primary,
          whiteSpace: 'nowrap',
        }}
      >
        <Trans>On</Trans>
      </Box>
      <Box
        sx={{
          borderRadius: 6,
          backgroundColor: bgColor,
          zIndex: 0,
          position: 'absolute',
          top: 2,
          bottom: 2,
          width: 'calc(50% - 2px - 2px)',
          left: checked ? 'calc(50% + 2px)' : '2px',
          transition:
            'left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        }}
      />
    </Box>
  );
}
