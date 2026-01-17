import { Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { StateProps, Types, StepStatus } from '../reducers';
import QuestionTooltip from '../../../../components/Tooltip/QuestionTooltip';
import { useTimeSettingsValidation } from '../hooks/useTimeSettingsValidation';
import ErrorTip from './ErrorTip';
import { DateTimePickerInput } from '../../../../components/DateTimePickerInput';
import Title from './Title';

interface TimeSettingsProps {
  state: StateProps;
  dispatch: (action: { type: Types; payload: any }) => void;
  onChangeStep?: (step: StepStatus) => void;
}

// Liquidity protection duration options in days
const LIQUIDITY_PROTECTION_OPTIONS = [30, 90, 180] as const;
type LiquidityProtectionDuration =
  (typeof LIQUIDITY_PROTECTION_OPTIONS)[number];

export default function TimeSettings({
  state,
  dispatch,
  onChangeStep,
}: TimeSettingsProps) {
  const theme = useTheme();
  const { errorKey, isValid } = useTimeSettingsValidation(state);
  const { bidStartTime, bidEndTime, freezeDuration } = state.timeSettings;

  const canProceed = isValid;

  const handleNext = () => {
    if (canProceed) {
      if (onChangeStep) {
        onChangeStep(StepStatus.OptionalSettings);
      } else {
        dispatch({
          type: Types.UpdateCurStep,
          payload: StepStatus.OptionalSettings,
        });
      }
    }
  };

  const handleBack = () => {
    if (onChangeStep) {
      onChangeStep(StepStatus.PriceSettings);
    } else {
      dispatch({
        type: Types.UpdateCurStep,
        payload: StepStatus.PriceSettings,
      });
    }
  };

  const handleLiquidityProtectionChange = (
    days: LiquidityProtectionDuration,
  ) => {
    dispatch({
      type: Types.UpdateTimeSettings,
      payload: { freezeDuration: days },
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        alignItems: 'center',
        pt: 40,
        pb: {
          tablet: 20,
        },
        maxWidth: {
          mobile: '100%',
          tablet: 458,
        },
        mx: 'auto',
      }}
    >
      {/* Date Inputs Row */}
      <Box
        sx={{
          display: 'flex',
          gap: '12px',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {/* Start Time */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '217px',
          }}
        >
          <Title
            question={t`Participants can only stake after the Crowdpooling period starts.`}
          >
            <Trans>Start Time</Trans>
          </Title>
          <DateTimePickerInput
            value={bidStartTime}
            onChange={(date) => {
              dispatch({
                type: Types.UpdateTimeSettings,
                payload: { bidStartTime: date },
              });
            }}
            placeholder="Select start time"
            minDate={Date.now()}
            valueFormat="MM/DD/YYYY HH:mm:ss"
          />
        </Box>

        {/* End Time */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '217px',
          }}
        >
          <Title
            question={t`Participants will receive their tokens after this time.`}
          >
            <Trans>End Time</Trans>
          </Title>
          <DateTimePickerInput
            value={bidEndTime}
            onChange={(date) => {
              dispatch({
                type: Types.UpdateTimeSettings,
                payload: { bidEndTime: date },
              });
            }}
            placeholder="Select end time"
            minDate={bidStartTime || undefined}
            valueFormat="MM/DD/YYYY HH:mm:ss"
          />
        </Box>
      </Box>

      {/* Liquidity Protection */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}
      >
        <Title
          question={t`After the end of a Crowdpooling campaign, there is a Liquidity Protection period. During this period, the Crowdpooling campaign creator's funds will be locked to guarantee sufficient market depth and liquidity.`}
        >
          <Trans>Liquidity Protection</Trans>
        </Title>

        {/* Duration Buttons */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}
        >
          {LIQUIDITY_PROTECTION_OPTIONS.map((days) => {
            const isSelected = freezeDuration === days;
            return (
              <ButtonBase
                key={days}
                onClick={() => handleLiquidityProtectionChange(days)}
                sx={{
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: isSelected
                    ? 'primary.main'
                    : 'background.input',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 500,
                    color: isSelected
                      ? theme.palette.primary.contrastText
                      : 'text.primary',
                  }}
                >
                  <Trans>{days} Days</Trans>
                </Box>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
        }}
      />

      {/* Error Display */}
      <ErrorTip errorKey={errorKey} />

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          width: '100%',
          position: {
            mobile: 'sticky',
            tablet: 'relative',
          },
          bottom: 0,
          backgroundColor: 'background.paper',
          pt: 28,
          pb: 20,
        }}
      >
        <Button
          variant={Button.Variant.second}
          size={Button.Size.big}
          onClick={handleBack}
          fullWidth
        >
          <Trans>Back</Trans>
        </Button>
        <Button
          onClick={handleNext}
          size={Button.Size.big}
          disabled={!canProceed}
          fullWidth
        >
          <Trans>Next</Trans>
        </Button>
      </Box>
    </Box>
  );
}
