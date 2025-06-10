import { ChainId } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { tokenApi } from '../../constants/api';
import { useTokenState } from '../useTokenState';
import { TokenInfo, TokenList } from './type';

interface SimpleToken {
  chainId: ChainId;
  address: string;
}

export function getDefaultToken({
  side,
  tokenList,
  occupyToken,
  needFindToken,
  chainId,
}: {
  side: TokenInfo['side'];
  tokenList: TokenList;
  occupyToken?: TokenInfo | null;
  needFindToken?: SimpleToken;
  chainId?: number;
}) {
  let findToken = null as TokenInfo | null;
  let defaultToken = null as TokenInfo | null;
  const tokenListTarget = tokenList.filter(
    (token) =>
      (!token.side || token.side === side) &&
      (!chainId || token.chainId === chainId),
  );
  if (tokenListTarget.length) {
    if (needFindToken) {
      findToken =
        tokenListTarget.find(
          (token) =>
            token.address === needFindToken?.address &&
            token.chainId === needFindToken.chainId,
        ) ?? null;
      defaultToken = findToken;
    }
    if (!defaultToken) {
      if (!occupyToken) {
        [defaultToken] = tokenListTarget;
      } else {
        defaultToken =
          tokenListTarget.find(
            (token) => token.address !== occupyToken.address,
          ) ?? null;
      }
    }
  }
  return { findToken, defaultToken };
}

export function useTokenListDefaultToken({
  chainId,
  account,
  defaultBaseToken: defaultBaseSimpleToken,
  defaultQuoteToken: defaultQuoteSimpleToken,
  tokenListInclude,
}: {
  chainId?: number;
  account?: string;
  defaultBaseToken?: SimpleToken;
  defaultQuoteToken?: SimpleToken;
  /** Must exist in tokenList */
  tokenListInclude?: boolean;
} = {}) {
  const { tokenList } = useTokenState();
  const baseInTokenListToken = getDefaultToken({
    side: 'from',
    needFindToken: defaultBaseSimpleToken,
    tokenList,
    chainId,
  });
  const defaultBaseTokenQuery = useQuery({
    ...tokenApi.getFetchTokenQuery(
      tokenListInclude ? undefined : chainId,
      defaultBaseSimpleToken?.address,
      account,
    ),
  });
  const defaultQuoteTokenQuery = useQuery({
    ...tokenApi.getFetchTokenQuery(
      tokenListInclude ? undefined : chainId,
      defaultQuoteSimpleToken?.address,
      account,
    ),
  });

  let defaultBaseToken = null as TokenInfo | null;
  let defaultBaseTokenLoading = false;
  defaultBaseToken = baseInTokenListToken.defaultToken;
  if (defaultBaseTokenQuery.data) {
    defaultBaseToken = defaultBaseTokenQuery.data;
    defaultBaseTokenLoading = defaultBaseTokenQuery.isLoading;
  }

  let defaultQuoteToken = null as TokenInfo | null;
  let defaultQuoteTokenLoading = false;
  const quoteInTokenListToken = getDefaultToken({
    side: 'to',
    needFindToken: defaultQuoteSimpleToken,
    occupyToken: defaultBaseToken,
    tokenList,
    chainId,
  });
  defaultQuoteToken = quoteInTokenListToken.defaultToken;
  if (defaultQuoteTokenQuery.data) {
    defaultQuoteToken = defaultQuoteTokenQuery.data;
    defaultQuoteTokenLoading = defaultQuoteTokenQuery.isLoading;
  }

  return {
    defaultBaseToken,
    defaultQuoteToken,
    defaultBaseTokenLoading,
    defaultQuoteTokenLoading,
  };
}
