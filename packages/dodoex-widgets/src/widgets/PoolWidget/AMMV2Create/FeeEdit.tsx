import { Box, ButtonBase, Input, Radio, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';

export default function FeeEdit({
  disabled,
  fee,
  onChange,
  feeList,
  hasCustom,
}: {
  disabled?: boolean;
  fee: number;
  onChange: (v: number) => void;
  feeList: number[];
  hasCustom?: boolean;
}) {
  const theme = useTheme();
  const [edit, setEdit] = React.useState(false);
  const [editCustom, setEditCustom] = React.useState(false);
  const [customValue, setCustomValue] = React.useState('');
  const { isMobile } = useWidgetDevice();

  const isCustomValue = !feeList.includes(fee);
  const isCustom = isCustomValue || editCustom;
  return (
    <Box
      sx={{
        opacity: disabled ? 0.3 : undefined,
        fontWeight: 600,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 20,
          py: 12,
          borderWidth: 1,
          borderRadius: 12,
        }}
      >
        <Trans>
          {fee ? new BigNumber(fee).times(100).toString() : 0}% fee tier
        </Trans>
        <ButtonBase
          sx={{
            px: 16,
            py: 7,
            border: `solid 1px ${theme.palette.text.primary}`,
            borderRadius: 8,
            fontWeight: 600,
            cursor: disabled ? 'default' : 'pointer',
          }}
          onClick={() => {
            if (disabled) return;
            setEdit((prev) => !prev);
          }}
        >
          {edit ? <Trans>Hide</Trans> : <Trans>Edit</Trans>}
        </ButtonBase>
      </Box>
      {edit && (
        <Box
          sx={{
            mt: 12,
            ...(isMobile
              ? {
                  display: 'grid',
                  gap: 8,
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }
              : {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  '& > label': {
                    flex: 1,
                  },
                }),
          }}
        >
          {feeList.map((value) => {
            const active = fee === value && !isCustom;
            return (
              <Box
                key={value}
                component="label"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 20,
                  py: 12,
                  borderWidth: 1,
                  borderRadius: 12,
                  cursor: 'pointer',
                  ...(active && {
                    borderColor: theme.palette.primary.main,
                  }),
                }}
              >
                {value * 100}%
                <Radio
                  size={18}
                  checked={active}
                  onChange={(_, checked) => {
                    if (checked) {
                      onChange(value);
                    }
                  }}
                />
              </Box>
            );
          })}
          {hasCustom && (
            <Box
              component="label"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 20,
                py: 12,
                borderWidth: 1,
                borderRadius: 12,
                cursor: 'pointer',
                ...(isCustom && {
                  borderColor: theme.palette.primary.main,
                }),
              }}
              onClick={() => {
                setEditCustom(true);
              }}
            >
              {editCustom ? (
                <Input
                  value={customValue}
                  autoFocus
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isNaN(Number(value))) return;
                    setCustomValue(value);
                  }}
                  onBlur={() => {
                    const newFee = Number(customValue);
                    if (!!customValue && (newFee || newFee === 0)) {
                      onChange(new BigNumber(newFee).div(100).toNumber());
                    }
                    setEditCustom(false);
                    setCustomValue('');
                  }}
                  sx={{
                    p: 0,
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'none',
                  }}
                  inputSx={{
                    p: 0,
                  }}
                />
              ) : (
                <>
                  {isCustomValue ? (
                    new BigNumber(fee).times(100).toNumber()
                  ) : (
                    <Trans>Custom</Trans>
                  )}
                </>
              )}
              <Radio
                size={18}
                checked={isCustom}
                sx={{
                  flexShrink: 0,
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
