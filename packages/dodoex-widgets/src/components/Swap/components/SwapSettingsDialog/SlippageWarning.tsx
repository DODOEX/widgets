import { alpha, Box, useTheme } from '@dodoex/components';
import { Warn as WarningIcon } from '@dodoex/icons';
import { Checkbox } from '@dodoex/components';
import { useMemo } from 'react';
import { Trans } from '@lingui/macro';

export function SlippageWarning({
  title,
  desc,
  doNotChecked,
  onChangeDoNotChecked,
}: {
  title: string;
  desc: string;
  doNotChecked: boolean;
  onChangeDoNotChecked?: (value: boolean) => void;
}) {
  const theme = useTheme();

  const initialDoNotChecked = useMemo(() => {
    return doNotChecked;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initialDoNotChecked) {
    return null;
  }
  const warningColor = theme.palette.warning.main;

  return (
    <Box
      sx={{
        mt: 8,
        backgroundColor: alpha(warningColor, 0.1),
        borderRadius: 8,
        padding: 12,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          typography: 'body2',
          color: warningColor,
          fontWeight: 700,
        }}
      >
        <WarningIcon />
        {title}
      </Box>

      <Box
        sx={{
          mt: 8,
          typography: 'body2',
          fontWeight: 500,
          color: theme.palette.text.secondary,
          textAlign: 'center',
        }}
      >
        {desc}
      </Box>

      {!!onChangeDoNotChecked && (
        <Box
          sx={{
            width: '100%',
            mt: 20,
            color: theme.palette.text.secondary,
            typography: 'h6',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
          component="label"
        >
          <Checkbox
            checked={doNotChecked}
            size={16}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              const { checked } = evt.target;
              onChangeDoNotChecked(checked);
            }}
          />

          <Trans>Do not remind again</Trans>
        </Box>
      )}
    </Box>
  );
}
