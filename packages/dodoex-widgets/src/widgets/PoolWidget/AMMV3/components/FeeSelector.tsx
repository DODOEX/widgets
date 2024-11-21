import { Box, Button, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useState } from 'react';
import { Actions, Types } from '../reducer';
import { FeeAmount } from '../sdks/v3-sdk/constants';
import { FEE_AMOUNT_DETAIL } from './shared';

export interface FeeSelectorProps {
  disabled: boolean;
  feeAmount?: FeeAmount;
  dispatch: React.Dispatch<Actions>;
}

export const FeeSelector = ({
  disabled,
  feeAmount,
  dispatch,
}: FeeSelectorProps) => {
  const theme = useTheme();

  const [active, setActive] = useState(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 20,
          py: 12,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.palette.border.main,
          borderRadius: 16,

          ...(disabled
            ? {
                opacity: 0.3,
              }
            : undefined),
        }}
      >
        <Box
          sx={{
            typography: 'h5',
            color: theme.palette.text.primary,
          }}
        >
          {feeAmount
            ? `${FEE_AMOUNT_DETAIL[feeAmount].label} ${t`fee tier`}`
            : t`Fee tier`}
        </Box>
        <Button
          size={Button.Size.small}
          variant={Button.Variant.outlined}
          disabled={disabled}
          onClick={() => setActive((prev) => !prev)}
        >
          {active ? t`Hide` : t`Edit`}
        </Button>
      </Box>

      {active && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {[
            FeeAmount.LOWEST,
            FeeAmount.LOW,
            FeeAmount.MEDIUM,
            FeeAmount.HIGH,
          ].map((fee) => {
            const isSelected = feeAmount === fee;
            return (
              <Button
                key={fee}
                size={Button.Size.middle}
                variant={Button.Variant.outlined}
                disabled={disabled}
                onClick={() => {
                  dispatch({
                    type: Types.UpdateFeeAmount,
                    payload: fee,
                  });
                }}
                sx={{
                  flexBasis: '25%',
                  flexShrink: 1,
                  flexGrow: 1,
                  justifyContent: 'space-between',
                  px: 20,
                  borderColor: isSelected
                    ? theme.palette.primary.main
                    : theme.palette.border.main,
                }}
              >
                {FEE_AMOUNT_DETAIL[fee].label}

                {isSelected ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="17"
                      height="17"
                      rx="8.5"
                      stroke={theme.palette.primary.main}
                    />
                    <rect
                      x="4.5"
                      y="4.5"
                      width="9"
                      height="9"
                      rx="4.5"
                      fill={theme.palette.primary.main}
                      stroke={theme.palette.primary.main}
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="17"
                      height="17"
                      rx="8.5"
                      stroke={theme.palette.text.secondary}
                    />
                  </svg>
                )}
              </Button>
            );
          })}
        </Box>
      )}
    </>
  );
};
