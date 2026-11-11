import { SystemApi } from '@dodoex/api';
import { alpha, Box, Button, QuestionTooltip, useTheme } from '@dodoex/components';
import { Trans, t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { formatReadableNumber } from '../../../../utils';
import { useClaimLpFeeRewardSubmit } from '../hooks/useClaimLpFeeRewardSubmit';

// Decorative vertical bands layered over the banner gradient (matches the
// design's background texture). Each band is 100px wide; gray<->white
// gradients at low opacity create a subtle shimmer.
const BANNER_BANDS: Array<{ from: string; to: string; opacity: number }> = [
  { from: '#838383', to: '#ffffff', opacity: 0.14 },
  { from: '#ffffff', to: '#838383', opacity: 0.14 },
  { from: '#838383', to: '#ffffff', opacity: 0.1 },
  { from: '#ffffff', to: '#838383', opacity: 0.1 },
  { from: '#838383', to: '#ffffff', opacity: 0.08 },
  { from: '#ffffff', to: '#838383', opacity: 0.08 },
  { from: '#838383', to: '#ffffff', opacity: 0.06 },
];

function formatPoints(totalPoints: string | number | null | undefined) {
  const num = new BigNumber(totalPoints ?? 0);
  if (num.isNaN() || num.lte(0)) return '0.00';
  return formatReadableNumber({ input: num, showDecimals: 2 });
}

export default function LpFeeRewardBanner() {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { lpFeeRewardActivity } = useUserOptions();
  const { account } = useWalletInfo();
  const graphQLRequests = useGraphQLRequests();

  // Use the theme's primary color for the banner so it adapts to the host
  // theme (e.g. blue for FaroSwap), and contrastText for readable foreground.
  const bannerBg = theme.palette.primary.main;
  const bannerColor = theme.palette.primary.contrastText;

  const activity = lpFeeRewardActivity?.activity;

  const query = graphQLRequests.getQuery(
    SystemApi.graphql.fetchLpFeeRewardUserReward,
    {
      where: {
        activity: activity ?? '',
        user: account ?? '',
        periodId: lpFeeRewardActivity?.periodId,
      },
    },
  );
  const { data, refetch } = useQuery({
    ...query,
    enabled: !!account && !!activity,
  });

  const reward = data?.lp_fee_reward_getUserReward;
  const claimMutation = useClaimLpFeeRewardSubmit({
    reward,
    // Refresh the reward so the status flips to CLAIMED after a successful claim.
    successBack: () => {
      refetch();
    },
  });

  if (!lpFeeRewardActivity || !activity) return null;

  const {
    title,
    description,
    viewMoreLink,
    rewardTokenSymbol,
    rewardTokenLogo,
    myRewardsTooltip,
  } = lpFeeRewardActivity;

  const claimStatus = reward?.claimStatus;
  const isClaimable = claimStatus === 'CLAIMABLE';
  const isClaimed = claimStatus === 'CLAIMED';
  // CLAIMABLE / CLAIMED show the finalized claimable amount; ESTIMATING and
  // NOT_ELIGIBLE show the estimated amount.
  const displayPoints = formatPoints(
    isClaimable || isClaimed ? reward?.claimableReward : reward?.estimatedReward,
  );
  // Only CLAIMABLE enables the button (ESTIMATING/CLAIMED/NOT_ELIGIBLE disable it).
  const claimDisabled = !account || !isClaimable || claimMutation.isPending;

  const rewardAmount = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 4 : 8,
        color: bannerColor,
        // amount + symbol: 18px on mobile, 24px on desktop (matches design)
        fontSize: isMobile ? 18 : 24,
        lineHeight: 1.2,
        fontWeight: 700,
      }}
    >
      {rewardTokenLogo ? (
        <Box
          component="img"
          src={rewardTokenLogo}
          alt={rewardTokenSymbol ?? ''}
          sx={{
            width: isMobile ? 20 : 28,
            height: isMobile ? 20 : 28,
            borderRadius: '50%',
          }}
        />
      ) : null}
      <Box component="span">
        {displayPoints}
        {rewardTokenSymbol ? ` ${rewardTokenSymbol}` : ''}
      </Box>
    </Box>
  );

  const claimButton = (
    <Button
      disabled={claimDisabled}
      isLoading={claimMutation.isPending}
      fullWidth={isMobile}
      backgroundColor={bannerColor}
      sx={{
        position: 'relative',
        zIndex: 1,
        minWidth: 100,
        color: theme.palette.primary.main,
        fontWeight: 600,
        '&:hover': {
          backgroundColor: alpha(bannerColor, 0.85),
        },
        '&:disabled': {
          backgroundColor: alpha(bannerColor, 0.4),
          color: alpha(bannerColor, 0.6),
        },
      }}
      onClick={() => {
        if (claimDisabled) return;
        claimMutation.mutate();
      }}
    >
      {isClaimed ? <Trans>Claimed</Trans> : <Trans>Claim</Trans>}
    </Button>
  );

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        p: isMobile ? 16 : 20,
        background: `linear-gradient(90deg, ${bannerBg} 0%, ${alpha(
          bannerBg,
          0.82,
        )} 100%)`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 16 : 12,
      }}
    >
      {/* decorative background bands */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: 700,
          display: 'flex',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {BANNER_BANDS.map((band, index) => (
          <Box
            key={index}
            sx={{
              width: 100,
              height: '100%',
              opacity: band.opacity,
              background: `linear-gradient(180deg, ${band.from} 0%, ${band.to} 100%)`,
            }}
          />
        ))}
      </Box>

      {/* left: title + description */}
      <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
        <Box
          sx={{
            color: bannerColor,
            typography: isMobile ? 'h5' : 'h4',
            fontWeight: 700,
          }}
        >
          {`🔥 ${title ?? t`Liquidity Mining`}`}
        </Box>
        {(description || viewMoreLink) && (
          <Box
            sx={{
              mt: 4,
              color: alpha(bannerColor, 0.8),
              typography: 'body2',
            }}
          >
            {description}
            {viewMoreLink ? (
              <Box
                component="a"
                href={viewMoreLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  ml: description ? 4 : 0,
                  color: bannerColor,
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                <Trans>View more</Trans>
                {' →'}
              </Box>
            ) : null}
          </Box>
        )}
      </Box>

      {/* right: my rewards + claim */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'space-between' : 'flex-end',
          gap: isMobile ? 12 : 24,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: alpha(bannerColor, 0.8),
              typography: 'body2',
            }}
          >
            <Trans>My rewards</Trans>
            {myRewardsTooltip ? (
              <QuestionTooltip
                title={myRewardsTooltip}
                size={16}
                // HoverOpacity defaults the icon to text.secondary; force it to
                // match the adjacent "My rewards" label color instead.
                sx={{
                  color: alpha(bannerColor, 0.8),
                  '&:hover': { color: bannerColor },
                }}
              />
            ) : null}
          </Box>
          {rewardAmount}
        </Box>
        {!isMobile && claimButton}
      </Box>
      {isMobile && claimButton}
    </Box>
  );
}
