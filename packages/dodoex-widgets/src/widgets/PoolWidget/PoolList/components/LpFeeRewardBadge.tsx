import { alpha, Box, BoxProps, Tooltip, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { formatApy } from '../../../../utils';

/**
 * The 🔥 reward badge shown on pool rows that participate in the LP fee reward
 * activity. Styled with the theme primary color (matches the design's blue
 * badge) and shows the activity title/description in a tooltip on hover.
 *
 * `apy` is the `pair.apy.lpFeeRewardApy` fraction from the liquidity list (e.g.
 * 0.241 -> "24.1%").
 */
export default function LpFeeRewardBadge({
  apy,
  sx,
}: {
  apy?: string | number | null;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const { lpFeeRewardActivity } = useUserOptions();
  const apyText =
    apy != null && apy !== '' ? formatApy(new BigNumber(apy)) : undefined;
  const title = lpFeeRewardActivity?.title || t`Liquidity Mining`;
  const description = lpFeeRewardActivity?.description;

  return (
    <Tooltip
      leaveDelay={100}
      title={
        <Box
          sx={{
            maxWidth: 240,
            whiteSpace: 'pre-wrap',
          }}
        >
          <Box
            sx={{
              fontWeight: 600,
            }}
          >
            {`🔥 ${title}`}
          </Box>
          {description ? (
            <Box
              sx={{
                mt: 2,
                color: 'text.secondary',
              }}
            >
              {description}
            </Box>
          ) : null}
        </Box>
      }
    >
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          px: 4,
          height: 20,
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          typography: 'h6',
          ...sx,
        }}
      >
        {`🔥${apyText ? ` ${apyText}` : ''}`}
      </Box>
    </Tooltip>
  );
}
