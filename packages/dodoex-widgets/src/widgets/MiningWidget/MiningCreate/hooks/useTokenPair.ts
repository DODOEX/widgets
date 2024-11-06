import { useState } from 'react';
import { TokenInfo } from '../../../../hooks/Token/type';
import { useTokenPairStatus } from './useTokenPairStatus';

export const useTokenPair = ({
  side,
  defaultBaseToken,
  defaultQuoteToken,
}: {
  side?: 'base' | 'quote';
  defaultBaseToken?: TokenInfo;
  defaultQuoteToken?: TokenInfo;
} = {}) => {
  const [baseToken, setBaseToken] = useState<TokenInfo | undefined>(
    defaultBaseToken,
  );
  const [quoteToken, setQuoteToken] = useState<TokenInfo | undefined>(
    defaultQuoteToken,
  );

  return useTokenPairStatus({
    side,
    baseToken,
    quoteToken,
    onChangeBaseToken: setBaseToken,
    onChangeQuoteToken: setQuoteToken,
  });
};
