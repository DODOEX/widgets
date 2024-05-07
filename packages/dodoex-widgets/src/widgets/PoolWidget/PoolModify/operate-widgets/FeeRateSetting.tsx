import { Box, Button, QuestionTooltip, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import Dialog from '../../../../components/WidgetDialog';
import RadioButton from '../../PoolCreate/components/RadioButton';
import { RadioButtonTag } from '../../PoolCreate/components/RadioButtonTag';
import { SelectAndInput } from '../../PoolCreate/components/SelectAndInput';
import { useFeeRateList } from '../../PoolCreate/hooks/useFeeRateList';
import { validFeeRate } from '../../PoolCreate/hooks/useValidation';
import { Actions, StateProps, Types } from '../../PoolCreate/reducer';

export function FeeRateSetting({
  dispatch,
  feeRate,
  isCustomized,
}: {
  dispatch: React.Dispatch<Actions>;
  feeRate: StateProps['feeRate'];
  isCustomized: StateProps['isFeeRateCustomized'];
}) {
  const theme = useTheme();

  const [feeRateSelectModalVisible, setFeeRateSelectModalVisible] =
    React.useState(false);
  const [customValue, setCustomValue] = React.useState(feeRate);

  const feeRateList = useFeeRateList();

  if (!customValue && feeRate) {
    setCustomValue(feeRate);
  }

  const errorMsg = validFeeRate(customValue);
  const errorInput = !!(
    customValue &&
    customValue !== '0' &&
    !Number(customValue)
  );

  const confirmButtonDisabled =
    Boolean(errorMsg) || errorInput || (isCustomized && !customValue);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 20,
          px: 20,
        }}
      >
        <Box
          sx={{
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Trans>Fee Rate</Trans>
          <QuestionTooltip
            title={t`Pools with lower transaction fees will attract more traders.`}
            ml={8}
            size={16}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 12,
          }}
        >
          {feeRate}%
          <Button
            variant={Button.Variant.tag}
            sx={{
              ml: 12,
              fontSize: 12,
            }}
            onClick={() => setFeeRateSelectModalVisible(true)}
          >
            <Trans>Edit</Trans>
          </Button>
        </Box>
      </Box>

      <Dialog
        open={feeRateSelectModalVisible}
        onClose={() => setFeeRateSelectModalVisible(false)}
        title={
          <Box>
            <Trans>Fee Rate</Trans>
            <QuestionTooltip
              title={t`Pools with lower transaction fees will attract more traders.`}
              ml={8}
            />
          </Box>
        }
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              p: theme.spacing(8, 28, 28),
            }}
          >
            {feeRateList.map((item) => {
              const selected = isCustomized
                ? false
                : customValue === item.value;
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
                    setCustomValue(item.value);
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
                    backgroundColor: theme.palette.background.paper,
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
                  if (!isCustomized) {
                    setCustomValue('');
                  }
                  dispatch({
                    type: Types.UpdateIsFeeRateCustomized,
                    payload: true,
                  });
                }}
                value={customValue}
                onChange={(value) => {
                  setCustomValue(value);
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              px: 20,
              py: 16,
              backgroundColor: 'background.paperContrast',
            }}
          >
            <Button
              fullWidth
              disabled={confirmButtonDisabled}
              onClick={() => {
                dispatch({
                  type: Types.UpdateFeeRate,
                  payload: customValue,
                });
                setFeeRateSelectModalVisible(false);
              }}
            >
              <Trans>Confirm</Trans>
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
