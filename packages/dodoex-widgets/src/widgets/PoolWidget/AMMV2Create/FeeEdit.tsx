import {
  alpha,
  Box,
  ButtonBase,
  Input,
  Radio,
  useTheme,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { ErrorBorder } from '@dodoex/icons';

const MIN_FEE = 0.0001;

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
  const isLessFee =
    !editCustom &&
    isCustomValue &&
    (customValue ? new BigNumber(customValue).div(100).lt(MIN_FEE) : false);
  const hideOrShowDisabled = disabled || isLessFee;
  return (
    <Box
      sx={{
        opacity: disabled ? 0.3 : undefined,
        fontWeight: 600,
        borderRadius: isMobile ? 0 : 12,
        backgroundColor: isMobile
          ? 'transparent'
          : theme.palette.background.paper,
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
          backgroundColor: isMobile
            ? theme.palette.background.paper
            : 'transparent',
        }}
      >
        <Trans>
          {fee ? new BigNumber(fee).times(100).toString() : '-'}% fee tier
        </Trans>
        <ButtonBase
          sx={{
            px: 16,
            py: 7,
            border: `solid 1px ${theme.palette.text.primary}`,
            borderRadius: 8,
            fontWeight: 600,
            color: 'text.primary',
            cursor: hideOrShowDisabled ? 'default' : 'pointer',
            opacity: isLessFee ? 0.3 : 1,
          }}
          disabled={hideOrShowDisabled}
          onClick={() => {
            if (hideOrShowDisabled) return;
            setEdit((prev) => !prev);
          }}
        >
          {edit ? <Trans>Hide</Trans> : <Trans>Edit</Trans>}
        </ButtonBase>
      </Box>
      {edit && (
        <>
          <Box
            sx={{
              mt: isMobile ? 12 : 4,
              mb: 12,
              px: isMobile ? 0 : 20,
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
                    backgroundColor: isMobile
                      ? theme.palette.background.paper
                      : 'rgba(26, 26, 27, 0.10)',
                    cursor: 'pointer',
                    ...(active && {
                      borderColor: isMobile
                        ? '#34CA50'
                        : theme.palette.border.main,
                      backgroundColor: isMobile
                        ? theme.palette.background.paper
                        : '#00D555',
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
                  backgroundColor: isMobile
                    ? theme.palette.background.paper
                    : 'rgba(26, 26, 27, 0.10)',
                  cursor: 'pointer',
                  color: isLessFee ? theme.palette.error.main : 'text.primary',
                  ...(isCustom && {
                    borderColor: theme.palette.border.main,
                    backgroundColor: isMobile
                      ? theme.palette.background.paper
                      : '#00D555',
                  }),
                }}
                onClick={() => {
                  setEditCustom(true);
                  setCustomValue('');
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
                      const newFeeResult = newFee
                        ? new BigNumber(newFee).div(100).toNumber()
                        : newFee;
                      if (newFeeResult && newFeeResult < MIN_FEE) {
                        onChange(0);
                      } else if (!!customValue && (newFee || newFee === 0)) {
                        onChange(newFeeResult);
                      }
                      setEditCustom(false);
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
                      (new BigNumber(fee).times(100).toNumber() ||
                        customValue) + '%'
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
          {isLessFee && (
            <Box
              sx={{
                mt: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                p: 8,
                borderRadius: 8,
                typography: 'h6',
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              }}
            >
              <Box
                component={ErrorBorder}
                sx={{
                  width: 18,
                  height: 18,
                }}
              />
              <Trans>The fee tier should greater than {MIN_FEE * 100}%</Trans>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
