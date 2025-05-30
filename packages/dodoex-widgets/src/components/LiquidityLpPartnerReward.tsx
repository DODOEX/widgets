import { SystemApi } from '@dodoex/api';
import {
  alpha,
  Box,
  BoxProps,
  ButtonBase,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { useGraphQLRequests } from '../hooks/useGraphQLRequests';
import { useUserOptions } from './UserOptionsProvider';

type PartnerRewardType = 'holdlp' | 'stakelp';
export type LiquidityLpPartnerRewardItem = {
  partner: {
    name: string;
    logo: string;
    introduction: string;
    link: string;
    background?: string;
    color?: string;
    extra: any;
  };
  reward: string;
  type: PartnerRewardType;
  sort: number;
};

export default function LiquidityLpPartnerReward({
  address,
  chainId,
  hideName,
  sx,
}: {
  address: string | Array<string | undefined> | undefined;
  chainId: number | undefined;
  hideName?: boolean;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const graphQLRequests = useGraphQLRequests();
  const { onlyChainId } = useUserOptions();
  const rewardQuery = useQuery({
    ...graphQLRequests.getQuery(
      SystemApi.graphql.fetchLiquidityLpPartnerRewards,
      {
        where: {
          chainId: onlyChainId || undefined,
        },
      },
    ),
  });

  if (!address) return null;
  const rewardData = [] as LiquidityLpPartnerRewardItem[];
  const addressList: string[] =
    typeof address === 'string'
      ? [address]
      : (Array.from(new Set(address)).filter(
          (address) => !!address,
        ) as string[]);
  addressList.forEach((tokenAddress) => {
    if (!tokenAddress) return;
    rewardQuery.data?.liquidity_getLpPartnerRewards?.partnerRewards?.some(
      (item) => {
        if (
          item?.chainId === chainId &&
          item?.pool?.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase()
        ) {
          const partnerInfo =
            rewardQuery.data?.liquidity_getLpPartnerRewards?.partnerInfos?.find(
              (partner) => partner?.partner === item.partner,
            );
          if (!partnerInfo) return;
          rewardData.push({
            partner: {
              name: partnerInfo?.partner ?? '',
              logo: partnerInfo?.logo ?? '',
              introduction: partnerInfo?.introduction ?? '',
              link: partnerInfo?.link ?? '',
              extra: partnerInfo?.extra ?? {},
              background: partnerInfo?.theme?.[0] || undefined,
              color: partnerInfo?.theme?.[1] || undefined,
            },
            reward: item?.reward ?? '',
            type: (item?.type as PartnerRewardType) ?? 'stakelp',
            sort: partnerInfo?.sort ?? Number.MAX_SAFE_INTEGER,
          });
        }
      },
    );
  });
  if (!rewardData?.length) return null;
  rewardData.sort((a, b) => a.sort - b.sort);

  if (rewardData.length > 1) {
    const needStakeRewardData = rewardData.filter(
      (item) => item.type === 'stakelp',
    );
    const needLpRewardData = rewardData.filter(
      (item) => item.type === 'holdlp',
    );
    const needStakeText = <Trans>Points for staking LP tokens.</Trans>;
    const needLpText = <Trans>Points for LP token holders.</Trans>;

    return (
      <Tooltip
        leaveDelay={100}
        sx={{
          p: 12,
          minWidth: 218,
          maxWidth: 240,
        }}
        title={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {needStakeRewardData.length > 0 && (
              <>
                <Box
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                >
                  {needStakeText}
                </Box>
                <RewardList rewardData={needStakeRewardData} />
              </>
            )}
            {needLpRewardData.length > 0 && (
              <>
                <Box
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                >
                  {needLpText}
                </Box>
                <RewardList rewardData={needLpRewardData} />
              </>
            )}
          </Box>
        }
      >
        <ButtonBase
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: theme.spacing(2, 4),
            height: 16,
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.purple.main, 0.2),
            ...sx,
          }}
        >
          {rewardData.map((reward, index) => (
            <Box
              key={index}
              component="img"
              src={reward.partner.logo}
              alt={reward.partner.name}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                ml: index === 0 ? 0 : -4,
              }}
            />
          ))}
        </ButtonBase>
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        ...sx,
      }}
    >
      {rewardData.map((item) => (
        <Tooltip
          key={item.partner.name + item.reward}
          leaveDelay={100}
          title={
            <Box
              sx={{
                maxWidth: 240,
                whiteSpace: 'pre-wrap',
              }}
            >
              {item.partner.introduction}
              {!!item.partner.link && (
                <Box
                  component="a"
                  target="_blank"
                  href={item.partner.link}
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: 'primary.main',
                    '&:hover': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <Trans>Learn more</Trans>{' '}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.91667 2.91667V11.0833H11.0833V7H12.25V11.0833C12.25 11.725 11.725 12.25 11.0833 12.25H2.91667C2.26917 12.25 1.75 11.725 1.75 11.0833V2.91667C1.75 2.275 2.26917 1.75 2.91667 1.75H7V2.91667H2.91667ZM8.16667 2.91667V1.75H12.25V5.83333H11.0833V3.73917L5.34917 9.47333L4.52667 8.65083L10.2608 2.91667H8.16667Z"
                      fill="currentColor"
                    />
                  </svg>
                </Box>
              )}
            </Box>
          }
        >
          <ButtonBase
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              p: theme.spacing(0, 4),
              height: 20,
              borderRadius: 4,
              background: item.partner.background,
              color: item.partner.color,
              whiteSpace: 'nowrap',
            }}
          >
            <Box
              component="img"
              src={item.partner.logo}
              alt={item.partner.name}
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
              }}
            />
            {!hideName && !!item.reward && (
              <Box
                sx={{
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                {item.reward}
              </Box>
            )}
          </ButtonBase>
        </Tooltip>
      ))}
    </Box>
  );
}

function RewardList({
  rewardData,
}: {
  rewardData: LiquidityLpPartnerRewardItem[];
}) {
  return (
    <>
      {rewardData.map((reward, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            typography: 'h6',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'text.primary',
            }}
          >
            <Box
              key={reward.partner.name}
              component="img"
              src={reward.partner.logo}
              alt={reward.partner.name}
              sx={{
                flexShrink: 0,
                width: 12,
                height: 12,
                borderRadius: '50%',
              }}
            />
            {reward.reward}
          </Box>

          <Box
            component="a"
            target="_blank"
            href={reward.partner.link}
            rel="noopener noreferrer"
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'primary.main',
              '&:hover': {
                opacity: 0.5,
              },
            }}
          >
            <Trans>Learn more</Trans>{' '}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.91667 2.91667V11.0833H11.0833V7H12.25V11.0833C12.25 11.725 11.725 12.25 11.0833 12.25H2.91667C2.26917 12.25 1.75 11.725 1.75 11.0833V2.91667C1.75 2.275 2.26917 1.75 2.91667 1.75H7V2.91667H2.91667ZM8.16667 2.91667V1.75H12.25V5.83333H11.0833V3.73917L5.34917 9.47333L4.52667 8.65083L10.2608 2.91667H8.16667Z"
                fill="currentColor"
              />
            </svg>
          </Box>
        </Box>
      ))}
    </>
  );
}
