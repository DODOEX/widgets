import { CONTRACT_QUERY_KEY } from '@dodoex/api';
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
} from './types';
import { BIG_ALLOWANCE } from '../../constants/token';
import { useCurrentChainId } from '../ConnectWallet';
import { useQueryClient } from '@tanstack/react-query';
import { ContractStatus, setContractStatus } from '../useGlobalState';

export interface ExecutionProps {
  onTxFail?: (error: Error, data: any) => void;
  onTxSubmit?: (tx: string, data: any) => void;
  onTxSuccess?: (tx: string, data: any) => void;
  onTxReverted?: (tx: string, data: any) => void;
  showSubmitLoadingDialog?: boolean;
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
      setShowing({ spec, brief, subtitle, submitState: 'loading' });
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
          setContractStatus(ContractStatus.Failed);
          const options = { error: e.message, brief };
          if (mixpanelProps) Object.assign(options, mixpanelProps);
          if (onTxFail) {
            onTxFail(e, mixpanelProps);
          }

          setErrorMessage(getExecutionErrorMsg(chainId, e.message));
        }
        return ExecutionResult.Failed;
      }
      setShowing({ spec, brief, subtitle, submitState: 'submitted' });
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
      setContractStatus(ContractStatus.Pending);
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
          await waitBlockNumber(updateBlockNumber, receipt.blockNumber); // update blockNumber once after tx
          if (reportInfo.opcode === 'TX') {
            setContractStatus(ContractStatus.TxSuccess);
          }
          if (reportInfo.opcode === 'APPROVAL') {
            setContractStatus(ContractStatus.ApproveSuccess);
          }

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
      requests,
      updateText,
      setShowing,
      waitingSubmit,
      errorMessage,
    }),
    [handler, requests, updateText, waitingSubmit, errorMessage],
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
    setShowing,
    ctxVal,
    requests,
  };
}

let timeout = 0;
function waitBlockNumber(
  updateBlockNumber: () => Promise<number | undefined>,
  target: number,
  interval = 800,
) {
  clearTimeout(timeout);
  return new Promise((resolve) => {
    timeout = window.setTimeout(async () => {
      const blockNumber = await updateBlockNumber();
      if (blockNumber && blockNumber >= target) {
        resolve(blockNumber);
        return;
      } else {
        const result = await waitBlockNumber(
          updateBlockNumber,
          target,
          interval,
        );
        resolve(result);
      }
    }, interval);
  });
}
