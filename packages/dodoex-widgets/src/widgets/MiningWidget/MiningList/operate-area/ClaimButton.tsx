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
  const isMutating =
    depositOrWithdrawOrClaimMutation.isPending &&
    depositOrWithdrawOrClaimMutation.variables?.metadata?.operateType ===
      'claim';
  return (
    <NeedConnectButton includeButton fullWidth chainId={chainId}>
      <Button
        fullWidth
        isLoading={isMutating}
        disabled={!hasUnclaimedReward}
        onClick={() => {
          depositOrWithdrawOrClaimMutation.mutate({
            amount: new BigNumber(0),
            metadata: {
              operateType: 'claim',
            },
          });
        }}
      >
        {isMutating ? <Trans>Claiming</Trans> : <Trans>One-Click Claim</Trans>}
      </Button>
    </NeedConnectButton>
  );
}
