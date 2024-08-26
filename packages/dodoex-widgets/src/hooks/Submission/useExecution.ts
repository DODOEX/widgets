import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import type { TransactionResponse } from '@ethersproject/abstract-provider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { basicTokenMap, ChainId } from '../../constants/chains';
import { useFetchBlockNumber } from '../contract';
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
import { useWalletState } from '../ConnectWallet/useWalletState';

export interface ExecutionProps {
  onTxFail?: (error: Error, data: any) => void;
  onTxSubmit?: (tx: string, data: any) => void;
  onTxSuccess?: (tx: string, data: any) => void;
  executionStatus?: {
    showing?: Showing | null;
    showingDone?: boolean;
    transactionTx?: string;
    errorMessage?: string;
    setErrorMessage?: (msg?: string | null) => void;
    closeShowing?: () => void;
  };
}

export default function useExecution({
  onTxFail,
  onTxSubmit,
  onTxSuccess,
}: ExecutionProps = {}) {
  const { account, provider } = useWalletState();
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
  const { updateBlockNumber } = useFetchBlockNumber();

  const handler = useCallback(
    async (
      brief: string,
      spec: StepSpec,
      subtitle?: string | React.ReactNode | null,
      early = false,
      submittedBack?: () => void,
      mixpanelProps?: Record<string, any>,
      submittedConfirmBack?: () => void,
      successBack?: (
        tx: string,
        callback?: ExecutionProps['onTxSuccess'],
      ) => void,
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
      dispatch(
        setGlobalProps({
          contractStatus: ContractStatus.Pending,
        }),
      );
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
          if (reportInfo.opcode === 'TX') {
            dispatch(
              setGlobalProps({
                contractStatus: ContractStatus.TxSuccess,
              }),
            );
          }
          if (reportInfo.opcode === 'APPROVAL') {
            dispatch(
              setGlobalProps({
                contractStatus: ContractStatus.ApproveSuccess,
              }),
            );
          }

          if (successBack) {
            successBack(tx, onTxSuccess);
          }
          if (onTxSuccess) {
            onTxSuccess(tx, reportInfo);
          }
          await updateBlockNumber(); // update blockNumber once after tx
          setRequests((res) => res.set(tx as string, [request, State.Success]));
          return ExecutionResult.Success;
        }
      }
      await updateBlockNumber(); // update blockNumber once after tx
      setShowingDone(true);
      setRequests((res) => res.set(tx as string, [request, State.Failed]));
      return ExecutionResult.Failed;
    },
    [account, chainId, setWaitingSubmit, provider, updateBlockNumber],
  );

  const handlerCustom = useCallback(
    async ({
      brief,
      subtitle,
      early,
      mixpanelProps,
      submittedBack,
      submittedConfirmBack,
      successBack,
      handler,
    }: {
      brief: string;
      subtitle?: string | React.ReactNode | null;
      early?: boolean;
      mixpanelProps?: Record<string, any>;
      submittedBack?: () => void;
      submittedConfirmBack?: () => void;
      successBack?: (
        tx: string,
        callback?: ExecutionProps['onTxSuccess'],
      ) => void;
      handler: (params: {
        onSubmit?: (tx: string, reportInfo?: Record<string, any>) => void;
        onSuccess?: (
          tx: string,
          reportInfo?: Record<string, any>,
        ) => Promise<void>;
        onError?: (e: any) => void;
      }) => Promise<any>;
    }) => {
      setSubmittedConfirmBack(() => submittedConfirmBack);
      setTransactionTx('');
      setErrorMessage('');
      setWaitingSubmit(false);
      const reportInfo = {
        brief,
        subtitle,
        ...mixpanelProps,
      };

      return new Promise<ExecutionResult>(async (resolve) => {
        const spec = {
          opcode: OpCode.TX,
          value: '',
          to: '',
          data: '',
        } as StepSpec;

        const onSubmit = (
          tx: string,
          reportInfoProps?: Record<string, any>,
        ) => {
          setTransactionTx(tx);
          setShowing({ spec, brief, subtitle });
          setShowingDone(false);
          setWaitingSubmit(false);
          dispatch(
            setGlobalProps({
              contractStatus: ContractStatus.Pending,
            }),
          );
          if (onTxSubmit) {
            onTxSubmit(tx, {
              tx,
              ...reportInfo,
              ...reportInfoProps,
            });
          }
          if (submittedBack) {
            submittedBack();
          }
          if (early) {
            resolve(ExecutionResult.Submitted);
            return;
          }
        };

        const onSuccess = async (
          tx: string,
          reportInfoProps?: Record<string, any>,
        ) => {
          setTransactionTx(tx);
          dispatch(
            setGlobalProps({
              contractStatus: ContractStatus.TxSuccess,
            }),
          );
          if (successBack) {
            successBack(tx, onTxSuccess);
          }
          if (onTxSuccess) {
            onTxSuccess(tx, {
              tx,
              ...reportInfo,
              ...reportInfoProps,
            });
          }
          await updateBlockNumber(); // update blockNumber once after tx
          setShowingDone(true);
        };

        const onError = (e: any) => {
          setWaitingSubmit(false);
          setShowing({
            spec,
            brief,
            subtitle,
          });
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
          resolve(ExecutionResult.Failed);
        };
        try {
          setWaitingSubmit(true);
          await handler({
            onSubmit,
            onSuccess,
            onError,
          });
        } catch (e: any) {
          onError(e);
          return;
        }
      });
    },
    [chainId, setWaitingSubmit, updateBlockNumber],
  );

  const ctxVal = useMemo(
    () => ({
      execute: handler,
      executeCustom: handlerCustom,
      requests,
      setShowing,
      waitingSubmit,
    }),
    [handler, handlerCustom, requests, setShowing],
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
