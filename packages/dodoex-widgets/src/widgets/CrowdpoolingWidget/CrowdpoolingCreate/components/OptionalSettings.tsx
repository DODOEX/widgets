import { Box, Button, ButtonBase, Input } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { StateProps, Types, StepStatus } from '../reducers';
import Title from './Title';
import { TextSwitch } from '../../../../components/TextSwitch';
import { useUserOptions } from '../../../../components/UserOptionsProvider';

interface OptionalSettingsProps {
  state: StateProps;
  dispatch: (action: { type: Types; payload: any }) => void;
  onChangeStep?: (step: StepStatus) => void;
  onConfirmSubmit?: () => void;
}

export default function OptionalSettings({
  state,
  dispatch,
  onChangeStep,
  onConfirmSubmit,
}: OptionalSettingsProps) {
  const { delayClaim, overflowLimit, poolFeeRate } = state.optionalSettings;
  const { documentUrls } = useUserOptions();

  const handleNext = () => {
    if (onConfirmSubmit) {
      onConfirmSubmit();
    } else {
      if (onChangeStep) {
        onChangeStep(StepStatus.IntroSettings);
      } else {
        dispatch({
          type: Types.UpdateCurStep,
          payload: StepStatus.IntroSettings,
        });
      }
    }
  };

  const handleBack = () => {
    if (onChangeStep) {
      onChangeStep(StepStatus.TimeSettings);
    } else {
      dispatch({
        type: Types.UpdateCurStep,
        payload: StepStatus.TimeSettings,
      });
    }
  };

  const handlePoolFeeRateChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      dispatch({
        type: Types.UpdateOptionalSettings,
        payload: { poolFeeRate: numValue },
      });
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
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
      {/* Delayed Distribution */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title
          question={t`If this option is selected, the tokens will be locked up and released in a linear fashion instead of being fully claimable at the end of the Crowdpooling campaign.`}
        >
          <Trans>Delayed Distribution</Trans>
        </Title>
        <TextSwitch
          checked={delayClaim}
          onChange={(checked) => {
            dispatch({
              type: Types.UpdateOptionalSettings,
              payload: { delayClaim: checked },
            });
          }}
          sx={{
            width: 92,
            height: 36,
          }}
        />
      </Box>

      {/* Allow over-raising */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title
          question={t`If this option is selected, users could still put in funds and final distribution is according to their funding ratio,after reach fund-raising cap.`}
        >
          <Trans>Allow Over-raising</Trans>
        </Title>
        <TextSwitch
          checked={overflowLimit}
          onChange={(checked) => {
            dispatch({
              type: Types.UpdateOptionalSettings,
              payload: { overflowLimit: checked },
            });
          }}
          sx={{
            width: 92,
            height: 36,
          }}
        />
      </Box>

      {/* Pool Transaction fee */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Title
          question={t`This is the trading fee rate of the liquidity pool generated at the end of the Crowdpooling campaign; by default this is set to 0.3%.`}
        >
          <Trans>Pool Transaction Fee</Trans>
        </Title>
        <Input
          height={48}
          type="number"
          value={poolFeeRate}
          onChange={(e) => handlePoolFeeRateChange(e.target.value)}
          sx={{
            backgroundColor: 'background.paperContrast',
          }}
          suffix={
            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>%</Box>
          }
        />
      </Box>

      {/* Whitelist setting */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title>
          <Trans>Whitelist setting</Trans>
        </Title>
        <Box
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          href={documentUrls?.crowdpoolingWhitelist}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            typography: 'body2',
            color: 'primary.main',
            fontSize: '14px',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          <span>
            <Trans>How to set up a whitelist</Trans>
          </span>
          <span>{'>'}</span>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
        }}
      />

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
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
        <Button onClick={handleNext} size={Button.Size.big} fullWidth>
          <Trans>{onConfirmSubmit ? 'Confirm' : 'Next'}</Trans>
        </Button>
      </Box>
    </Box>
  );
}
