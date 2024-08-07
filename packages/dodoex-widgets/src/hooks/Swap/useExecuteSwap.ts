import { t } from '@lingui/macro';
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo } from 'react';
import { basicTokenMap, ChainId } from '../../constants/chains';
import { getSwapTxValue } from '../../utils';
import { MIN_GAS_LIMIT } from '../../constants/swap';
import { useSubmission } from '../Submission';
import { OpCode } from '../Submission/spec';
import { useWalletState } from '../ConnectWallet/useWalletState';

export default function useExecuteSwap() {
  const { chainId, account } = useWalletState();
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
        subtitle,
      );
    },
    [account, chainId],
  );

  return execute;
}
