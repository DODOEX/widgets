import { useCallback, useEffect, useState } from 'react';
import { StateProps } from '../reducers';

interface TimeSettingsValidationResult {
  errorKey: string;
  isValid: boolean;
  reCheck: (getErrorState?: (isError: boolean) => void) => void;
}

export const useTimeSettingsValidation = (
  state: StateProps,
): TimeSettingsValidationResult => {
  const [errorKey, setErrorKey] = useState<string>('');
  const { bidStartTime, bidEndTime } = state.timeSettings;

  const check = useCallback(
    (getErrorState?: (isError: boolean) => void) => {
      let errKey = '';

      if (bidStartTime === null || isNaN(bidStartTime)) {
        errKey = 'Invalid start time';
      } else if (bidStartTime !== null && bidStartTime <= Date.now()) {
        errKey = 'Start time must be in the future';
      }

      if (bidEndTime === null || isNaN(bidEndTime)) {
        errKey = 'Invalid end time';
      } else if (
        bidStartTime !== null &&
        bidEndTime !== null &&
        bidEndTime <= bidStartTime
      ) {
        errKey = 'End time must be after start time';
      }

      setErrorKey(errKey);
      if (getErrorState) {
        getErrorState(!!errKey);
      }
    },
    [bidStartTime, bidEndTime],
  );

  useEffect(() => {
    check();
  }, [check]);

  return {
    errorKey,
    isValid: !errorKey,
    reCheck: check,
  };
};
