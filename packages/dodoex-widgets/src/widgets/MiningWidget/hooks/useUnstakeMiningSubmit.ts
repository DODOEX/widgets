import { MiningApi } from '@dodoex/api';
import { t } from '@lingui/macro';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../hooks/Submission/types';
import { BalanceData } from '../../../hooks/Submission/useBalanceUpdateLoading';
import { FetchMiningListItem } from '../types';

export const useUnstakeMiningSubmit = ({
  miningItem,
  amount,
  submittedBack,
  successBack,
  logBalance,
}: {
  miningItem: FetchMiningListItem;
  amount: string;
  submittedBack?: () => void;
  successBack?: () => void;
  logBalance?: BalanceData;
}) => {
  const { account } = useWalletInfo();
  const submission = useSubmission();

  const getParams = async () => {
    if (
      !account ||
      !miningItem ||
      !miningItem.baseToken ||
      !miningItem.miningContractAddress
    ) {
      return null;
    }
    let errorMsg = '';
    const amountBg = new BigNumber(amount);
    const decimals = Number(miningItem.baseToken.decimals);
    const result: any = await MiningApi.encode.withdrawMining(
      miningItem.miningContractAddress,
      amountBg,
      decimals,
    );

    if (result && result.data) {
      result.value = 0;
      return result;
    } else {
      errorMsg = 'invalid data';
      throw new Error(errorMsg);
    }
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      const params = await getParams();
      if (!params) {
        return;
      }

      const result = await submission.execute(
        t`Unstake`,
        {
          opcode: OpCode.TX,
          ...params,
        },
        {
          metadata: {
            [MetadataFlag.unstakeMining]: '1',
            logBalance,
          },
          submittedBack,
          successBack,
        },
      );
      return result;
    },
  });

  return submitMutation;
};
