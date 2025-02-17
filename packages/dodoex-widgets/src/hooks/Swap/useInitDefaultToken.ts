import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { getLastToken } from '../../constants/localstorage';
import { getAutoConnectLoading } from '../../store/selectors/globals';
import { getTokenList } from '../../store/selectors/token';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { DefaultTokenInfo, TokenInfo, TokenList } from '../Token';

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
  const tokenList = useSelector(getTokenList);
  const { crossChain, defaultFromToken, defaultToToken, onlyChainId } =
    useUserOptions();
  const autoConnectLoading = useSelector(getAutoConnectLoading);
  const { chainId, isActivating } = useWalletInfo();

  const initToken = () => {
    let findFromToken: TokenInfo | null = null;
    let setDefaultFromAmount: number | undefined;
    if (!crossChain && autoConnectLoading) return;
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
  };

  useEffect(() => {
    // Avoid continuous triggering
    const time = setTimeout(() => {
      if (!isActivating) {
        initToken();
      }
    }, 10);
    return () => clearTimeout(time);
  }, [
    tokenList,
    defaultFromToken,
    defaultToToken,
    crossChain,
    autoConnectLoading,
    chainId,
    onlyChainId,
    isActivating,
  ]);
}
