import { ChainId } from '@dodoex/api';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { setContractStatus } from '../../store/actions/globals';
import { ContractStatus } from '../../store/reducers/globals';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useFetchBlockNumber } from '../contract';
import getExecutionErrorMsg from './getExecutionErrorMsg';
import { OpCode, Step as StepSpec } from './spec';
import {
  ExecuteCustomHandlerParameters,
  ExecutionCtx,
  ExecutionResult,
  Request,
  Showing,
  State,
  TextUpdater,
} from './types';

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
  const { account, chainId } = useWalletInfo();
  const queryClient = useQueryClient();
  const [waitingSubmit, setWaitingSubmit] = useState(false);
  const [requests, setRequests] = useState<Map<string, [Request, State]>>(
    new Map(),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dialog status
  const [transactionTx, setTransactionTx] = useState('');
  const [showing, setShowing] = useState<Showing | null>(null);
  const [showingDone, setShowingDone] = useState(false);
  const [submittedConfirmBack, setSubmittedConfirmBack] =
    useState<() => void>();
  const { updateBlockNumber } = useFetchBlockNumber();

  const executeCustom: ExecutionCtx['executeCustom'] = useCallback(
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
            queryKey: ['token'],
          });
          queryClient.invalidateQueries({
            queryKey: ['clmm'],
          });
          queryClient.invalidateQueries({
            queryKey: ['cpmm'],
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
          resolve(ExecutionResult.Success);
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
      executeCustom,
      requests,
      updateText,
      setShowing,
      waitingSubmit,
      errorMessage,
    }),
    [executeCustom, requests, updateText, waitingSubmit, errorMessage],
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
