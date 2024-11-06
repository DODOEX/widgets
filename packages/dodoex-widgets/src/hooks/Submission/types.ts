import { Step as StepSpec } from './spec';
import { ExecutionProps } from './useExecution';

export enum State {
  Running,
  Success,
  Failed,
  Warning,
}

export enum MetadataFlag {
  swap = 'swap',
  crossChain = 'crossChain',
  addLiquidity = 'addLiquidity',
  removeLiquidity = 'removeLiquidity',
  createDPPPool = 'createDPPPool',
  createDSPPool = 'createDSPPool',
  createGSPPool = 'createGSPPool',
  createDVMPool = 'createDVMPool',
  stakeMining = 'stakeMining',
  unstakeMining = 'unstakeMining',
  claimMining = 'claimMining',
  submissionCreateMetaKey = 'submissionCreateMetaKey',
  approve = 'approve',
  reset = 'reset',
}

export type Metadata = Record<string, any>;

export type Request = {
  brief: string;
  spec: StepSpec;
  subtitle?: string | React.ReactNode | null;
  metadata?: Metadata;
  tx: string;
  nonce?: number;
  doneTime?: number;
};

export type TextUpdater = (request: Request) => null | {
  brief: string;
  subtitle?: string;
  metadata?: Metadata;
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
   * @param submittedConfirmBack: submittedConfirmBack
   * @param successBack: successBack
   * @param metadata: metadata
   */
  execute: (
    brief: string,
    spec: StepSpec,
    params?: {
      subtitle?: string | React.ReactNode | null;
      early?: boolean;
      submittedBack?: () => void;
      mixpanelProps?: Record<string, any>;
      submittedConfirmBack?: () => void;
      successBack?: (
        tx: string,
        callback?: ExecutionProps['onTxSuccess'],
      ) => void;
      metadata?: Metadata;
    },
  ) => Promise<ExecutionResult>;

  /**
   * order
   */
  requests?: Requests;
  updateText: (upd: TextUpdater) => void;
  setShowing?: React.Dispatch<React.SetStateAction<Showing | null>>;
  waitingSubmit: boolean;
  errorMessage: string | null;
};

export enum WatchResult {
  Failed = 0,
  Success,
}
