import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import TokenLogo from '../../../../components/TokenLogo';
import { truncatePoolAddress } from '../../../../utils/address';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { Actions, RewardI, StateProps, Types } from '../hooks/reducers';
import { SectionStatusT } from '../types';
import { computeDailyAmount, formatDate } from '../utils';

function CardItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: theme.palette.text.secondary,
        typography: 'body2',
      }}
    >
      {label}
      <Box
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 600,
        }}
      >
        {value ?? '-'}
      </Box>
    </Box>
  );
}

function RewardCard({
  index,
  reward,
  onClick,
}: {
  index: number;
  reward: RewardI;
  onClick?: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 16,
        backgroundColor: theme.palette.background.paper,
        flexGrow: 0,
        flexBasis: 'calc(50% - 6px)',
        px: 20,
        py: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        [theme.breakpoints.down('tablet')]: {
          backgroundColor: theme.palette.background.tag,
          flexBasis: '100%',
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
              lineHeight: '32px',
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {reward.token && reward.token.address ? (
              <TokenLogo
                address={reward.token?.address as string}
                width={32}
                height={32}
                chainId={reward.token?.chainId}
                url={reward.token?.logoURI}
                noShowChain
                marginRight={0}
              />
            ) : null}

            <Box>{reward.token?.symbol ?? '-'}</Box>
          </Box>
        </Box>

        {onClick ? (
          <Box
            component={ButtonBase}
            onClick={onClick}
            sx={{
              width: 20,
              height: 20,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.66659 2H6.33325L5.66659 2.66667H3.33325V4H12.6666V2.66667H10.3333L9.66659 2ZM10.6666 6V12.6667H5.33325V6H10.6666ZM3.99992 4.66667H11.9999V12.6667C11.9999 13.4 11.3999 14 10.6666 14H5.33325C4.59992 14 3.99992 13.4 3.99992 12.6667V4.66667Z"
                fill={theme.palette.error.main}
              />
            </svg>
          </Box>
        ) : null}
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
          reward.token && reward.token.address
            ? truncatePoolAddress(reward.token.address)
            : undefined
        }
      />
      <CardItem
        label={t`Start Time`}
        value={!reward.startTime ? '-' : formatDate(reward.startTime)}
      />
      <CardItem
        label={t`End Time`}
        value={!reward.endTime ? '-' : formatDate(reward.endTime)}
      />
      <CardItem
        label={t`Total Rewards`}
        value={
          reward.total != null && reward.token?.decimals != null
            ? `${formatTokenAmountNumber({
                input: reward.total,
                decimals: reward.token.decimals,
              })} ${reward.token.symbol}`
            : undefined
        }
      />
      <CardItem
        label={t`Daily Rewards`}
        value={
          reward.token?.symbol != null
            ? `${formatTokenAmountNumber({
                input: computeDailyAmount({
                  total: reward.total,
                  endTime: reward.endTime,
                  startTime: reward.startTime,
                }),
                decimals: reward.token?.decimals,
              })} ${reward.token?.symbol}`
            : undefined
        }
      />
    </Box>
  );
}

export function RewardDetailList({
  rewards,
  status,
  dispatch,
}: {
  rewards: StateProps['rewards'];
  status: SectionStatusT;
  dispatch: React.Dispatch<Actions>;
}) {
  const isWaiting = status === 'waiting';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        opacity: isWaiting ? 0.5 : 1,
      }}
    >
      {isWaiting ? (
        <RewardCard
          index={0}
          reward={{
            token: undefined,
            total: '',
            startTime: null,
            endTime: null,
          }}
        />
      ) : (
        rewards.map((reward, index) => {
          return (
            <RewardCard
              key={index}
              index={index}
              reward={reward}
              onClick={
                index !== 0
                  ? () => {
                      dispatch({
                        type: Types.removeReward,
                        payload: index,
                      });
                    }
                  : undefined
              }
            />
          );
        })
      )}
    </Box>
  );
}
