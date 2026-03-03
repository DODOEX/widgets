import { Box, Button, ButtonBase, Input, useTheme } from '@dodoex/components';
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
  const theme = useTheme();
  const {
    delayClaim,
    overflowLimit,
    poolFeeRate,
    claimStartTime,
    initClaimRate,
    freeCycle,
  } = state.optionalSettings;
  const { documentUrls } = useUserOptions();

  const remainingRate =
    initClaimRate !== null ? Math.max(0, 100 - initClaimRate) : null;

  const handleNumberInputChange = (
    field: 'claimStartTime' | 'initClaimRate' | 'freeCycle',
    value: string,
  ) => {
    if (value === '') {
      dispatch({
        type: Types.UpdateOptionalSettings,
        payload: { [field]: null },
      });
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      dispatch({
        type: Types.UpdateOptionalSettings,
        payload: { [field]: numValue },
      });
    }
  };

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
        minWidth: {
          mobile: '100%',
          tablet: 450,
        },
        mx: 'auto',
      }}
    >
      {/* Delayed Distribution */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
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
        {delayClaim && (
          <Box
            sx={{
              typography: 'body1',
              lineHeight: '46px',
            }}
          >
            <Trans>Tokens will be distributed</Trans>
            <Input
              height={36}
              type="number"
              placeholder="0"
              value={claimStartTime ?? ''}
              onChange={(e) =>
                handleNumberInputChange('claimStartTime', e.target.value)
              }
              sx={{
                width: 112,
                display: 'inline-flex',
                mx: '8px',
                verticalAlign: 'middle',
              }}
              suffix={
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                  <Trans>Days</Trans>
                </Box>
              }
            />
            <Trans>after settlement, upon releasing,</Trans>
            <Input
              height={36}
              type="number"
              placeholder="0-100"
              value={initClaimRate ?? ''}
              onChange={(e) =>
                handleNumberInputChange('initClaimRate', e.target.value)
              }
              sx={{
                width: 112,
                display: 'inline-flex',
                mx: '8px',
                verticalAlign: 'middle',
              }}
              suffixGap={4}
              suffix={
                <Box
                  sx={{
                    typography: 'body2',
                    color: 'text.secondary',
                    '&&&': {
                      mr: 16,
                    },
                  }}
                >
                  %
                </Box>
              }
            />
            <Trans>
              of tokens will be distributed immediately. The remaining
            </Trans>{' '}
            {remainingRate !== null ? `${remainingRate}%` : ''}{' '}
            <Trans>of token will be distributed linearly in</Trans>
            <Input
              height={36}
              type="number"
              placeholder="0"
              value={freeCycle ?? ''}
              onChange={(e) =>
                handleNumberInputChange('freeCycle', e.target.value)
              }
              sx={{
                width: 112,
                display: 'inline-flex',
                mx: '8px',
                verticalAlign: 'middle',
              }}
              suffix={
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                  <Trans>Days</Trans>
                </Box>
              }
            />
          </Box>
        )}
      </Box>

      {/* Allow over-raising */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
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
        {overflowLimit && (
          <Box
            sx={{
              padding: '11px 16px',
              borderRadius: '8px',
              position: 'relative',
              backgroundColor: 'background.paperContrast',
              typography: 'body2',
              color: 'text.secondary',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -5,
                right: 10,
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: `7px solid ${theme.palette.background.paperContrast}`,
              },
            }}
          >
            <Trans>
              After reach fund-raising cap, users could still put in funds and
              final distribution is according to their funding ratio.
            </Trans>
          </Box>
        )}
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
