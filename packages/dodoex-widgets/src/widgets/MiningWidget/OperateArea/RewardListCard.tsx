import { Box, BoxProps, LoadingSkeleton, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import TokenItem from '../../../components/Token/TokenItem';
import { formatTokenAmountNumber } from '../../../utils/formatter';
import { useRewardListAmount } from '../hooks/useRewardListAmount';
import { FetchMiningListItem } from '../types';

export function RewardListCard({
  miningItem,
  loading,
  sx,
}: {
  miningItem: FetchMiningListItem;
  loading?: boolean;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const rewardQuery = useRewardListAmount({
    miningItem,
  });

  return (
    <Box
      sx={{
        borderWidth: 1,
        borderRadius: 12,
        ...sx,
      }}
    >
      <Box
        sx={{
          typography: 'body1',
          color: theme.palette.text.secondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 20,
          py: 12,
        }}
      >
        <Trans>Rewards</Trans>:
        <LoadingSkeleton
          loading={loading || rewardQuery.pending}
          loadingProps={{
            width: 100,
          }}
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          {!rewardQuery.pending && !rewardQuery.error
            ? `$${formatTokenAmountNumber({
                input: rewardQuery.totalRewardUSD,
                decimals: 2,
              })}`
            : '-'}
        </LoadingSkeleton>
      </Box>

      <Box
        sx={{
          borderTopWidth: 1,
          px: 20,
          pt: 4,
          pb: 8,
        }}
      >
        {(loading || rewardQuery.pending) && (
          <LoadingSkeleton
            loading={loading}
            loadingProps={{
              width: 150,
            }}
          />
        )}
        {!loading &&
          !rewardQuery.pending &&
          !!miningItem &&
          rewardQuery.data.map((reward) => {
            return (
              <Box
                key={reward.address}
                sx={{
                  mt: 16,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                {reward.address && reward.symbol && (
                  <TokenItem
                    chainId={miningItem.chainId}
                    address={reward.address}
                    showName={reward.symbol}
                    size={24}
                    offset={6}
                  />
                )}
                <Box
                  sx={{
                    ml: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      typography: 'h5',
                      textAlign: 'right',
                    }}
                  >
                    {formatTokenAmountNumber({
                      input: reward.amount,
                      decimals: reward.decimals,
                    })}
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      typography: 'body2',
                      color: theme.palette.text.secondary,
                      textAlign: 'right',
                    }}
                  >
                    {reward.usdPrice && reward.amount
                      ? `≈ $${formatTokenAmountNumber({
                          input: new BigNumber(reward.amount)
                            .multipliedBy(reward.usdPrice)
                            .dp(4, BigNumber.ROUND_DOWN),
                          decimals: 4,
                        })}`
                      : '-'}
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}
