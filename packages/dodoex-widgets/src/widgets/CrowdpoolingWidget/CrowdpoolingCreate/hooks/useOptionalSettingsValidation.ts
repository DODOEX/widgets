import { useEffect, useState } from 'react';
import { StateProps } from '../reducers';

interface OptionalSettingsValidationResult {
  errorKey: string;
  isValid: boolean;
}

export const useOptionalSettingsValidation = (
  state: StateProps,
): OptionalSettingsValidationResult => {
  const [errorKey, setErrorKey] = useState<string>('');
  const {
    calmEndTime,
    liquidityAddedPercent,
    liquidityPoolType,
  } = state.optionalSettings;

  useEffect(() => {
    let errKey = '';

    // Validate calm end time
    if (calmEndTime && isNaN(calmEndTime)) {
      errKey = 'Invalid calm end time';
    }

    // Validate liquidity added percent
    if (
      liquidityAddedPercent !== null &&
      liquidityAddedPercent !== undefined
    ) {
      if (liquidityAddedPercent < 0 || liquidityAddedPercent > 100) {
        errKey = 'Liquidity added percent must be between 0 and 100';
      }
    }

    // Validate pool type
    if (!liquidityPoolType) {
      errKey = 'Pool type is required';
    }

    setErrorKey(errKey);
  }, [calmEndTime, liquidityAddedPercent, liquidityPoolType]);

  return {
    errorKey,
    isValid: !errorKey,
  };
};
