import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { Dispatch, useMemo } from 'react';
import RadioButton from '../components/RadioButton';
import { RadioButtonTag } from '../components/RadioButtonTag';
import { SelectAndInput } from '../components/SelectAndInput';
import { useFeeRateList } from '../hooks/useFeeRateList';
import { validFeeRate } from '../hooks/useValidation';
import { Actions, StateProps, Types } from '../reducer';

export function FeeRateSetting({
  dispatch,
  feeRate,
  isFeeRateCustomized: isCustomized,
}: {
  dispatch: Dispatch<Actions>;
  feeRate: StateProps['feeRate'];
  isFeeRateCustomized: StateProps['isFeeRateCustomized'];
}) {
  const theme = useTheme();

  const feeRateList = useFeeRateList();

  const errorMsg = useMemo(() => {
    const msg = validFeeRate(feeRate);
    return msg || '';
  }, [feeRate]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          px: 20,
        }}
      >
        {feeRateList.map((item) => {
          const selected = isCustomized ? false : feeRate === item.value;
          return (
            <RadioButton
              key={item.value}
              title={item.title}
              description={item.description}
              onClick={() => {
                dispatch({
                  type: Types.UpdateIsFeeRateCustomized,
                  payload: false,
                });
                dispatch({
                  type: Types.UpdateFeeRate,
                  payload: item.value,
                });
              }}
              selected={selected}
              subTitle={
                item.tag ? (
                  <RadioButtonTag
                    color={item.tagColor}
                    backgroundColor={item.tagBackgroundColor}
                    tagKey={item.tag}
                  />
                ) : undefined
              }
              sx={{
                backgroundColor: '#F4F0EC',
                borderColor: selected
                  ? theme.palette.primary.main
                  : theme.palette.border.main,
              }}
            />
          );
        })}

        <Box
          sx={{
            mt: 8,
          }}
        >
          <SelectAndInput
            errorMsg={errorMsg}
            isCustomized={isCustomized}
            onClick={() => {
              dispatch({
                type: Types.UpdateFeeRate,
                payload: '',
              });
              dispatch({
                type: Types.UpdateIsFeeRateCustomized,
                payload: true,
              });
            }}
            value={feeRate}
            onChange={(value) => {
              dispatch({
                type: Types.UpdateFeeRate,
                payload: value,
              });
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          typography: 'body2',
          mt: 20,
          color: 'text.secondary',
          px: 20,
        }}
      >
        <Trans>
          * Please note that the Fee Rate cannot be modified after the pool is
          created
        </Trans>
      </Box>
    </>
  );
}
