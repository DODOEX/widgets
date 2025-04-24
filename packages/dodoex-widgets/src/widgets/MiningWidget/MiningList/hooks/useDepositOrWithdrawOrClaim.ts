import { basicTokenMap } from '@dodoex/api';
import { Interface } from '@ethersproject/abi';
import { parseFixed } from '@ethersproject/bignumber';
import { t } from '@lingui/macro';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { Metadata, MetadataFlag } from '../../../../hooks/Submission/types';
import { getEthersValue } from '../../../../utils/bytes';
import {
  MiningLpTokenI,
  MiningMiningI,
  OperateDataProps,
  TabMiningI,
} from '../../types';

export function useDepositOrWithdrawOrClaim({
  version,
  miningContractAddress,
  stakeTokenAddress,
  id,
  source,
  lpTokenAccountStakedBalance,
  selectedStakeTokenIndex,
  operateType,
  lpToken,
  stakeSuccessCallback,
  unstakeSuccessCallback,
  claimSuccessCallback,
}: {
  lpTokenAccountStakedBalance: BigNumber | undefined;
  miningContractAddress: MiningMiningI['miningContractAddress'];
  selectedStakeTokenIndex: 0 | 1;
  operateType: OperateDataProps['operateType'];
  lpToken: MiningLpTokenI;
  stakeSuccessCallback?: () => void;
  unstakeSuccessCallback?: () => void;
  claimSuccessCallback?: () => void;
} & Pick<TabMiningI, 'version' | 'stakeTokenAddress' | 'source' | 'id'>) {
  const { chainId, account } = useWalletInfo();

  const submission = useSubmission();

  const EtherToken = useMemo(() => basicTokenMap[chainId], [chainId]);

  const depositOrWithdrawOrClaimMutation = useMutation({
    mutationFn: async ({
      amount,
      withdrawAll,
      submitCallback,
      canceledCallback,
      failedCallback,
      metadata,
    }: {
      amount: BigNumber;
      withdrawAll?: boolean;
      submitCallback?: () => void;
      canceledCallback?: () => void;
      failedCallback?: () => void;
      metadata?: Metadata;
    }) => {
      if (!lpToken || lpToken.decimals === undefined || !lpToken.address) {
        return;
      }
      const toContractAddress = miningContractAddress;

      const handleAmount = parseFixed(
        amount.dp(lpToken.decimals, BigNumber.ROUND_FLOOR).toString(),
        lpToken.decimals,
      ).toString();

      let data: string | undefined;
      if (version === '2') {
        const iface = new Interface([
          {
            inputs: [
              { internalType: 'address', name: '_lpToken', type: 'address' },
              { internalType: 'uint256', name: '_amount', type: 'uint256' },
            ],
            name: 'deposit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '_lpToken', type: 'address' },
            ],
            name: 'withdrawAll',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '_lpToken', type: 'address' },
              { internalType: 'uint256', name: '_amount', type: 'uint256' },
            ],
            name: 'withdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '_lpToken', type: 'address' },
            ],
            name: 'claim',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]);
        if (operateType === 'stake') {
          data = iface.encodeFunctionData('deposit', [
            lpToken.address,
            handleAmount,
          ]);
        } else if (operateType === 'unstake') {
          if (withdrawAll) {
            data = iface.encodeFunctionData('withdrawAll', [lpToken.address]);
          }
          data = iface.encodeFunctionData('withdraw', [
            lpToken.address,
            handleAmount,
          ]);
        } else if (operateType === 'claim') {
          data = iface.encodeFunctionData('claim', [lpToken.address]);
        }
      } else if (version === '3') {
        const iface = new Interface([
          {
            inputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'deposit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'withdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'claimAllRewards',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]);
        if (operateType === 'stake') {
          data = iface.encodeFunctionData('deposit', [handleAmount]);
        } else if (operateType === 'unstake') {
          data = iface.encodeFunctionData('withdraw', [handleAmount]);
        } else if (operateType === 'claim') {
          data = iface.encodeFunctionData('claimAllRewards', []);
        }
      }

      if (!data || !toContractAddress) {
        throw new Error('contract depositOrWithdrawOrClaimMining data is null');
      }

      let value: string | number | undefined = 0;
      if (
        operateType === 'stake' &&
        EtherToken.address.toLowerCase() === lpToken.address.toLowerCase()
      ) {
        value = getEthersValue(handleAmount);
      }
      if (value === undefined) {
        throw new Error('value is undefined');
      }

      const brief =
        operateType === 'stake'
          ? t`Stake`
          : operateType === 'unstake'
            ? t`End mining`
            : t`Claim Rewards`;
      const submitTime = Math.ceil(Date.now() / 1000);
      const result = await submission.execute(
        brief,
        {
          opcode: OpCode.TX,
          data,
          to: toContractAddress,
          value,
        },
        {
          metadata: {
            depositOrWithdrawMining:
              operateType === 'stake' || operateType === 'unstake',
            claimMiningReward: operateType === 'claim',
            [MetadataFlag.stakeMining]: operateType === 'stake',
            [MetadataFlag.unstakeMining]: operateType === 'unstake',
            [MetadataFlag.claimMining]: operateType === 'claim',
            source,
            id,
            operateType,
            submitTime,
            lpTokenAccountStakedBalance:
              lpTokenAccountStakedBalance?.toString(),
            selectedStakeTokenIndex,

            ...metadata,
          },
          submittedBack: submitCallback,
          successBack: () => {
            if (operateType === 'claim') {
              claimSuccessCallback?.();
            }
            if (operateType === 'stake') {
              stakeSuccessCallback?.();
            }
            if (operateType === 'unstake') {
              unstakeSuccessCallback?.();
            }
          },
        },
      );
      return result;
    },
  });

  return {
    depositOrWithdrawOrClaimMutation,
  };
}
