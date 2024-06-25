import { t } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo } from 'react';
import { basicTokenMap } from '../../constants/chains';
import { ChainId } from '@dodoex/api';
import { getSwapTxValue } from '../../utils';
import { MIN_GAS_LIMIT } from '../../constants/swap';
import { useSubmission } from '../Submission';
import { OpCode } from '../Submission/spec';

export default function useExecuteSwap() {
  const { chainId, account } = useWeb3React();
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
    }: {
      value: string;
      to: string;
      data: string;
      useSource?: string;
      duration?: number;
      ddl: number;
      gasLimit?: EthersBigNumber;
      subtitle: React.ReactNode;
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
        },
      );
    },
    [account, chainId],
  );

  return execute;
}
