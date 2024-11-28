import { ChainId, CONTRACT_QUERY_KEY } from '@dodoex/api';
import { useWeb3React } from '@web3-react/core';
import type { TransactionResponse } from '@ethersproject/abstract-provider';
import { useCallback, useMemo, useState } from 'react';
import { useFetchBlockNumber } from '../contract';
import { approve, getEstimateGas, sendTransaction } from '../contract/wallet';
import getExecutionErrorMsg from './getExecutionErrorMsg';
import { OpCode, Step as StepSpec } from './spec';
import {
  ExecutionResult,
  State,
  Request,
  WatchResult,
  Showing,
  ExecutionCtx,
  TextUpdater,
  ExecuteCustomHandlerParameters,
} from './types';
import { BIG_ALLOWANCE } from '../../constants/token';
import { useCurrentChainId } from '../ConnectWallet';
import { useDispatch } from 'react-redux';
import { setContractStatus } from '../../store/actions/globals';
import { ContractStatus } from '../../store/reducers/globals';
import { AppThunkDispatch } from '../../store/actions';
import { useQueryClient } from '@tanstack/react-query';

export interface ExecutionProps {
  onTxFail?: (error: Error, data: any) => void;
  onTxSubmit?: (tx: string, data: any) => void;
  onTxSuccess?: (tx: string, data: any) => void;
  onTxReverted?: (tx: string, data: any) => void;
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
  onTxReverted,
}: ExecutionProps = {}) {
  const { account, provider } = useWeb3React();
  const queryClient = useQueryClient();
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
      options?: Parameters<ExecutionCtx['execute']>[2],
    ) => {
      const {
        subtitle,
        early,
        submittedBack,
        mixpanelProps,
        submittedConfirmBack,
        successBack,
        metadata,
      } = options ?? {};
      setTransactionTx('');
      setErrorMessage('');
      if (!account || !provider)
        throw new Error(
          'Submission: Cannot execute step when the wallet is disconnected',
        );
      setSubmittedConfirmBack(() => submittedConfirmBack);
      let tx: string | undefined;
      let params: any;
      let nonce: number | undefined;
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
          );
          tx = transaction.hash;
          setTransactionTx(tx);
          try {
            nonce = await provider.getTransactionCount(account);
          } catch (e) {
            console.error(e);
          }
        } else if (spec.opcode === OpCode.TX) {
          // Sanity check
          if (spec.to === '') throw new Error('Submission: malformed to');
          if (spec.data.length === 0)
            throw new Error('Submission: malformed data');
          if (spec.data.indexOf('0x') === 0 && spec.data.length <= 2)
            throw new Error('Submission: malformed data');
          try {
            nonce = await provider.getTransactionCount(account);
          } catch (e) {
            console.error(e);
          }
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
              throw error;
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
          dispatch(setContractStatus(ContractStatus.Failed));
          const options = { error: e.message, brief };
          if (mixpanelProps) Object.assign(options, mixpanelProps);
          if (onTxFail) {
            onTxFail(e, mixpanelProps);
          }

          setErrorMessage(getExecutionErrorMsg(chainId as ChainId, e.message));
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
        metadata,
        nonce,
        ...mixpanelProps,
      };
      dispatch(setContractStatus(ContractStatus.Pending));
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
        metadata,
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
        reportInfo.receipt = receipt;
        setShowingDone(true);
        if (receipt.status === WatchResult.Success) {
          if (reportInfo.opcode === 'TX') {
            dispatch(setContractStatus(ContractStatus.TxSuccess));
          }
          if (reportInfo.opcode === 'APPROVAL') {
            dispatch(setContractStatus(ContractStatus.ApproveSuccess));
          }

          await updateBlockNumber(); // update blockNumber once after tx
          if (successBack) {
            successBack(tx, onTxSuccess);
          }
          if (onTxSuccess) {
            onTxSuccess(tx, reportInfo);
          }
          queryClient.invalidateQueries({
            queryKey: [CONTRACT_QUERY_KEY],
          });
          setRequests((res) =>
            res.set(tx as string, [
              {
                ...request,
                doneTime: Math.ceil(Date.now() / 1000),
              },
              State.Success,
            ]),
          );
          return ExecutionResult.Success;
        }
      }
      if (onTxReverted) {
        onTxReverted(tx, reportInfo);
      }
      await updateBlockNumber(); // update blockNumber once after tx
      setShowingDone(true);
      setRequests((res) =>
        res.set(tx as string, [
          {
            ...request,
            doneTime: Math.ceil(Date.now() / 1000),
          },
          State.Failed,
        ]),
      );
      return ExecutionResult.Failed;
    },
    [
      account,
      chainId,
      setWaitingSubmit,
      provider,
      updateBlockNumber,
      queryClient,
    ],
  );

  const handlerCustom: ExecutionCtx['executeCustom'] = useCallback(
    async ({
      brief,
      subtitle,
      early,
      mixpanelProps,
      metadata,
      submittedBack,
      submittedConfirmBack,
      successBack,
      handler,
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

        const request = {
          brief,
          spec,
          subtitle,
          metadata,
        } as Request;

        let submitTx = '';
        const onSubmit: ExecuteCustomHandlerParameters['onSubmit'] = (
          tx: string,
          { showing, reportInfo: reportInfoProps } = {},
        ) => {
          submitTx = tx;
          setTransactionTx(tx);
          if (showing !== null) {
            setShowing({ spec, brief, subtitle, ...showing });
          }
          setWaitingSubmit(false);
          setRequests((res) =>
            res.set(tx as string, [
              {
                ...request,
                tx,
              },
              State.Running,
            ]),
          );

          setContractStatus(ContractStatus.Pending);
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

        const onSuccess: ExecuteCustomHandlerParameters['onSuccess'] = async (
          tx: string,
          { showing, reportInfo: reportInfoProps, notShowingDone } = {},
        ) => {
          setTransactionTx(tx);
          if (showing) {
            setShowing(
              (prev) =>
                ({
                  ...prev,
                  ...showing,
                }) as Showing,
            );
          }
          setContractStatus(ContractStatus.TxSuccess);
          setRequests((res) =>
            res.set(submitTx ?? tx, [
              {
                ...request,
                tx: submitTx,
              },
              State.Success,
            ]),
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
          queryClient.invalidateQueries({
            queryKey: [CONTRACT_QUERY_KEY],
          });
          if (!notShowingDone) {
            setShowingDone(true);
            setShowing(
              (prev) =>
                ({
                  ...prev,
                  done: true,
                }) as Showing,
            );
          }
        };

        const onError = (e: any) => {
          setWaitingSubmit(false);
          setShowing({
            spec,
            brief,
            subtitle,
          });
          if (submitTx) {
            setRequests((res) =>
              res.set(submitTx as string, [
                {
                  ...request,
                  tx: submitTx,
                },
                State.Failed,
              ]),
            );
          }
          console.error(e);
          if (e.message) {
            console.error(e.code);
            setContractStatus(ContractStatus.Failed);
            const options = { error: e.message, brief };
            if (mixpanelProps) Object.assign(options, mixpanelProps);
            if (onTxFail) {
              onTxFail(e, mixpanelProps);
            }

            setErrorMessage(
              getExecutionErrorMsg(chainId as ChainId, e.message),
            );
          }
          resolve(ExecutionResult.Failed);
        };
        try {
          setWaitingSubmit(true);
          await handler({
            onSubmit,
            onSuccess,
            onError,
            setShowing,
          });
        } catch (e: any) {
          onError(e);
          return;
        }
      });
    },
    [chainId, setWaitingSubmit, updateBlockNumber, queryClient],
  );

  /**
   * update requests text
   */
  const updateText = useCallback(
    (upd: TextUpdater) => {
      setRequests((requests) => {
        const newRequests = new Map<string, [Request, State]>();
        requests.forEach((value, key) => {
          const [request, state] = value;
          const updated = upd(request);
          if (updated) {
            newRequests.set(key, [
              {
                ...request,
                brief: updated.brief,
                subtitle: updated.subtitle,
                metadata: updated.metadata,
              },
              state,
            ]);
          } else {
            newRequests.set(key, value);
          }
        });
        return newRequests;
      });
    },
    [account, chainId, requests],
  );

  const ctxVal = useMemo<ExecutionCtx>(
    () => ({
      execute: handler,
      executeCustom: handlerCustom,
      requests,
      updateText,
      setShowing,
      waitingSubmit,
      errorMessage,
    }),
    [handler, handlerCustom, requests, updateText, waitingSubmit, errorMessage],
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
