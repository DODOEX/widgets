import { Button, Box, useTheme, QuestionTooltip } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { Dispatch, useMemo, useState } from 'react';
import Dialog from '../../../../components/Dialog';
import RadioButton from '../components/RadioButton';
import { RadioButtonTag } from '../components/RadioButtonTag';
import { SelectAndInput } from '../components/SelectAndInput';
import { useSlippageCoefficientList } from '../hooks/useSlippageCoefficientList';
import { validSlippageCoefficient } from '../hooks/useValidation';
import { Actions, StateProps, Types } from '../reducer';
import { Version } from '../types';

export function SlippageCoefficientSetting({
  dispatch,
  slippageCoefficient,
  selectedVersion,
  isCustomized,
}: {
  dispatch: Dispatch<Actions>;
  slippageCoefficient: StateProps['slippageCoefficient'];
  selectedVersion: StateProps['selectedVersion'];
  isCustomized: StateProps['isSlippageCoefficientCustomized'];
}) {
  const theme = useTheme();

  const [showSlippageCoefficientDialog, setShowSlippageCoefficientDialog] =
    useState(false);
  const [customValue, setCustomValue] = useState(slippageCoefficient);

  const slippageCoefficientList = useSlippageCoefficientList({
    selectedVersion,
  });

  const [prevSlippageCoefficient, setPrevSlippageCoefficient] =
    useState(slippageCoefficient);
  if (prevSlippageCoefficient !== slippageCoefficient) {
    setPrevSlippageCoefficient(slippageCoefficient);
    setCustomValue(slippageCoefficient);
  }

  const errorMsg = useMemo(() => {
    const msg = validSlippageCoefficient(customValue, selectedVersion);
    return msg ?? '';
  }, [selectedVersion, customValue]);

  const errorInput = useMemo(
    () => !!(customValue && customValue !== '0' && !Number(customValue)),
    [customValue],
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
          <Trans>Slippage Coefficient</Trans>
          <QuestionTooltip
            title={t`The smaller the slippage coefficient, the lower the slippage for traders, and the deeper the market depth.`}
            ml={8}
            sx={{
              width: 16,
              height: 16,
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 12,
          }}
        >
          {slippageCoefficient}
          {selectedVersion !== Version.standard ? (
            <Button
              variant={Button.Variant.tag}
              sx={{
                ml: 12,
                fontSize: 12,
              }}
              onClick={() => setShowSlippageCoefficientDialog(true)}
            >
              {t`Edit`}
            </Button>
          ) : (
            ''
          )}
        </Box>
      </Box>

      <Dialog
        open={showSlippageCoefficientDialog}
        onClose={() => setShowSlippageCoefficientDialog(false)}
        title={
          <Box>
            <Trans>Slippage Coefficient</Trans>
            <QuestionTooltip
              title={t`The smaller the slippage coefficient, the lower the slippage for traders, and the deeper the market depth.`}
              ml={8}
            />
          </Box>
        }
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            py: 28,
          }}
        >
          {slippageCoefficientList.map((item) => {
            const selected = isCustomized ? false : customValue === item.value;
            return (
              <RadioButton
                key={item.value}
                title={item.title}
                description={item.description}
                onClick={() => {
                  dispatch({
                    type: Types.UpdateIsSlippageCoefficientCustomized,
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
                titleSx={{
                  typography: 'body1',
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
                  type: Types.UpdateIsSlippageCoefficientCustomized,
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
                type: Types.UpdateSlippageCoefficient,
                payload: customValue,
              });
              setShowSlippageCoefficientDialog(false);
            }}
          >
            <Trans>Confirm</Trans>
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
