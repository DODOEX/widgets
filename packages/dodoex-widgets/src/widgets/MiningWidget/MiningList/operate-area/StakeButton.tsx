import { MiningStatusE } from '@dodoex/api';
import { Button } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';
import TokenStatusButton from '../../../../components/TokenStatusButton';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';
import { MiningLpTokenI, MiningMiningI, TabMiningI } from '../../types';
import { useDepositOrWithdrawOrClaim } from '../hooks/useDepositOrWithdrawOrClaim';
import { ClaimTips } from './ClaimTips';

export function StakeButton({
  depositOrWithdrawOrClaimMutation,
  id,
  firstStartTime,
  source,
  version,
  miningContractAddress,
  lpTokenStatus,
  currentTokenAmount,
  lpTokenAccountBalance,
  submitApprove,
  goLpLink,
  optToken,
  approveTokenStatus,
  isApproving,
  isGetApproveLoading,
  chainId,
  currentChainId,
  lpTokenBalanceLoading,
}: {
  depositOrWithdrawOrClaimMutation: ReturnType<
    typeof useDepositOrWithdrawOrClaim
  >['depositOrWithdrawOrClaimMutation'];
  id: TabMiningI['id'];
  firstStartTime: BigNumber | undefined;
  source: TabMiningI['source'];
  version: TabMiningI['version'];
  miningContractAddress: MiningMiningI['miningContractAddress'];
  lpTokenStatus: MiningStatusE;
  currentTokenAmount: string;
  lpTokenAccountBalance: BigNumber | undefined;
  submitApprove: () => Promise<void>;
  goLpLink: () => Promise<void>;
  optToken: MiningLpTokenI;
  approveTokenStatus: ReturnType<typeof useTokenStatus>;
  isApproving: boolean;
  isGetApproveLoading: boolean;
  chainId: number;
  currentChainId: number | undefined;
  lpTokenBalanceLoading: boolean;
}) {
  const amount = useMemo(
    () => new BigNumber(currentTokenAmount),
    [currentTokenAmount],
  );

  if (
    lpTokenStatus !== MiningStatusE.active ||
    !lpTokenAccountBalance ||
    lpTokenAccountBalance.lte(0) ||
    !amount ||
    amount.isNaN() ||
    amount.lte(0) ||
    amount.gt(lpTokenAccountBalance) ||
    lpTokenBalanceLoading
  ) {
    return (
      <NeedConnectButton includeButton fullWidth chainId={chainId}>
        <Button fullWidth disabled>
          <Trans>Stake</Trans>
        </Button>
      </NeedConnectButton>
    );
  }

  const isMutating =
    depositOrWithdrawOrClaimMutation.isPending &&
    depositOrWithdrawOrClaimMutation.variables?.metadata?.operateType ===
      'stake';
  return (
    <>
      {version === '2' && <ClaimTips />}

      <NeedConnectButton includeButton fullWidth chainId={chainId}>
        <TokenStatusButton status={approveTokenStatus}>
          <Button
            fullWidth
            isLoading={isMutating}
            disabled={!Number(amount)}
            onClick={() => {
              depositOrWithdrawOrClaimMutation.mutate({
                amount,
                withdrawAll: false,
                submitCallback: () => {
                  // setOperateModalVisible(false);
                },
                metadata: {
                  operateType: 'stake',
                },
              });
            }}
          >
            {isMutating ? <Trans>Staking</Trans> : <Trans>Stake</Trans>}
          </Button>
        </TokenStatusButton>
      </NeedConnectButton>
    </>
  );
}
