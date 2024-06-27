import { Button } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import TokenStatusButton from '../../../components/TokenStatusButton';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { FetchMiningListItem } from '../types';
import { usePoolBalanceInfo } from '../../PoolWidget/hooks/usePoolBalanceInfo';
import { convertFetchTokenToTokenInfo } from '../../../utils';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { useStakeMiningSubmit } from '../hooks/useStakeMiningSubmit';

export function StakeButton({
  goLpLink,
  amount,
  miningItem,
  balanceInfo,
}: {
  amount: string;
  miningItem: FetchMiningListItem;
  balanceInfo: ReturnType<typeof usePoolBalanceInfo>;
  goLpLink?: () => Promise<void> | void;
}) {
  const stakeMutation = useStakeMiningSubmit({
    miningItem,
    amount,
  });

  const tokenSymbol = miningItem
    ? `${miningItem.baseToken?.symbol}-${miningItem.quoteToken?.symbol} LP`
    : '';

  const tokenStatus = useTokenStatus(
    miningItem
      ? convertFetchTokenToTokenInfo(
          {
            ...miningItem.baseLpToken,
            symbol: tokenSymbol,
          },
          miningItem.chainId,
        )
      : null,
    {
      contractAddress: miningItem?.miningContractAddress ?? '',
      overrideBalance: balanceInfo.userBaseLpBalance,
      amount,
    },
  );

  if (goLpLink && tokenSymbol && balanceInfo.userBaseLpBalance?.isZero()) {
    return (
      <Button fullWidth onClick={() => goLpLink()}>
        {t`Get ${tokenSymbol}`}
      </Button>
    );
  }

  return (
    <NeedConnectButton
      includeButton
      fullWidth
      showSwitchText
      autoSwitch
      chainId={miningItem?.chainId}
    >
      <TokenStatusButton status={tokenStatus}>
        <Button
          fullWidth
          isLoading={stakeMutation.isPending}
          disabled={!amount}
          onClick={() => {
            stakeMutation.mutate();
          }}
        >
          {stakeMutation.isPending ? (
            <Trans>Staking</Trans>
          ) : (
            <Trans>Stake</Trans>
          )}
        </Button>
      </TokenStatusButton>
    </NeedConnectButton>
  );
}
