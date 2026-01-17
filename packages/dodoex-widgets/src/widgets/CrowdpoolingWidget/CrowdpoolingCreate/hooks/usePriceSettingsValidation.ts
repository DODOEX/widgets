import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { StateProps } from '../reducers';

interface PriceSettingsValidationResult {
  errorKey: string;
  isValid: boolean;
}

export const usePriceSettingsValidation = (
  state: StateProps,
): PriceSettingsValidationResult => {
  const [errorKey, setErrorKey] = useState<string>('');
  const { baseToken, quoteToken, salesRatio, price, baseTokenAmount } =
    state.priceSettings;

  useEffect(() => {
    let errKey = '';

    // Validate base token
    if (!baseToken) {
      errKey = 'Supply token is required';
    }

    // Validate base token amount
    if (!baseTokenAmount) {
      errKey = 'Base token amount is required';
    } else if (
      new BigNumber(baseTokenAmount).lte(0) ||
      new BigNumber(baseTokenAmount).gt(99999999999999)
    ) {
      errKey = 'Invalid base token amount';
    }

    // Validate sales ratio
    if (salesRatio !== null && salesRatio > 50) {
      errKey = 'Sales ratio cannot exceed 50%';
    }

    // Validate price
    if (!price) {
      errKey = 'Price is required';
    } else if (price <= 0) {
      errKey = 'Price must be greater than 0';
    }

    // Validate quote token
    if (!quoteToken) {
      errKey = 'Quote token is required';
    }

    setErrorKey(errKey);
  }, [baseToken, quoteToken, salesRatio, price, baseTokenAmount]);

  return {
    errorKey,
    isValid: !errorKey,
  };
};
