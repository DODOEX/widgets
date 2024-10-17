import { MiningStatusE } from '@dodoex/api';
import { Box, Button, useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';
import { useMemo, useState } from 'react';
import TokenLogoSimple from '../../../../components/TokenLogoSimple';
import { formatShortNumber } from '../../../../utils/formatter';
import { useMyCreatedMiningList } from '../../hooks/useMyCreatedMiningList';
import { useReviewRewardToken } from '../../hooks/useReviewRewardToken';
import { getMiningRewardStatus } from '../../hooks/utils';
import { MyCreatedMiningI, MyCreatedMiningRewardTokenI } from '../../types';
import { DailyRewardsLabel } from '../components/widgets';
import { formatDate } from '../utils';

function CardItem({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          color: theme.palette.text.secondary,
          typography: 'body2',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          color: theme.palette.text.primary,
          typography: 'body2',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

export function RewardCard({
  chainId,
  index,
  rewardToken,
  miningContractAddress,
  isNewERCMineV3,
  refetch,
}: {
  chainId: number;
  index: number;
  rewardToken: MyCreatedMiningRewardTokenI;
  miningContractAddress: string;
  isNewERCMineV3: MyCreatedMiningI['isNewERCMineV3'];
  refetch: ReturnType<typeof useMyCreatedMiningList>['refetch'];
}) {
  const { address, symbol } = rewardToken;

  const theme = useTheme();
  const { i18n } = useLingui();

  const [rewardUpdateModalVisible, setRewardUpdateModalVisible] =
    useState(false);

  const {
    inCurrentChain,
    blockNumber,
    blockTime,
    reviewedRewardToken,
    rewardAmount,
  } = useReviewRewardToken({
    chainId,
    miningContractAddress,
    index,
    rewardToken,
  });

  const type = useMemo(() => {
    const { startTime, endTime } = reviewedRewardToken;
    return getMiningRewardStatus({
      startTime,
      endTime,
    }).status;
  }, [reviewedRewardToken]);

  const isEditVisible = false;
  const isEditAvailable =
    isEditVisible && inCurrentChain && type === MiningStatusE.active;

  return (
    <Box
      sx={{
        mt: 16,
        px: 20,
        py: 12,
        backgroundColor: theme.palette.background.tag,
        borderRadius: 8,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 12,
        }}
      >
        <Box>
          <Box
            sx={{
              typography: 'h6',
              color: theme.palette.text.secondary,
            }}
          >
            {i18n._('Rewards')}&nbsp;{index + 1}
          </Box>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <TokenLogoSimple
              address={address}
              width={32}
              height={32}
              url={''}
            />
            <Box
              sx={{
                typography: 'body1',
                color: theme.palette.text.primary,
                fontWeight: 600,
              }}
            >
              {symbol ?? '-'}
            </Box>
          </Box>
        </Box>

        {isEditVisible && (
          <Button
            variant={Button.Variant.outlined}
            size={Button.Size.small}
            onClick={() => setRewardUpdateModalVisible(true)}
            disabled={!isEditAvailable}
          >
            {i18n._('Edit')}
          </Button>
        )}
      </Box>

      <Box
        sx={{
          borderTopStyle: 'solid',
          borderTopWidth: 1,
          borderTopColor: theme.palette.border.main,
          pt: 12,
          color: theme.palette.text.secondary,
          typography: 'body2',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 12,
        }}
      >
        <CardItem
          label={<DailyRewardsLabel />}
          value={
            rewardAmount.dailyReward
              ? formatShortNumber(rewardAmount.dailyReward)
              : '-'
          }
        />
        <CardItem
          label={i18n._('Remaining rewards/Total')}
          value={`${
            rewardAmount.unreleasedReward
              ? formatShortNumber(rewardAmount.unreleasedReward)
              : '-'
          }/${
            rewardAmount.totalReward
              ? formatShortNumber(rewardAmount.totalReward)
              : '-'
          }`}
        />
        <CardItem
          label={i18n._('Start Time')}
          value={
            !rewardToken.startTime
              ? '-'
              : formatDate(rewardToken.startTime.multipliedBy(1000).toNumber())
          }
        />
        <CardItem
          label={i18n._('End Time')}
          value={
            !reviewedRewardToken.endTime
              ? '-'
              : formatDate(
                  reviewedRewardToken.endTime.multipliedBy(1000).toNumber(),
                )
          }
        />
      </Box>
    </Box>
  );
}
