import { useMemo } from 'react';
import { TokenInfo } from '../../../../hooks/Token/type';

export const useTokenPairStatus = ({
  side,
  baseToken,
  quoteToken,
  onChangeBaseToken,
  onChangeQuoteToken,
}: {
  side?: 'base' | 'quote';
  baseToken?: TokenInfo;
  quoteToken?: TokenInfo;
  onChangeBaseToken: (token?: TokenInfo) => void;
  onChangeQuoteToken?: (token?: TokenInfo) => void;
}) => {
  const switchToken = () => {
    if (!quoteToken || !baseToken) return;
    const baseTokenOrigin = { ...quoteToken };
    const quoteTokenOrigin = { ...baseToken };
    onChangeBaseToken(baseTokenOrigin);
    if (onChangeQuoteToken) {
      onChangeQuoteToken(quoteTokenOrigin);
    }
  };

  const baseTokenChange = (token: TokenInfo, occupied?: boolean) => {
    if (occupied) {
      switchToken();
    } else {
      onChangeBaseToken(token);
    }
  };

  const quoteTokenChange = (token: TokenInfo, occupied?: boolean) => {
    if (occupied) {
      switchToken();
    } else if (onChangeQuoteToken) {
      onChangeQuoteToken(token);
    }
  };

  const reset = () => {
    onChangeBaseToken(undefined);
    if (onChangeQuoteToken) {
      onChangeQuoteToken(undefined);
    }
  };

  const baseOccupiedAddrs = useMemo(
    () => (quoteToken ? [quoteToken.address] : undefined),
    [quoteToken],
  );
  const quoteOccupiedAddrs = useMemo(
    () => (baseToken ? [baseToken.address] : undefined),
    [baseToken],
  );

  return {
    baseToken,
    quoteToken,
    baseTokenChange,
    quoteTokenChange,
    baseOccupiedAddrs,
    quoteOccupiedAddrs,

    token: side === 'base' ? baseToken : quoteToken,
    onTokenChange: side === 'base' ? baseTokenChange : quoteTokenChange,
    occupiedAddrs: side === 'base' ? baseOccupiedAddrs : quoteOccupiedAddrs,
    reset,
  };
};
