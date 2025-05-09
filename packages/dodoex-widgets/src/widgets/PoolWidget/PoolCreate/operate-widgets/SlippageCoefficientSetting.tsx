import {
  Button,
  Box,
  useTheme,
  QuestionTooltip,
  ButtonBase,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { Dispatch, useMemo, useState } from 'react';
import Dialog from '../../../../components/WidgetDialog';
import RadioButton from '../components/RadioButton';
import { RadioButtonTag } from '../components/RadioButtonTag';
import { SelectAndInput } from '../components/SelectAndInput';
import { useSlippageCoefficientList } from '../hooks/useSlippageCoefficientList';
import { validSlippageCoefficient } from '../hooks/useValidation';
import { Actions, StateProps, Types } from '../reducer';
import { SettingItemWrapper } from './widgets';
import { ReactComponent as Arrow } from './arrow.svg';

export function SlippageCoefficientSetting({
  dispatch,
  slippageCoefficient,
  selectedVersion,
  isCustomized,
  isStandardVersion,
}: {
  dispatch: Dispatch<Actions>;
  slippageCoefficient: StateProps['slippageCoefficient'];
  selectedVersion: StateProps['selectedVersion'];
  isCustomized: StateProps['isSlippageCoefficientCustomized'];
  isStandardVersion: boolean;
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
      <SettingItemWrapper
        title={
          <>
            <Trans>Slippage Coefficient</Trans>
            <QuestionTooltip
              title={t`The smaller the slippage coefficient, the lower the slippage for traders, and the deeper the market depth.`}
              ml={4}
              sx={{
                width: 14,
                height: 14,
              }}
            />
          </>
        }
        sx={{
          mt: 20,
        }}
      >
        <Box
          component={ButtonBase}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 20,
            py: 8,
            color: theme.palette.text.primary,
            borderRadius: 8,
            backgroundColor: theme.palette.background.cardInput,
            '&:hover': {
              backgroundColor: theme.palette.hover.default,
            },
            '&[disabled]>svg': {
              color: theme.palette.text.disabled,
            },
          }}
          disabled={isStandardVersion}
          onClick={
            isStandardVersion
              ? undefined
              : () => {
                  setShowSlippageCoefficientDialog(true);
                }
          }
        >
          <Box
            sx={{
              typography: 'h5',
              fontWeight: 600,
              lineHeight: '32px',
            }}
          >
            {slippageCoefficient}
          </Box>
          <Box
            component={Arrow}
            sx={{
              flexShrink: 0,
              width: 18,
              height: 18,
            }}
          />
        </Box>
      </SettingItemWrapper>

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
            {slippageCoefficientList.map((item) => {
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
                  type: Types.UpdateSlippageCoefficient,
                  payload: customValue,
                });
                setShowSlippageCoefficientDialog(false);
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
