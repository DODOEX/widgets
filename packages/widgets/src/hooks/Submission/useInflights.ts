import { Request, State } from './types';
import { useSubmission, useExecution } from '.';

export default function useInflights() {
  const { requests } = useSubmission();
  const runningRequests = [] as Request[];
  requests?.forEach(function ([request, state]) {
    if (state === State.Running) {
      runningRequests.push(request);
    }
  });
  return {
    runningRequests,
    isInflight: runningRequests.length > 0,
  };
}
