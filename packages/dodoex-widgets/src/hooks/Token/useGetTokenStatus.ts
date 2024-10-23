import { basicTokenMap, ChainId, contractConfig } from '@dodoex/api';
import { t } from '@lingui/macro';
import { useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React, { useCallback } from 'react';
import { tokenApi } from '../../constants/api';
import { getTokenSymbolDisplay } from '../../utils/token';
import useFetchBlockNumber from '../contract/useFetchBlockNumber';
import { useInflights, useSubmission } from '../Submission';
import { OpCode } from '../Submission/spec';
import { ExecutionResult, MetadataFlag } from '../Submission/types';
import { ApprovalState, BalanceState, TokenInfo } from './type';

export const useGetTokenStatus = ({
  account,
  chainId,
  offset,
  contractAddress,
}: {
  account?: string;
  chainId: number | undefined;
  offset?: BigNumber;
  contractAddress?: string;
}) => {
  const submission = useSubmission();
  const queryClient = useQueryClient();

  const { runningRequests } = useInflights();

  const { updateBlockNumber } = useFetchBlockNumber();

  const contract = React.useMemo(() => {
    return contractAddress ?? contractConfig[chainId as ChainId].DODO_APPROVE;
  }, [chainId, contractAddress]);

  const basicTokenAddress = React.useMemo(
    () => (chainId ? basicTokenMap[chainId as ChainId]?.address : null),
    [chainId],
  );

  const getApprovalState = useCallback(
    (
      token: Pick<TokenInfo, 'address' | 'decimals' | 'symbol'> | null,
      value: string | number | BigNumber,
      balance: BigNumber | null,
      allowance: BigNumber | null,
    ) => {
      if (!token) {
        return ApprovalState.Loading;
      }

      const isApproving = runningRequests.some(
        (k) =>
          k.spec?.opcode === OpCode.Approval &&
          k.spec?.token.address === token?.address &&
          k.spec?.contract === contract,
      );

      const parsed = new BigNumber(value ?? 0);
      if (!account) return ApprovalState.Unchecked;
      if (!balance || parsed.minus(offset ?? 0).gt(balance))
        return ApprovalState.Unchecked;

      if (parsed.isZero()) return ApprovalState.Unchecked;
      const isEth = !!token && token.address === basicTokenAddress;
      if (isEth) return ApprovalState.Sufficient;
      if (isApproving) return ApprovalState.Approving;
      if (!allowance) {
        return ApprovalState.Loading;
      }
      if (parsed.minus(offset ?? 0).gt(allowance))
        return ApprovalState.Insufficient;
      return ApprovalState.Sufficient;
    },
    [account, basicTokenAddress, contract, offset, runningRequests],
  );

  const getPendingRest = useCallback(
    (
      token:
        | Pick<TokenInfo, 'address' | 'decimals' | 'symbol'>
        | null
        | undefined,
      allowance: BigNumber | null,
    ) => {
      const isUSDT =
        token?.symbol === 'USDT' ||
        token?.address.toLowerCase() ===
          '0x6426e6017968377529487E0ef0aA4E7759724e05'.toLowerCase();
      return isUSDT && allowance !== null && allowance.gt(0);
    },
    [],
  );

  const getBalanceState = useCallback(
    (
      parsed: BigNumber,
      token:
        | Pick<TokenInfo, 'address' | 'decimals' | 'symbol'>
        | null
        | undefined,
      balance: BigNumber | null,
    ) => {
      // if ((!checked && !overrideBalance) || !account) return BalanceState.Unchecked;
      if (!account) return BalanceState.Unchecked;
      if (!balance) {
        return BalanceState.Loading;
      }
      if (parsed.minus(offset ?? 0).gt(balance))
        return BalanceState.Insufficient;
      return BalanceState.Sufficient;
    },
    [account, offset],
  );

  const submitApprove = useCallback(
    async (
      token: TokenInfo | null,
      isReset?: boolean,
      submittedBack?: () => void,
      canceledCallback?: () => void,
      successBack?: () => void,
      failedCallback?: () => void,
    ) => {
      if (!contract || !account || !token) return;
      const tokenDisp = getTokenSymbolDisplay(token);
      const amt = isReset ? new BigNumber(0) : undefined;
      const prefix = isReset ? t`Reset` : t`Approve`;

      const result = await submission.execute(
        `${prefix} ${tokenDisp}`,
        {
          opcode: OpCode.Approval,
          token,
          contract,
          amt,
        },
        {
          submittedBack,
          metadata: {
            [isReset ? MetadataFlag.approve : MetadataFlag.approve]: true,
          },
        },
      );

      if (result === ExecutionResult.Canceled) {
        canceledCallback?.();
      }

      if (result === ExecutionResult.Success) {
        if (successBack) {
          successBack();
        }
      }

      if (result === ExecutionResult.Failed) {
        failedCallback?.();
      }

      if (result !== ExecutionResult.Success) {
        return result;
      }

      await updateBlockNumber();
      queryClient.invalidateQueries({
        queryKey: tokenApi.getFetchTokenQuery(
          chainId,
          token?.address,
          account,
          contract,
        ).queryKey,
        refetchType: 'all',
      });
    },
    [account, chainId, contract, queryClient, submission, updateBlockNumber],
  );

  const getMaxBalance = useCallback(
    (token: TokenInfo | null, balance: BigNumber | null) => {
      const defaultVal = new BigNumber(0);
      if (!token || chainId === undefined) return defaultVal;
      if (!balance) return defaultVal;
      let val = balance;
      // const keepChanges = getPlatformGasReserve(chainId);
      // if (ETH_ADDRS.includes(token.address))
      //   val = balance.gt(keepChanges) ? balance.minus(keepChanges) : defaultVal;

      return val;
    },
    [chainId],
  );

  return {
    getApprovalState,
    getPendingRest,
    getBalanceState,
    submitApprove,
    getMaxBalance,
  };
};
