import { alpha, Box, QuestionTooltip, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { StateProps } from '../reducer';

export function StepTitle({
  currentStep,
}: {
  currentStep: StateProps['currentStep'];
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  let titleLabel = '';
  let titleQuestion = '';
  let descriptionLabel = '';
  switch (currentStep) {
    case 0:
      titleLabel = t`Select Pool Version`;
      descriptionLabel = t`DODO provides a variety of pool versions to suit your needs.`;
      break;
    case 1:
      titleLabel = t`Parameter Settings`;
      break;
    case 2:
      titleLabel = t`Fee Rate`;
      titleQuestion = t`Pools with lower transaction fees will attract more traders.`;
      break;
    default:
      throw new Error(`Invalid Step ${currentStep}`);
  }
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        py: 20,
        px: 20,
        backgroundColor: theme.palette.background.paper,
        zIndex: 1,
        ...(!isMobile
          ? {
              position: 'static',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }
          : {}),
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
          {titleLabel}
        </Box>

        {titleQuestion && (
          <QuestionTooltip
            title={titleQuestion}
            sx={{
              width: 16,
              height: 16,
            }}
          />
        )}

        <Box
          sx={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {[0, 1, 2].map((i) => {
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
                      : alpha(theme.palette.primary.main, 0.1),
                }}
              />
            );
          })}
        </Box>
      </Box>

      {descriptionLabel && (
        <Box
          sx={{
            mt: 8,
            typography: 'body2',
            color: theme.palette.text.secondary,
          }}
        >
          {descriptionLabel}
        </Box>
      )}
    </Box>
  );
}
