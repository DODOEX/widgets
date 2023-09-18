import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getAllTokenList } from '../../store/selectors/token';
import { TokenInfo } from './type';

export function useDisabledTokenSwitch({
  fromToken,
  toToken,
}: {
  fromToken: TokenInfo | undefined | null;
  toToken: TokenInfo | undefined | null;
}) {
  const tokenList = useSelector(getAllTokenList);
  return useMemo(() => {
    if (
      fromToken &&
      !tokenList.some(
        (token) =>
          token.chainId === fromToken.chainId &&
          token.address === fromToken.address &&
          (!token.side || token.side === 'to'),
      )
    ) {
      return true;
    }
    if (
      toToken &&
      !tokenList.some(
        (token) =>
          token.chainId === toToken.chainId &&
          token.address === toToken.address &&
          (!token.side || token.side === 'from'),
      )
    ) {
      return true;
    }
    return false;
  }, [fromToken, toToken, tokenList]);
}
