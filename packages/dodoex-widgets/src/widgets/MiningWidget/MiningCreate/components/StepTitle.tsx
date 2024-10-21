import { Box, alpha, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { StateProps } from '../hooks/reducers';

export function StepTitle({
  currentStep,
}: {
  currentStep: StateProps['currentStep'];
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const steps = isMobile ? [0, 1, 2, 3] : [0, 1, 2];
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 60,
        py: 20,
        px: 20,
        backgroundColor: theme.palette.background.paper,
        zIndex: 1,
        [theme.breakpoints.up('tablet')]: {
          position: 'static',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            typography: 'h5',
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          {currentStep === 0
            ? t`Mining Type`
            : currentStep === 1
            ? t`Staking Rules`
            : currentStep === 2
            ? t`Reward Rules`
            : t`Confirm`}
        </Box>

        <Box
          sx={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {steps.map((i) => {
            return (
              <Box
                key={i}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 12,
                  background:
                    currentStep >= i
                      ? theme.palette.secondary.main
                      : theme.palette.mode === 'light'
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.secondary.main, 0.1),
                }}
              />
            );
          })}
        </Box>
      </Box>

      {currentStep === 2 && (
        <Box
          sx={{
            mt: 8,
            typography: 'body2',
            color: theme.palette.text.secondary,
          }}
        >
          {t`Total Rewards=Daily Rewards*Duration`}
        </Box>
      )}
    </Box>
  );
}
