import { Button } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';
import { TabMiningI } from '../../types';
import { useDepositOrWithdrawOrClaim } from '../hooks/useDepositOrWithdrawOrClaim';

export function ClaimButton({
  hasUnclaimedReward,
  depositOrWithdrawOrClaimMutation,
  id,
  chainId,
  currentChainId,
}: {
  hasUnclaimedReward: boolean;
  depositOrWithdrawOrClaimMutation: ReturnType<
    typeof useDepositOrWithdrawOrClaim
  >['depositOrWithdrawOrClaimMutation'];
  id: TabMiningI['id'];
  chainId: number;
  currentChainId: number | undefined;
}) {
  return (
    <NeedConnectButton includeButton fullWidth chainId={chainId}>
      <Button
        fullWidth
        isLoading={depositOrWithdrawOrClaimMutation.isPending}
        disabled={!hasUnclaimedReward}
        onClick={() => {
          depositOrWithdrawOrClaimMutation.mutate({
            amount: new BigNumber(0),
          });
        }}
      >
        {depositOrWithdrawOrClaimMutation.isPending ? (
          <Trans>Claiming</Trans>
        ) : (
          <Trans>One-Click Claim</Trans>
        )}
      </Button>
    </NeedConnectButton>
  );
}
