import { Box, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import TokenLogoSimple from '../../../../components/TokenLogoSimple';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { MiningRewardTokenWithAprI } from '../../types';

export function RewardTokenTable({
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
  return (
    <>
      {rewardTokenWithAprList.map(
        ({ address, usdPrice, pendingReward, symbol, decimals, logoImg }) => {
          return (
            <Box
              key={address}
              sx={{
                mt: 16,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              {address && symbol && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.text.primary,
                    typography: 'h5',
                  }}
                >
                  <TokenLogoSimple
                    address={address}
                    width={24}
                    height={24}
                    url={''}
                  />

                  <Box component="span">{symbol}</Box>
                </Box>
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
                    input: pendingReward,
                    decimals: decimals,
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
                  {usdPrice !== undefined && pendingReward != null
                    ? `≈ $${formatTokenAmountNumber({
                        input: pendingReward
                          .multipliedBy(usdPrice)
                          .dp(4, BigNumber.ROUND_DOWN),
                        decimals: 4,
                      })}`
                    : '-'}
                </Box>
              </Box>
            </Box>
          );
        },
      )}
    </>
  );
}
