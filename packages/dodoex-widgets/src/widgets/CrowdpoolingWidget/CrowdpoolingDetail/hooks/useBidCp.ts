import { t } from '@lingui/macro';
import {
  encodeDODOCpProxyBid,
  getDODOCpProxyContractAddressByChainId,
  getDODOCpProxyWithoutGlobalQuotaContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { basicTokenMap, ChainId } from '@dodoex/api';
import { useMessageState } from '../../../../hooks/useMessageState';
import { CPDetail } from '../../types';
import { TokenInfo } from '../../../../hooks/Token';
import { MetadataFlag } from '../../../../hooks/Submission/types';

interface UseBidCpProps {
  quoteAmount: string;
  qtToken: TokenInfo | undefined | null;
  detail: CPDetail | undefined;
  successBack?: () => void;
  submittedBack?: () => void;
}

export function useBidCp({
  quoteAmount,
  qtToken,
  detail,
  successBack,
  submittedBack,
}: UseBidCpProps) {
  const submission = useSubmission();

  return useMutation({
    mutationFn: async () => {
      if (!quoteAmount || new BigNumber(quoteAmount).lte(0)) {
        throw new Error('Amount must be greater than 0');
      }
      if (!detail || !qtToken) {
        throw new Error('detail is undefined');
      }
      const { chainId } = detail;

      const quoteAmountBg = new BigNumber(quoteAmount)
        .dp(qtToken.decimals, BigNumber.ROUND_DOWN)
        .times(10 ** qtToken.decimals);
      const quoteAmountStr = quoteAmountBg.toString();
      const basicToken = basicTokenMap[chainId as ChainId];
      const isBasic =
        qtToken.address.toLowerCase() === basicToken.address.toLowerCase();

      const flag = isBasic ? 1 : 0;

      let to = getDODOCpProxyContractAddressByChainId(chainId);
      if (!to) {
        to = getDODOCpProxyWithoutGlobalQuotaContractAddressByChainId(chainId);
      }
      if (!to) {
        throw new Error('Contract address not found');
      }

      const data = encodeDODOCpProxyBid(
        detail.id,
        quoteAmountStr,
        flag,
        detail.bidEndTime,
      );

      let value = '0';
      if (isBasic) {
        value = quoteAmountStr;
      }

      try {
        await submission.execute(
          t`Add to pool`,
          {
            opcode: OpCode.TX,
            to,
            data,
            value,
          },
          {
            submittedBack,
            successBack,
            metadata: {
              [MetadataFlag.bidCrowdpooling]: true,
            },
          },
        );

        return true;
      } catch (error) {
        useMessageState.getState().toast({
          message: `${error}`,
          type: 'error',
        });
        throw error;
      }
    },
  });
}
