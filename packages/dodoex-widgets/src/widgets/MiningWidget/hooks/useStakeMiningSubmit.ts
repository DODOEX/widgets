import { basicTokenMap, ChainId, MiningApi } from '@dodoex/api';
import { t } from '@lingui/macro';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../hooks/Submission/types';
import { BalanceData } from '../../../hooks/Submission/useBalanceUpdateLoading';
import { getEthersValue } from '../../../utils/bytes';
import { FetchMiningListItem } from '../types';

export const useStakeMiningSubmit = ({
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
  const { chainId, account } = useWalletInfo();
  const submission = useSubmission();

  const EtherToken = basicTokenMap[chainId as ChainId];

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
    const result: any = await MiningApi.encode.depositMining(
      miningItem.miningContractAddress,
      amountBg,
      decimals,
    );

    if (result && result.data) {
      try {
        if (
          amount &&
          miningItem.baseLpToken?.address?.toLocaleLowerCase() ===
            EtherToken.address.toLocaleLowerCase()
        ) {
          result.value = getEthersValue(amountBg);
        } else {
          result.value = 0;
        }

        return result;
      } catch (error) {
        console.error('2.0 sendTransaction error', error);
        errorMsg = `2.0 sendTransaction error; ERROR: ${error}`;
        throw new Error(errorMsg);
      }
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
        t`Stake`,
        {
          opcode: OpCode.TX,
          ...params,
        },
        {
          metadata: {
            [MetadataFlag.stakeMining]: '1',
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
