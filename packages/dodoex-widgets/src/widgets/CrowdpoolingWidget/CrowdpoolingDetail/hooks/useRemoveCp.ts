import { t } from '@lingui/macro';
import {
  encodeCPBidderClaim,
  encodeCPCancel,
} from '@dodoex/dodo-contract-request';
import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { useMessageState } from '../../../../hooks/useMessageState';
import { CPDetail } from '../../types';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';

interface Props {
  detail: CPDetail | undefined;
  successBack?: () => void;
  submittedBack?: () => void;
}

export function useRemoveCp({ detail, successBack, submittedBack }: Props) {
  const submission = useSubmission();
  const { account } = useWalletInfo();

  return useMutation({
    mutationFn: async ({
      sharesAmountParseUnit,
      isUnWrap,
    }: {
      sharesAmountParseUnit: string;
      isUnWrap: boolean;
    }) => {
      if (!detail) {
        throw new Error('detail is undefined');
      }

      const to = detail.id;

      const data = encodeCPCancel(
        account!,
        sharesAmountParseUnit,
        isUnWrap ? '0x00' : '0x',
      );

      try {
        await submission.execute(
          t`Remove from pool`,
          {
            opcode: OpCode.TX,
            to,
            data,
            value: 0,
          },
          {
            submittedBack,
            successBack,
            metadata: {
              [MetadataFlag.removeCrowdpooling]: true,
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
