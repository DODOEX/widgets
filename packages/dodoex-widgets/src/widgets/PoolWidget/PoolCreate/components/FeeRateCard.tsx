import { Box, alpha, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { StateProps } from '../reducer';
import { DEFAULT_FEE_RATE } from '../utils';
import { RadioButtonTag } from './RadioButtonTag';

export function FeeRateCard({
  isWaiting,
  feeRate,
}: {
  isWaiting: boolean;
  feeRate: StateProps['feeRate'];
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: theme.palette.background.paper,
        width: '50%',
        opacity: !isWaiting ? 1 : 0.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          typography: 'h5',
          fontWeight: 600,
        }}
      >
        {!isWaiting ? (
          <>
            {feeRate || '-'}%
            {feeRate === DEFAULT_FEE_RATE && (
              <RadioButtonTag
                tagKey={t`99% Default`}
                color={theme.palette.purple.main}
                backgroundColor={alpha(theme.palette.purple.main, 0.1)}
              />
            )}
          </>
        ) : (
          '-'
        )}
      </Box>
      <Box
        sx={{
          typography: 'h6',
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mt: 8,
        }}
      >
        <Trans>Fee Rate</Trans>
      </Box>
    </Box>
  );
}
