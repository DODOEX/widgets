import { MiningApi } from '@dodoex/api';
import { t } from '@lingui/macro';
import { useMutation } from '@tanstack/react-query';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../hooks/Submission/types';
import { FetchMiningListItem } from '../types';

export const useClaimMiningSubmit = ({
  miningItem,
  successBack,
}: {
  miningItem: FetchMiningListItem;
  successBack?: () => void;
}) => {
  const { account } = useWalletInfo();
  const submission = useSubmission();

  const getParams = async () => {
    if (!account || !miningItem?.miningContractAddress) {
      return null;
    }
    let errorMsg = '';
    const result: any = await MiningApi.encode.claimAllMining(
      miningItem.miningContractAddress,
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
        t`Claim`,
        {
          opcode: OpCode.TX,
          ...params,
        },
        {
          metadata: {
            [MetadataFlag.claimMining]: '1',
          },
          successBack,
        },
      );
      return result;
    },
  });

  return submitMutation;
};
