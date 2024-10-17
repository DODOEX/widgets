import { MiningStatusE } from '@dodoex/api';
import { Button } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';
import { TabMiningI } from '../../types';
import { useDepositOrWithdrawOrClaim } from '../hooks/useDepositOrWithdrawOrClaim';
import { ClaimTips } from './ClaimTips';

export function UnstakeButton({
  depositOrWithdrawOrClaimMutation,
  id,
  version,
  lpTokenStatus,
  lpTokenAccountStakedBalance,
  currentTokenAmount,
  chainId,
  currentChainId,
  lpTokenBalanceLoading,
}: {
  depositOrWithdrawOrClaimMutation: ReturnType<
    typeof useDepositOrWithdrawOrClaim
  >['depositOrWithdrawOrClaimMutation'];
  id: TabMiningI['id'];
  version: TabMiningI['version'];
  lpTokenStatus: MiningStatusE;
  lpTokenAccountStakedBalance: BigNumber | undefined;
  currentTokenAmount: string;
  chainId: number;
  currentChainId: number | undefined;
  lpTokenBalanceLoading: boolean;
}) {
  const amount = useMemo(
    () =>
      lpTokenStatus === MiningStatusE.ended
        ? lpTokenAccountStakedBalance
        : new BigNumber(currentTokenAmount),
    [currentTokenAmount, lpTokenAccountStakedBalance, lpTokenStatus],
  );

  if (
    !amount ||
    !lpTokenAccountStakedBalance ||
    amount.isNaN() ||
    amount.lte(0) ||
    amount.gt(lpTokenAccountStakedBalance) ||
    lpTokenBalanceLoading
  ) {
    return (
      <NeedConnectButton includeButton fullWidth chainId={chainId}>
        <Button fullWidth disabled>
          <Trans>Unstake</Trans>
        </Button>
      </NeedConnectButton>
    );
  }

  return (
    <>
      {version === '2' && <ClaimTips />}

      <NeedConnectButton includeButton fullWidth chainId={chainId}>
        <Button
          fullWidth
          isLoading={depositOrWithdrawOrClaimMutation.isPending}
          onClick={() => {
            const withdrawAllLp = lpTokenAccountStakedBalance.lte(amount);
            depositOrWithdrawOrClaimMutation.mutate({
              amount,
              withdrawAll: withdrawAllLp,
              submitCallback: () => {
                // setOperateModalVisible(false);
              },
            });
          }}
        >
          {depositOrWithdrawOrClaimMutation.isPending ? (
            <Trans>Unstaking</Trans>
          ) : (
            <Trans>Unstake</Trans>
          )}
        </Button>
      </NeedConnectButton>
    </>
  );
}
