import { Step as StepSpec } from './spec';
import { ExecutionProps } from './useExecution';

export enum State {
  Running,
  Success,
  Failed,
  Warning,
}

export type Request = {
  brief: string;
  spec: StepSpec;
  subtitle?: string | React.ReactNode | null;
  tx: string;
  nonce?: number;
};

export type Requests = Map<string, [Request, State]>;

export enum ExecutionResult {
  // User canceled the op
  Canceled = 'canceled',
  // Op failed on chain
  Failed = 'failed',
  // Op confirmed on chain
  Success = 'success',

  // Op submitted on chain
  // Only when called with early return mode enabled
  Submitted = 'submitted',
}

export interface Showing {
  brief: string;
  subtitle?: string | React.ReactNode;
  spec: StepSpec;
}

export type ExecutionCtx = {
  /**
   * Execute an on-chain operation
   * @param breif: TX title. e.g.: "Swap"
   * @param spec: TX specification.
   * @param subtitle: Additional hint text. e.g.: "10 USDT to 10 USDC"
   * @param early: When given, the returned promise resolves when user confirmed in their wallet.
   * @param mixpanelProps: mixpanel properties
   * @param submittedConfirmBack: dismiss callback
   */
  execute: (
    brief: string,
    spec: StepSpec,
    subtitle?: string | React.ReactNode | null,
    early?: boolean,
    submittedBack?: () => void,
    mixpanelProps?: Record<string, any>,
    submittedConfirmBack?: () => void,
    successBack?: (
      tx: string,
      callback?: ExecutionProps['onTxSuccess'],
    ) => void,
  ) => Promise<ExecutionResult>;

  executeCustom: ({
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
    early?: boolean | undefined;
    mixpanelProps?: Record<string, any> | undefined;
    submittedBack?: (() => void) | undefined;
    submittedConfirmBack?: (() => void) | undefined;
    successBack?:
      | ((tx: string, callback?: ExecutionProps['onTxSuccess']) => void)
      | undefined;
    handler: (params: {
      onSubmit?: (tx: string, reportInfo?: Record<string, any>) => void;
      onSuccess?: (
        tx: string,
        reportInfo?: Record<string, any>,
      ) => Promise<void>;
      onError?: (e: any) => void;
    }) => Promise<any>;
  }) => Promise<ExecutionResult>;

  /**
   * order
   */
  requests?: Requests;
  setShowing?: React.Dispatch<React.SetStateAction<Showing | null>>;
  waitingSubmit: boolean;
};

export enum WatchResult {
  Failed = 0,
  Success,
}
