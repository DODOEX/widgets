import { Box, useTheme } from '@dodoex/components';
import { RadioButtonIcon } from './RadioButtonIcon';
import { useMemo } from 'react';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';
import { t } from '@lingui/macro';

export function SelectAndInput({
  errorMsg,
  isCustomized,
  onClick,
  value,
  onChange,
}: {
  errorMsg: string;
  isCustomized: boolean;
  onClick: () => void;
  value: string;
  onChange: (v: string) => void;
}) {
  const theme = useTheme();

  const errorInput = useMemo(
    () => !!(value && value !== '0' && !Number(value)),
    [value],
  );

  return (
    <>
      <Box
        sx={{
          py: 12,
          px: 20,
          backgroundColor: theme.palette.background.paper,
          borderColor:
            (isCustomized && errorMsg) || errorInput
              ? theme.palette.error.main
              : isCustomized
              ? theme.palette.primary.main
              : theme.palette.border.main,
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={onClick}
      >
        <NumberInput
          value={isCustomized ? value : ''}
          onChange={onChange}
          suffix={<RadioButtonIcon selected={isCustomized} />}
          placeholder={`${t`Custom`} %`}
          sx={{
            mt: 0,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            '& input': {
              typography: 'body1',
              height: 36,
              lineHeight: '36px',
              p: theme.spacing(0),
              color: theme.palette.text.primary,
              '&::placeholder': {
                color: theme.palette.text.disabled,
                fontWeight: 600,
                typography: 'body1',
                lineHeight: 1,
                position: 'relative',
              },
            },
          }}
        />
      </Box>

      {errorMsg && (
        <Box
          sx={{
            typography: 'h6',
            color: 'error.main',
            mt: 6,
          }}
        >
          {errorMsg}
        </Box>
      )}
    </>
  );
}
