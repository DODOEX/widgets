import { Button } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { FetchMiningListItem } from '../types';
import TokenStatusButton from '../../../components/TokenStatusButton';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { convertFetchTokenToTokenInfo } from '../../../utils';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { useUnstakeMiningSubmit } from '../hooks/useUnstakeMiningSubmit';
import { BalanceData } from '../../../hooks/Submission/useBalanceUpdateLoading';

export default function UnstakeButton({
  amount,
  miningItem,
  overrideBalance,
  submittedBack,
  successBack,
  logBalance,
}: {
  amount: string;
  miningItem: FetchMiningListItem;
  overrideBalance: BigNumber | undefined | null;
  submittedBack?: () => void;
  successBack?: () => void;
  logBalance?: BalanceData;
}) {
  const stakeMutation = useUnstakeMiningSubmit({
    miningItem,
    amount,
    submittedBack,
    successBack,
    logBalance,
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
      overrideBalance,
      amount,
      skipQuery: true,
    },
  );

  return (
    <NeedConnectButton includeButton fullWidth chainId={miningItem?.chainId}>
      <TokenStatusButton status={tokenStatus}>
        <Button
          fullWidth
          isLoading={stakeMutation.isPending}
          disabled={!Number(amount)}
          onClick={() => {
            stakeMutation.mutate();
          }}
        >
          {stakeMutation.isPending ? (
            <Trans>Unstaking</Trans>
          ) : (
            <Trans>Unstake</Trans>
          )}
        </Button>
      </TokenStatusButton>
    </NeedConnectButton>
  );
}
