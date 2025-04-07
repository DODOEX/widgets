import { createContext, useContext } from 'react';
import { ExecutionCtx, ExecutionResult } from './types';
import { useUserOptions } from '../../components/UserOptionsProvider';

export { default as useExecution } from './useExecution';
export type { ExecutionProps } from './useExecution';
export { default as useInflights } from './useInflights';

export const ExecutionContext = createContext<ExecutionCtx>({
  execute: () => Promise.resolve(ExecutionResult.Canceled),
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
  const { submission: submissionProps } = useUserOptions();
  const submission = useContext(ExecutionContext);
  if (submissionProps) return submissionProps;
  return submission;
}
