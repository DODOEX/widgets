import { MiningStatusE } from '@dodoex/api';
import { Box, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { MiningMiningI, OperateDataProps } from '../../types';
import { TokenAmountPopover } from '../components/TokenAmountPopover';
import { ReactComponent as HoverIcon } from '../components/hover.svg';

function Item({
  value,
  label,
  tokenList,
  customChainId,
}: {
  value: BigNumber | undefined;
  label: string;
  tokenList: Parameters<typeof TokenAmountPopover>[0]['tokenList'];
  customChainId: number;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 0,
        flexShrink: 1,
        width: '30%',
      }}
    >
      <Box
        sx={{
          typography: 'h6',
          color: theme.palette.text.secondary,
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          mt: 8,
          typography: 'body1',
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {value
          ? `$${formatTokenAmountNumber({
              input: value,
              decimals: 2,
            })}`
          : '-'}
        <TokenAmountPopover
          trigger={
            <Box
              component={HoverIcon}
              sx={{
                color: theme.palette.text.secondary,
                width: 16,
                height: 17,
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }}
            />
          }
          tokenList={tokenList}
        />
      </Box>
    </Box>
  );
}

export function AssociatedMine({
  chainId,
  miningContractAddress,
  totalRewardUSD,
  stakedTokenUSD,
  miningTitle,
  rewardTokenList,
  stakedTokenWithAmountList,
  lpTokenStatus,
  associatedMineSectionShort,
}: {
  chainId: number;
  miningContractAddress: MiningMiningI['miningContractAddress'];
  miningTitle: string | undefined;
  lpTokenStatus: MiningStatusE;
  associatedMineSectionShort?: boolean;
} & Pick<
  OperateDataProps,
  | 'totalRewardUSD'
  | 'stakedTokenUSD'
  | 'rewardTokenList'
  | 'stakedTokenWithAmountList'
>) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 8,
        borderColor: theme.palette.border.main,
        borderStyle: 'solid',
        borderWidth: 1,
        mb: 20,
      }}
    >
      {associatedMineSectionShort ? null : null}

      <Box
        sx={{
          py: 12,
          px: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Item
          value={stakedTokenUSD}
          label={t`My Staked`}
          tokenList={stakedTokenWithAmountList.map(
            ({ symbol, address, sourceTokenAmount, decimals, logoImg }) => ({
              symbolEle: symbol,
              address,
              logoImg,
              rightContent: formatTokenAmountNumber({
                input: sourceTokenAmount,
                decimals,
              }),
            }),
          )}
          customChainId={chainId}
        />
        <Box
          sx={{
            width: '1px',
            height: 30,
            backgroundColor: theme.palette.border.main,
            flexGrow: 0,
            flexShrink: 0,
          }}
        />
        <Item
          value={totalRewardUSD}
          label={t`Rewards`}
          tokenList={rewardTokenList.map(
            ({ symbolEle, address, pendingReward, decimals, logoImg }) => ({
              symbolEle,
              address,
              logoImg,
              rightContent: formatTokenAmountNumber({
                input: pendingReward,
                decimals,
              }),
            }),
          )}
          customChainId={chainId}
        />
      </Box>
    </Box>
  );
}
