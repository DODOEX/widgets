import { ChainId } from '@dodoex/api';
import { useState } from 'react';
import { ZERO_PERCENT } from '../constants/misc';

// Use the buyFeeBps/sellFeeBps fields from Token GQL query where possible instead of this hook
export function useSwapTaxes(
  inputTokenAddress?: string,
  outputTokenAddress?: string,
  tokenChainId?: ChainId,
) {
  const [{ inputTax, outputTax }, setTaxes] = useState({
    inputTax: ZERO_PERCENT,
    outputTax: ZERO_PERCENT,
  });

  return { inputTax, outputTax };
}
