import { t } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import type { TransactionResponse } from '@ethersproject/abstract-provider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { basicTokenMap, ChainId } from '../../constants/chains';
import { approve, getEstimateGas, sendTransaction } from '../contract/wallet';
import getExecutionErrorMsg from './getExecutionErrorMsg';
import { OpCode, Step as StepSpec } from './spec';
import { ExecutionResult, State, Request, WatchResult, Showing } from './types';
import { BIG_ALLOWANCE } from '../../constants/token';
import { useCurrentChainId } from '../ConnectWallet';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalProps } from '../../store/actions/globals';
import { ContractStatus } from '../../store/reducers/globals';
import { AppThunkDispatch } from '../../store/actions';

export interface ExecutionProps {
  onTxFail?: (error: Error, data: any) => void;
  onTxSubmit?: (tx: string, data: any) => void;
  onTxSuccess?: (tx: string, data: any) => void;
}

export default function useExecution({
  onTxFail,
  onTxSubmit,
  onTxSuccess,
}: ExecutionProps = {}) {
  const { account, provider } = useWeb3React();
  const chainId = useCurrentChainId();
  const [waitingSubmit, setWaitingSubmit] = useState(false);
  const [requests, setRequests] = useState<Map<string, [Request, State]>>(
    new Map(),
  );
  const dispatch = useDispatch<AppThunkDispatch>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dialog status
  const [transactionTx, setTransactionTx] = useState('');
  const [showing, setShowing] = useState<Showing | null>(null);
  const [showingDone, setShowingDone] = useState(false);
  const [submittedConfirmBack, setSubmittedConfirmBack] =
    useState<() => void>();

  const handler = useCallback(
    async (
      brief: string,
      spec: StepSpec,
      subtitle?: string | React.ReactNode | null,
      early = false,
      submittedBack?: () => void,
      mixpanelProps?: Record<string, any>,
      submittedConfirmBack?: () => void,
      successBack?: (tx: string) => void,
    ) => {
      setTransactionTx('');
      setErrorMessage('');
      if (!account || !provider)
        throw new Error(
          'Submission: Cannot execute step when the wallet is disconnected',
        );
      setSubmittedConfirmBack(() => submittedConfirmBack);
      let tx: string | undefined;
      let params: any;
      let transaction: TransactionResponse | undefined;
      setWaitingSubmit(false);
      try {
        setWaitingSubmit(true);
        if (spec.opcode === OpCode.Approval) {
          transaction = await approve(
            spec.token.address,
            account,
            spec.contract,
            spec.amt || BIG_ALLOWANCE,
            provider,
            account,
          );
          tx = transaction.hash;
          setTransactionTx(tx);
        } else if (spec.opcode === OpCode.TX) {
          // Sanity check
          if (spec.to === '') throw new Error('Submission: malformed to');
          if (spec.data.length === 0)
            throw new Error('Submission: malformed data');
          if (spec.data.indexOf('0x') === 0 && spec.data.length <= 2)
            throw new Error('Submission: malformed data');
          // private swap need
          // nonce = await web3.eth.getTransactionCount(account);
          params = {
            value: spec.value,
            data: spec.data,
            to: spec.to,
            gasLimit: spec.gasLimit,
            from: account,
            chainId,
          };

          if (!params.gasLimit) {
            try {
              const gasLimit = await getEstimateGas(params, provider);
              if (gasLimit) {
                params.gasLimit = gasLimit;
              }
            } catch (error) {
              console.debug(error);
            }
          }

          transaction = await sendTransaction(params, provider);
          tx = transaction.hash;
          setTransactionTx(tx);
          if (!tx) throw new Error(`Unexpected tx: ${tx}`);
        } else {
          throw new Error(`Op ${spec.opcode} not implemented!`);
        }
      } catch (e: any) {
        setWaitingSubmit(false);
        setShowing({ spec, brief, subtitle });
        console.error(e);
        if (e.message) {
          dispatch(
            setGlobalProps({
              contractStatus: ContractStatus.Failed,
            }),
          );
          const options = { error: e.message, brief };
          if (mixpanelProps) Object.assign(options, mixpanelProps);
          if (onTxFail) {
            onTxFail(e, mixpanelProps);
          }

          setErrorMessage(getExecutionErrorMsg(chainId, e.message));
        }
        return ExecutionResult.Failed;
      }
      setShowing({ spec, brief, subtitle });
      setShowingDone(false);
      setWaitingSubmit(false);

      const reportInfo = {
        brief,
        ...spec,
        ...params,
        tx,
        subtitle,
        ...mixpanelProps,
      };
      setGlobalProps({
        contractStatus: ContractStatus.Pending,
      });
      if (onTxSubmit) {
        onTxSubmit(tx, reportInfo);
      }
      if (submittedBack) {
        submittedBack();
      }

      const request: Request = {
        brief,
        spec,
        tx,
        subtitle,
      };

      setRequests((res) => res.set(tx as string, [request, State.Running]));

      if (early) {
        return ExecutionResult.Submitted;
      }
      if (submittedBack) {
        submittedBack();
      }

      if (transaction?.wait) {
        const receipt = await transaction.wait(1);
        setShowingDone(true);
        if (receipt.status === WatchResult.Success) {

          // TODO: Differ TxSuccess and ApproveSuccess based on data.brief
          setGlobalProps({
            contractStatus: ContractStatus.TxSuccess,
          });

          if (successBack) {
            successBack(tx);
          }
          if (onTxSuccess) {
            onTxSuccess(tx, reportInfo);
          }
          setRequests((res) => res.set(tx as string, [request, State.Success]));
          return ExecutionResult.Success;
        }
      }
      setShowingDone(true);
      setRequests((res) => res.set(tx as string, [request, State.Failed]));
      return ExecutionResult.Failed;
    },
    [account, chainId, setWaitingSubmit, provider],
  );

  const ctxVal = useMemo(
    () => ({
      execute: handler,
      requests,
      setShowing,
      waitingSubmit,
    }),
    [handler, requests, setShowing],
  );

  const closeShowing = useCallback(() => {
    setShowing(null);
    if (submittedConfirmBack) {
      submittedConfirmBack();
      setSubmittedConfirmBack(undefined);
    }
  }, [submittedConfirmBack]);

  return {
    showing,
    showingDone,
    transactionTx,
    errorMessage,
    setErrorMessage,
    closeShowing,
    ctxVal,
    requests,
  };
}
