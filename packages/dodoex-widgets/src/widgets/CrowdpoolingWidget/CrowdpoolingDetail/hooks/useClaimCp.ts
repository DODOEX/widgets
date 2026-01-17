import { t } from '@lingui/macro';
import { encodeCPBidderClaim } from '@dodoex/dodo-contract-request';
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

export function useClaimCp({ detail, successBack, submittedBack }: Props) {
  const submission = useSubmission();
  const { account } = useWalletInfo();

  return useMutation({
    mutationFn: async () => {
      if (!detail) {
        throw new Error('detail is undefined');
      }

      const to = detail.id;
      const isUnWrap = false;

      const data = encodeCPBidderClaim(account!, isUnWrap ? '0x00' : '0x');

      try {
        await submission.execute(
          t`Claim`,
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
              [MetadataFlag.claimCrowdpooling]: true,
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
