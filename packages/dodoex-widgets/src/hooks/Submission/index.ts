import { createContext, useContext } from 'react';
import { ExecutionCtx, ExecutionResult } from './types';

export { default as useExecution } from './useExecution';
export type { ExecutionProps } from './useExecution';
export { default as useInflights } from './useInflights';

export const ExecutionContext = createContext<ExecutionCtx>({
  executeCustom: () => Promise.resolve(ExecutionResult.Canceled),
  requests: undefined,
  updateText: () => {
    /* Nothing */
  },
  waitingSubmit: false,
  errorMessage: null,
});

/**
 * Get the submission context
 */
export function useSubmission() {
  return useContext(ExecutionContext);
}
