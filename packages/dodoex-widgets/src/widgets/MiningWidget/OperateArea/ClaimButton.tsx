import { Button } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { FetchMiningListItem } from '../types';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { useClaimMiningSubmit } from '../hooks/useClaimMiningSubmit';
import { useRewardListAmount } from '../hooks/useRewardListAmount';

export default function ClaimButton({
  miningItem,
}: {
  miningItem: FetchMiningListItem;
}) {
  const rewardQuery = useRewardListAmount({
    miningItem,
  });

  const stakeMutation = useClaimMiningSubmit({
    miningItem,
    successBack: () => {
      rewardQuery.refetch();
    },
  });

  return (
    <NeedConnectButton
      includeButton
      fullWidth
      showSwitchText
      autoSwitch
      chainId={miningItem?.chainId}
    >
      <Button
        fullWidth
        isLoading={stakeMutation.isPending}
        disabled={rewardQuery.totalReward.isZero()}
        onClick={() => {
          stakeMutation.mutate();
        }}
      >
        {stakeMutation.isPending ? (
          <Trans>Claiming</Trans>
        ) : (
          <Trans>One-Click Claim</Trans>
        )}
      </Button>
    </NeedConnectButton>
  );
}
