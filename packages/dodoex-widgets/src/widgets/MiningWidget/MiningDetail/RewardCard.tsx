import { Box, ButtonBase, Tooltip, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import React, { useMemo } from 'react';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import TokenLogo from '../../../components/TokenLogo';
import { formatShortNumber } from '../../../utils';
import { useReviewRewardToken } from '../hooks/useReviewRewardToken';
import { getMiningRewardStatus } from '../hooks/utils';
import { ReactComponent as HoverIcon } from '../MiningList/components/hover.svg';
import { MiningTags } from '../MiningList/components/MiningTags';
import { DailyRewardsLabel } from '../MiningList/components/widgets';
import { computeEndTimestampByEndBlock, formatDate } from '../MiningList/utils';
import {
  MiningRewardTokenWithAprI,
  RewardUpdateHistoryItemI,
  TabMiningI,
} from '../types';

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

export interface RewardCardProps {
  index: number;
  rewardToken: MiningRewardTokenWithAprI;
  miningContractAddress: string | undefined;
  chainId: number;
  version: TabMiningI['version'];
  rewardUpdateHistoryList: RewardUpdateHistoryItemI[];
}

export const RewardCard = ({
  index,
  rewardToken,
  miningContractAddress,
  chainId,
  version,
  rewardUpdateHistoryList,
}: RewardCardProps) => {
  const theme = useTheme();

  const type = useMemo(() => {
    const { startTime, endTime } = rewardToken;
    return getMiningRewardStatus({
      startTime,
      endTime,
    }).status;
  }, [rewardToken]);

  const { blockTime, reviewedRewardToken, rewardAmount } = useReviewRewardToken(
    {
      chainId,
      miningContractAddress,
      index,
      rewardToken,
      skip: version !== '3',
    },
  );

  const lastUpdateRewardInfo = useMemo(() => {
    if (!reviewedRewardToken.rewardPerBlock || !rewardToken.address) {
      return undefined;
    }
    const { rewardPerBlock } = reviewedRewardToken;
    const { address } = rewardToken;
    return rewardUpdateHistoryList.find(
      (item) =>
        !item.rewardPerBlockBN.eq(rewardPerBlock) &&
        item.rewardToken.address.toLowerCase() === address.toLowerCase(),
    );
  }, [reviewedRewardToken, rewardToken, rewardUpdateHistoryList]);

  const lastUpdateEndTime = useMemo(() => {
    if (
      !lastUpdateRewardInfo ||
      !lastUpdateRewardInfo.endBlockBN ||
      !reviewedRewardToken.endBlock ||
      !reviewedRewardToken.endTime
    ) {
      return undefined;
    }
    const { endBlock, endTime } = reviewedRewardToken;

    return computeEndTimestampByEndBlock({
      endBlock,
      endTime,
      targetEndBlock: lastUpdateRewardInfo.endBlockBN,
      blockTime,
    });
  }, [blockTime, lastUpdateRewardInfo, reviewedRewardToken]);

  return (
    <Box
      sx={{
        flexGrow: 0,
        flexBasis: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        px: 19,
        py: 15,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.border.main,
        backgroundColor: theme.palette.background.tag,
        [theme.breakpoints.up('tablet')]: {
          flexBasis: 'calc(50% - 6px)',
          flexGrow: 0,
          flexShrink: 1,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Box
            sx={{
              typography: 'h6',
              fontWeight: 500,
            }}
          >
            {t`Reward ${index + 1}`}
          </Box>
          <Box
            sx={{
              mt: 4,
              typography: 'body1',
              fontWeight: 600,
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {rewardToken && rewardToken.address ? (
              <TokenLogo
                address={rewardToken.address}
                width={24}
                height={24}
                chainId={chainId}
                url={undefined}
                noShowChain
                marginRight={0}
              />
            ) : null}

            <Box>{rewardToken?.symbol ?? '-'}</Box>
          </Box>
        </Box>

        <MiningTags type={type} />
      </Box>

      <Box
        sx={{
          width: '100%',
          height: '1px',
          backgroundColor: theme.palette.border.main,
        }}
      />

      <CardItem
        label={t`Address`}
        value={
          <AddressWithLinkAndCopy
            address={rewardToken.address ?? '-'}
            customChainId={chainId}
            showCopy
            truncate
            iconSpace={6}
            iconSize={14}
            size="small"
            sx={{
              fontWeight: 600,
            }}
          />
        }
      />

      <CardItem
        label={t`Start Time`}
        value={
          !rewardToken.startTime
            ? '-'
            : formatDate(rewardToken.startTime.multipliedBy(1000).toNumber())
        }
      />
      <CardItem
        label={
          lastUpdateEndTime ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {t`End Time`}
              <Tooltip
                placement="top"
                title={
                  <>
                    <Box>{t`End release time before adjustment`}:</Box>
                    <Box>{formatDate(lastUpdateEndTime)}</Box>
                  </>
                }
              >
                <Box
                  component={ButtonBase}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.text.secondary,
                    width: 16,
                    height: 17,
                    '&:hover': {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <HoverIcon />
                </Box>
              </Tooltip>
            </Box>
          ) : (
            t`End Time`
          )
        }
        value={
          !reviewedRewardToken.endTime
            ? '-'
            : formatDate(
                reviewedRewardToken.endTime.multipliedBy(1000).toNumber(),
              )
        }
      />
      {version === '3' && (
        <>
          <CardItem
            label={t`Total Rewards`}
            value={
              rewardAmount.totalReward != null
                ? `${formatShortNumber(rewardAmount.totalReward)} ${
                    rewardToken.symbol
                  }`
                : '-'
            }
          />
          <CardItem
            label={
              <DailyRewardsLabel
                titleTitle={
                  lastUpdateRewardInfo ? (
                    <>
                      <Box>{t`Daily rewards before adjustment`}</Box>
                      <Box>
                        {lastUpdateRewardInfo.dailyReward != null
                          ? `${formatShortNumber(
                              lastUpdateRewardInfo.dailyReward,
                            )} ${rewardToken?.symbol}`
                          : '-'}
                      </Box>
                      <br />
                    </>
                  ) : undefined
                }
              />
            }
            value={
              rewardAmount.dailyReward != null
                ? `${formatShortNumber(rewardAmount.dailyReward)} ${
                    rewardToken?.symbol
                  }`
                : '-'
            }
          />
          <CardItem
            label={t`Released Rewards`}
            value={
              rewardAmount.releasedReward != null
                ? `${formatShortNumber(rewardAmount.releasedReward)} ${
                    rewardToken?.symbol
                  }`
                : '-'
            }
          />
        </>
      )}
    </Box>
  );
};
