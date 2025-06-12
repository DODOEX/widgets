import { basicTokenMap, ChainId, contractConfig } from '@dodoex/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';
import { tokenApi } from '../../constants/api';
import { getTokenSymbolDisplay } from '../../utils/token';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import useFetchBlockNumber from '../contract/useFetchBlockNumber';
import { useInflights, useSubmission } from '../Submission';
import { OpCode } from '../Submission/spec';
import { ExecutionResult, MetadataFlag } from '../Submission/types';
import { ApprovalState, TokenInfo } from './type';

function getPendingRest(
  token: TokenInfo | undefined | null,
  allowance: BigNumber | undefined,
) {
  const isUSDT =
    token?.symbol === 'USDT' ||
    token?.address?.toLowerCase() ===
      '0x6426e6017968377529487E0ef0aA4E7759724e05'.toLowerCase();
  return isUSDT && allowance && allowance.gt(0);
}

export function useTokenStatus(
  token: TokenInfo | undefined | null,
  {
    amount,
    contractAddress,
    offset,
    overrideBalance,
    skipQuery,
  }: {
    amount?: string | number | BigNumber;
    contractAddress?: string;
    offset?: BigNumber;
    overrideBalance?: BigNumber | null;
    skipQuery?: boolean;
  } = {},
) {
  const { getAppKitAccountByChainId } = useWalletInfo();
  const account = getAppKitAccountByChainId(token?.chainId)?.appKitAccount
    .address;

  const [chainId, proxyContractAddress] = React.useMemo(() => {
    if (!token) return [undefined, contractAddress];
    return [
      token.chainId,
      contractAddress ?? contractConfig[token.chainId as ChainId].DODO_APPROVE,
    ];
  }, [token, contractAddress]) as [number | undefined, string | undefined];

  const queryClient = useQueryClient();
  const tokenQuery = useQuery({
    ...tokenApi.getFetchTokenQuery(
      // skip the query
      skipQuery ? undefined : chainId,
      token?.address,
      account,
      proxyContractAddress,
    ),
    refetchInterval: chainId === ChainId.NEOX ? 3000 : undefined,
  });
  const { runningRequests } = useInflights();
  const { updateBlockNumber } = useFetchBlockNumber();
  const { i18n } = useLingui();
  const basicTokenAddress = React.useMemo(
    () => (chainId ? basicTokenMap[chainId as ChainId]?.address : null),
    [chainId],
  );

  const getApprovalState = React.useCallback(() => {
    if (!token) {
      return ApprovalState.Loading;
    }
    const isApproving = runningRequests.some(
      (k) =>
        k.spec?.opcode === OpCode.Approval &&
        k.spec?.token.address === token?.address &&
        k.spec?.contract === proxyContractAddress,
    );
    const balance = overrideBalance ?? tokenQuery.data?.balance;
    const allowance = tokenQuery.data?.allowance;

    const parsed = new BigNumber(amount || 0);
    if (!account) return ApprovalState.Unchecked;
    if (!balance || parsed.minus(offset ?? 0).gt(balance))
      return ApprovalState.Unchecked;

    if (parsed.isZero()) return ApprovalState.Unchecked;
    const isBasicToken = token.address === basicTokenAddress;
    if (isBasicToken) return ApprovalState.Sufficient;
    if (isApproving) return ApprovalState.Approving;
    if (!allowance) {
      return ApprovalState.Loading;
    }
    if (parsed.minus(offset ?? 0).gt(allowance))
      return ApprovalState.Insufficient;
    return ApprovalState.Sufficient;
  }, [
    runningRequests,
    account,
    offset,
    basicTokenAddress,
    tokenQuery.data,
    token,
    overrideBalance,
    amount,
    proxyContractAddress,
  ]);

  const { isApproving, isGetApproveLoading, needApprove, needReset } =
    React.useMemo(() => {
      const approvalState = getApprovalState();
      const pendingReset = getPendingRest(token, tokenQuery.data?.allowance);
      return {
        isApproving: approvalState === ApprovalState.Approving,
        isGetApproveLoading:
          approvalState === ApprovalState.Loading || tokenQuery.isLoading,
        needApprove:
          approvalState === ApprovalState.Insufficient && !pendingReset,
        needReset: approvalState === ApprovalState.Insufficient && pendingReset,
      };
    }, [
      getApprovalState,
      token,
      tokenQuery.data?.allowance,
      tokenQuery.isLoading,
    ]);

  const submission = useSubmission();

  const approveTitle = React.useMemo(() => {
    if (!token) return '';
    const prefix = needReset ? t`Reset` : t`Approve`;
    return `${prefix} ${getTokenSymbolDisplay(token)}`;
  }, [token, needReset, i18n._]);

  const submitApproveMutation = useMutation({
    mutationFn: async () => {
      if (!proxyContractAddress || !account || !token) {
        return;
      }
      const amt = needReset ? new BigNumber(0) : undefined;
      const result = await submission.execute(
        approveTitle,
        {
          opcode: OpCode.Approval,
          token,
          contract: proxyContractAddress,
          amt,
        },
        {
          metadata: {
            [needReset ? MetadataFlag.approve : MetadataFlag.approve]: true,
          },
        },
      );

      if (result !== ExecutionResult.Success) {
        return;
      }
      await updateBlockNumber();
      queryClient.invalidateQueries({
        queryKey: tokenApi.getFetchTokenQuery(
          chainId,
          token?.address,
          account,
          proxyContractAddress,
        ).queryKey,
        refetchType: 'all',
      });
    },
  });

  const submitApprove = React.useCallback(async () => {
    submitApproveMutation.mutate();
  }, [submitApproveMutation]);

  const getMaxBalance = React.useCallback(() => {
    const defaultVal = new BigNumber(0);
    if (!token) return defaultVal.toString(); // Use toString instead of toNumber to avoid missing decimals!
    const balance = overrideBalance ?? tokenQuery.data?.balance;
    if (!balance) return defaultVal.toString();
    let val = balance;
    // const keepChanges = isETH ? 0.1 : 0.02;
    // const isBasicToken = basicTokenAddress === token?.address;
    // if (isBasicToken)
    //   val = balance.gt(keepChanges) ? balance.minus(keepChanges) : defaultVal;

    return val.toString();
  }, [chainId, tokenQuery.data?.balance, overrideBalance, token]);

  const insufficientBalance = React.useMemo(() => {
    if (!amount) return false;
    const balance =
      overrideBalance ?? tokenQuery.data?.balance ?? new BigNumber(0);
    return balance.lt(amount);
  }, [tokenQuery.data?.balance, overrideBalance, amount]);

  const isApprovingOrApproveMutationPending =
    isApproving || submitApproveMutation.isPending;
  return {
    token,
    isApproving: isApprovingOrApproveMutationPending,
    isGetApproveLoading,
    needApprove,
    needReset,
    needShowTokenStatusButton:
      needApprove ||
      needReset ||
      isApprovingOrApproveMutationPending ||
      insufficientBalance,
    insufficientBalance,
    loading: tokenQuery.isLoading,
    approveTitle,
    submitApprove,
    getMaxBalance,
  };
}
