import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLastToken } from '../../constants/localstorage';
import { AppThunkDispatch } from '../../store/actions';
import { setGlobalProps } from '../../store/actions/globals';
import { getGlobalProps } from '../../store/selectors/globals';
import {
  getDefaultFromToken,
  getDefaultToToken,
  getTokenList,
} from '../../store/selectors/token';
import { getDefaultChainId } from '../../store/selectors/wallet';
import { useWalletState } from '../ConnectWallet/useWalletState';
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
  const tokenListTarget = tokenList.filter(
    (token) =>
      (!token.side || token.side === side) &&
      (!chainId || token.chainId === chainId),
  );
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
}: {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  setFromToken: (value: React.SetStateAction<TokenInfo | null>) => void;
  setToToken: (value: React.SetStateAction<TokenInfo | null>) => void;
  updateFromAmt: (v: string | number) => void;
  updateToAmt: (v: string | number) => void;
}) {
  const tokenList = useSelector(getTokenList);
  const defaultFromToken = useSelector(getDefaultFromToken);
  const defaultToToken = useSelector(getDefaultToToken);
  const global = useSelector(getGlobalProps);
  const dispatch = useDispatch<AppThunkDispatch>();
  const { chainId } = useWalletState();

  const initToken = () => {
    let findFromToken: TokenInfo | null = null;
    let setDefaultFromAmount: number | undefined;
    if (!global.crossChain && global.autoConnectLoading) return;
    if (!fromToken) {
      const result = getDefaultToken({
        side: 'from',
        defaultToken: defaultFromToken,
        tokenList,
        chainId: global.crossChain ? undefined : chainId,
      });
      findFromToken = result.findToken;
      setDefaultFromAmount = result.setDefaultAmount;
      if (findFromToken) {
        setFromToken(findFromToken);
        if (setDefaultFromAmount !== undefined) {
          dispatch(
            setGlobalProps({
              isReverseRouting: false,
            }),
          );
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
          chainId: global.crossChain ? undefined : chainId,
        });
      if (findToToken) {
        setToToken(findToToken);
        if (
          setDefaultFromAmount === undefined &&
          setDefaultToAmount !== undefined
        ) {
          dispatch(
            setGlobalProps({
              isReverseRouting: true,
            }),
          );
          updateToAmt(setDefaultToAmount);
        }
      }
    }
  };

  useEffect(() => {
    initToken();
  }, [
    tokenList,
    defaultFromToken,
    defaultToToken,
    global.crossChain,
    global.autoConnectLoading,
    chainId,
  ]);
}
