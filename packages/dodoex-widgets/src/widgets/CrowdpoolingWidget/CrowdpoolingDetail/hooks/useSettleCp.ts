import { t } from '@lingui/macro';
import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { useMessageState } from '../../../../hooks/useMessageState';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { encodeCPSettle } from '@dodoex/dodo-contract-request';

interface Props {
  address: string | undefined;
  successBack?: () => void;
  submittedBack?: () => void;
}

export function useSettleCp({ address, successBack, submittedBack }: Props) {
  const submission = useSubmission();

  return useMutation({
    mutationFn: async () => {
      if (!address) {
        throw new Error('address is undefined');
      }

      const to = address;

      const data = encodeCPSettle();

      try {
        await submission.execute(
          t`Crowdpooling Settlement`,
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
              [MetadataFlag.settleCrowdpooling]: true,
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
