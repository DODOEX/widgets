import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import { t } from '@lingui/macro';
import React, { useCallback } from 'react';
import { MIN_GAS_LIMIT } from '../../constants/swap';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useSubmission } from '../Submission';
import { OpCode } from '../Submission/spec';
import { MetadataFlag } from '../Submission/types';

export default function useExecuteSwap() {
  const { account, chainId } = useWalletInfo();
  const submission = useSubmission();

  const execute = useCallback(
    ({
      to,
      data,
      useSource,
      duration,
      ddl,
      gasLimit,
      subtitle,
      value,
      mixpanelProps,
    }: {
      value: string;
      to: string;
      data: string;
      useSource?: string;
      duration?: number;
      ddl: number;
      gasLimit?: EthersBigNumber;
      subtitle: React.ReactNode;
      mixpanelProps?: Record<string, any>;
    }) => {
      const ddlSecRel = ddl * 60;
      const txValue = value;
      if (useSource && useSource.toLowerCase() !== 'weth') {
        if (gasLimit && gasLimit.lt(MIN_GAS_LIMIT)) {
          console.debug('Warning: GasLimit less than the minimum!');
        }
      }

      const params = {
        from: account,
        to,
        data,
        value: txValue,
        route: useSource,
        duration,
        ddlSecRel,
        gasLimit,
      };

      submission.execute(
        t`Swap`,
        {
          opcode: OpCode.TX,
          ...params,
        },
        {
          subtitle,
          metadata: {
            [MetadataFlag.swap]: true,
          },
          mixpanelProps,
        },
      );
    },
    [account, submission],
  );

  return execute;
}
