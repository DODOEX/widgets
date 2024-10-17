import { Box, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { MiningRewardTokenWithAprI } from '../../types';
import { useTotalRewardUSD } from '../hooks/useTotalRewardUSD';
import { RewardTokenTable } from './RewardTokenTable';

export function RewardListCard({
  rewardTokenWithAprList,
  customChainId,
}: {
  rewardTokenWithAprList: Array<
    Pick<
      MiningRewardTokenWithAprI,
      | 'decimals'
      | 'pendingReward'
      | 'usdPrice'
      | 'symbol'
      | 'address'
      | 'logoImg'
    >
  >;
  customChainId?: number;
}) {
  const theme = useTheme();

  const totalRewardUSD = useTotalRewardUSD({ rewardTokenWithAprList });

  return (
    <Box
      sx={{
        borderColor: theme.palette.divider,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 12,
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
        {t`Rewards`}:
        <Box
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          {totalRewardUSD
            ? `$${formatTokenAmountNumber({
                input: totalRewardUSD,
                decimals: 2,
              })}`
            : '-'}
        </Box>
      </Box>

      <Box
        sx={{
          borderTopColor: theme.palette.divider,
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          px: 20,
          pt: 4,
          pb: 8,
        }}
      >
        <RewardTokenTable
          rewardTokenWithAprList={rewardTokenWithAprList}
          customChainId={customChainId}
        />
      </Box>
    </Box>
  );
}
