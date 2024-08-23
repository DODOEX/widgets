import contractConfig from '../contract/contractConfig';
import { basicTokenMap, ChainId } from '../../constants/chains';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalanceLoadings } from '../../store/selectors/token';
import { setTokenAllowances } from '../../store/actions/token';
import { AppThunkDispatch } from '../../store/actions';
import { getTokenSymbolDisplay, isETHChain } from '../../utils';
import { BIG_ALLOWANCE } from '../../constants/token';
import useGetAllowance from './useGetAllowance';
import useGetBalance from './useGetBalance';
import { TokenInfo, ApprovalState } from './type';
import { ExecutionResult, State } from '../Submission/types';
import { OpCode } from '../Submission/spec';
import useInflights from '../Submission/useInflights';
import { useSubmission } from '../Submission';
import { getDefaultChainId } from '../../store/selectors/wallet';
import { useFetchTokenAllowance } from './useFetchTokenAllowance';

export const useGetTokenStatus = ({
  account,
  chainId,
  offset,
  contractAddress,
  skip,
}: {
  account?: string;
  chainId: number | undefined;
  offset?: BigNumber;
  contractAddress?: string;
  skip?: boolean;
}) => {
  const defaultChainId = useSelector(getDefaultChainId);
  const currentContractConfig = useMemo(
    () => contractConfig[(chainId as ChainId) ?? defaultChainId],
    [chainId],
  );
  const { isETH } = useMemo(() => isETHChain(chainId), [chainId]);
  const { DODO_APPROVE: dodoApproveAddress } = currentContractConfig || {};
  const contract = contractAddress ?? dodoApproveAddress ?? null;
  const getAllowance = useGetAllowance(contract);
  const [fetchAllowanceToken, setFetchAllowanceToken] =
    useState<TokenInfo | undefined>();
  const { allowance: otherContractAllowance } = useFetchTokenAllowance({
    chainId,
    account,
    token: fetchAllowanceToken,
    proxyContractAddress: contract,
  });
  const getBalance = useGetBalance();
  const { runningRequests } = useInflights();
  const balanceLoadings = useSelector(getBalanceLoadings);
  const basicTokenAddress = useMemo(
    () => basicTokenMap[(chainId ?? defaultChainId) as ChainId]?.address,
    [chainId],
  );

  const getApprovalState = useCallback(
    (
      token: TokenInfo | null,
      value: string | number | BigNumber,
      overrideBalance?: BigNumber,
    ) => {
      if (!token) {
        return ApprovalState.Loading;
      }
      if (skip) return ApprovalState.Sufficient;
      const isApproving = !!runningRequests?.find(
        (k) =>
          k.spec.opcode === OpCode.Approval &&
          k.spec.token.address === token?.address,
      );
      const balance = overrideBalance ?? (token ? getBalance(token) : null);
      let allowance = token ? getAllowance(token) : null;

      const parsed = new BigNumber(value ?? 0);
      if (!account) return ApprovalState.Unchecked;
      if (!balance || parsed.minus(offset ?? 0).gt(balance))
        return ApprovalState.Unchecked;

      if (parsed.isZero()) return ApprovalState.Unchecked;
      const isBasicToken = token.address === basicTokenAddress;
      if (isBasicToken) return ApprovalState.Sufficient;
      if (isApproving) return ApprovalState.Approving;
      if (
        fetchAllowanceToken?.address === token.address &&
        otherContractAllowance
      ) {
        allowance = otherContractAllowance;
      }
      if (!allowance) {
        if (
          contract !== dodoApproveAddress &&
          (!fetchAllowanceToken ||
            fetchAllowanceToken.address !== token.address)
        ) {
          setFetchAllowanceToken(token);
        }
        return ApprovalState.Loading;
      }
      if (allowance && parsed.minus(offset ?? 0).gt(allowance))
        return ApprovalState.Insufficient;
      return ApprovalState.Sufficient;
    },
    [
      getBalance,
      getAllowance,
      account,
      offset,
      contract,
      chainId,
      balanceLoadings,
      runningRequests,
      basicTokenAddress,
      fetchAllowanceToken,
      otherContractAllowance?.toString(),
      skip,
    ],
  );

  const getPendingRest = useCallback(
    (token?: TokenInfo | null) => {
      const allowance = token ? getAllowance(token) : null;
      const isUSDT =
        token?.symbol === 'USDT' ||
        token?.address.toLowerCase() ===
          '0x6426e6017968377529487E0ef0aA4E7759724e05'.toLowerCase();
      return isUSDT && allowance !== null && allowance.gt(0);
    },
    [getAllowance],
  );

  const submission = useSubmission();
  const dispatch = useDispatch<AppThunkDispatch>();
  const submitApprove = useCallback(
    async (token: TokenInfo | null, isReset?: boolean) => {
      if (!contract || !account || !token) return;
      const tokenDisp = getTokenSymbolDisplay(token);
      const amt = isReset ? new BigNumber(0) : undefined;
      const prefix = isReset ? t`Reset` : t`Approve`;
      const result = await submission.execute(`${prefix} ${tokenDisp}`, {
        opcode: OpCode.Approval,
        token,
        contract,
        amt,
      });

      if (result !== ExecutionResult.Success) return;

      dispatch(setTokenAllowances(amt ?? BIG_ALLOWANCE));
    },
    [contract, account, chainId, submission, dispatch],
  );

  const getMaxBalance = useCallback(
    (token: TokenInfo | null) => {
      const defaultVal = new BigNumber(0);
      if (!token) return defaultVal.toString(); // Use toString instead of toNumber to avoid missing decimals!
      const balance = getBalance(token);
      if (!balance) return defaultVal.toString();
      let val = balance;
      // const keepChanges = isETH ? 0.1 : 0.02;
      // const isBasicToken = basicTokenAddress === token?.address;
      // if (isBasicToken)
      //   val = balance.gt(keepChanges) ? balance.minus(keepChanges) : defaultVal;

      return val.toString();
    },
    [chainId, getBalance, isETH],
  );

  return {
    getApprovalState,
    getPendingRest,
    getMaxBalance,
    submitApprove,
  };
};
