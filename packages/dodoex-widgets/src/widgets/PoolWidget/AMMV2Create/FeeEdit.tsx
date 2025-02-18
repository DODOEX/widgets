import { Box, ButtonBase, Radio, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';

export default function FeeEdit({
  disabled,
  feeIndex,
  onChange,
  feeList,
}: {
  disabled?: boolean;
  feeIndex: number;
  onChange: (v: number) => void;
  feeList: {
    id: string;
    index: number;
    protocolFeeRate: number;
    tradeFeeRate: number;
    fundFeeRate: number;
    createPoolFee: string;
  }[];
}) {
  const theme = useTheme();
  const [edit, setEdit] = React.useState(false);

  const { isMobile } = useWidgetDevice();

  const hideOrShowDisabled = disabled;
  const fee = feeList[feeIndex];
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
          {fee ? new BigNumber(fee.tradeFeeRate).div(10000).toString() : '-'}%
          fee tier
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
            {feeList.map((value, index) => {
              const active = feeIndex === index;
              return (
                <Box
                  key={value.id}
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
                  {value.tradeFeeRate / 10000}%
                  <Radio
                    size={18}
                    checked={active}
                    onChange={(_, checked) => {
                      if (checked) {
                        onChange(index);
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}
