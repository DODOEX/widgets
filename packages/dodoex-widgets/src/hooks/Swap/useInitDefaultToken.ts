import { useCallback, useEffect } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { getLastToken } from '../../constants/localstorage';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { DefaultTokenInfo, TokenInfo, TokenList } from '../Token';
import { useTokenState } from '../useTokenState';

function getDefaultToken({
  side,
  defaultToken,
  tokenList,
  occupyToken,
  chainId,
}: {
  side: TokenInfo['side'];
  defaultToken?: DefaultTokenInfo;
  tokenList: TokenList;
  occupyToken?: TokenInfo | null;
  chainId?: number;
}) {
  let findToken = null as TokenInfo | null;
  let setDefaultAmount: number | undefined;
  let tokenListTarget = tokenList.filter(
    (token) =>
      (!token.side || token.side === side) &&
      (!chainId || token.chainId === chainId),
  );
  if (!tokenListTarget.length) {
    tokenListTarget = tokenList.filter(
      (token) => !token.side || token.side === side,
    );
  }
  if (tokenListTarget.length) {
    let needFindToken = getLastToken(side);
    if (!needFindToken && defaultToken) {
      needFindToken = { ...defaultToken };
      setDefaultAmount = defaultToken.amount;
    }
    if (needFindToken) {
      findToken =
        tokenListTarget.find(
          (token) =>
            token.address === needFindToken?.address &&
            token.chainId === needFindToken.chainId,
        ) ?? null;
    }
    if (!findToken) {
      if (!occupyToken) {
        [findToken] = tokenListTarget;
      } else {
        findToken =
          tokenListTarget.find(
            (token) => token.address !== occupyToken.address,
          ) ?? null;
      }
    }
  }
  return {
    findToken,
    setDefaultAmount,
  };
}

// need to set the cache using setLastToken
export function useInitDefaultToken({
  fromToken,
  toToken,
  setFromToken,
  setToToken,
  updateFromAmt,
  updateToAmt,
  setIsReverseRouting,
}: {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  setFromToken: (value: React.SetStateAction<TokenInfo | null>) => void;
  setToToken: (value: React.SetStateAction<TokenInfo | null>) => void;
  updateFromAmt: (v: string | number) => void;
  updateToAmt: (v: string | number) => void;
  setIsReverseRouting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { tokenList } = useTokenState();
  const { crossChain, defaultFromToken, defaultToToken, onlyChainId } =
    useUserOptions();
  const { chainId } = useWalletInfo();

  const initToken = useCallback(() => {
    let findFromToken: TokenInfo | null = null;
    let setDefaultFromAmount: number | undefined;

    const findChainId = crossChain ? undefined : (onlyChainId ?? chainId);
    if (!fromToken) {
      const result = getDefaultToken({
        side: 'from',
        defaultToken: defaultFromToken,
        tokenList,
        chainId: findChainId,
      });
      findFromToken = result.findToken;
      setDefaultFromAmount = result.setDefaultAmount;
      if (findFromToken) {
        setFromToken(findFromToken);
        if (setDefaultFromAmount !== undefined) {
          setIsReverseRouting(false);
          updateFromAmt(setDefaultFromAmount);
        }
      }
    }

    if (!toToken) {
      const { findToken: findToToken, setDefaultAmount: setDefaultToAmount } =
        getDefaultToken({
          side: 'to',
          defaultToken: defaultToToken,
          tokenList,
          occupyToken: findFromToken,
          chainId: findChainId,
        });
      if (findToToken) {
        setToToken(findToToken);
        if (
          setDefaultFromAmount === undefined &&
          setDefaultToAmount !== undefined
        ) {
          setIsReverseRouting(true);
          updateToAmt(setDefaultToAmount);
        }
      }
    }
  }, [
    chainId,
    crossChain,
    defaultFromToken,
    defaultToToken,
    fromToken,
    onlyChainId,
    setFromToken,
    setIsReverseRouting,
    setToToken,
    toToken,
    tokenList,
    updateFromAmt,
    updateToAmt,
  ]);

  useEffect(() => {
    // Avoid continuous triggering
    const time = setTimeout(() => {
      initToken();
    }, 10);
    return () => clearTimeout(time);
  }, [initToken]);
}
