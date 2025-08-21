import { basicTokenMap, ChainId } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { useCurrentChainId } from '../ConnectWallet';
import { useTokenState } from '../useTokenState';
import { TokenInfo, TokenList } from './type';
import useTokenListFetchBalance from './useTokenListFetchBalance';

enum MatchLevel {
  fully = 1,
  prefix,
  other,
  none = 0,
}
function getTextMatchLevel(
  text: string,
  search: string,
  ignoreCase?: boolean,
  carryLevel = 0,
) {
  if (ignoreCase) {
    text = text.toLocaleLowerCase();
    search = search.toLocaleLowerCase();
  }
  if (text === search) {
    return MatchLevel.fully + carryLevel;
  }
  const textIndex = text.indexOf(search);
  if (textIndex === 0) {
    return MatchLevel.prefix + carryLevel;
  }
  if (textIndex > 0) {
    return MatchLevel.other + carryLevel;
  }
  return MatchLevel.none;
}
export const getFuzzySearchTokenSort = (
  token: TokenInfo,
  search: string,
  {
    matchAddress,
  }: {
    matchAddress?: boolean;
  } = {},
) => {
  if (!search) return 0;
  const searchText = search.toLocaleLowerCase();
  let sort = 0;
  if (matchAddress && token.address.toLocaleLowerCase() === searchText) {
    sort = 1;
  }

  if (!sort) {
    const symbol = token.symbol.toLocaleLowerCase();
    const symbolLevel = getTextMatchLevel(symbol, searchText, false, 1);
    sort = symbolLevel as number;
  }
  if (!sort) {
    const name = token.name.toLocaleLowerCase();
    let symbolLevel = getTextMatchLevel(name, searchText, false, 10);
    symbolLevel =
      symbolLevel === MatchLevel.fully + 10
        ? MatchLevel.fully + 1
        : symbolLevel;
    sort = symbolLevel as number;
  } else if (token.name.toLocaleLowerCase() === searchText) {
    sort = MatchLevel.fully + 1;
  }

  return sort;
};

export default function useTokenList({
  value,
  onChange,
  occupiedAddrs,
  occupiedChainId,
  hiddenAddrs,
  showAddrs,
  side,
  chainId: chainIdProps,
  visible,
  defaultLoadBalance,
  multiple,
  filterBySupportTargetChain,
}: {
  value?: TokenInfo | null | Array<TokenInfo>;
  onChange: (token: TokenInfo | Array<TokenInfo>, isOccupied: boolean) => void;

  /** token pair usage */
  occupiedAddrs?: string[];
  /** token pair usage */
  occupiedChainId?: ChainId;
  /** hide props */
  hiddenAddrs?: string[];
  /** only show props */
  showAddrs?: string[];
  /** token field control */
  side?: 'from' | 'to';
  chainId?: number;
  /** Token Picker visible */
  visible?: boolean;
  defaultLoadBalance?: boolean;
  multiple?: boolean;
  filterBySupportTargetChain?: boolean;
}) {
  const [filter, setFilter] = useState('');

  const currentChainId = useCurrentChainId();
  const chainId = chainIdProps ?? currentChainId;

  const {
    tokenList: tokenListOrigin,
    popularTokenList: popularTokenListOrigin,
  } = useTokenState();

  const hiddenSet = useMemo(
    () =>
      new Set(
        hiddenAddrs ? hiddenAddrs.map((e) => e.toLowerCase()) : undefined,
      ),
    [hiddenAddrs],
  );
  const showSet = useMemo(
    () =>
      showAddrs ? new Set(showAddrs.map((e) => e.toLowerCase())) : undefined,
    [showAddrs],
  );

  const getNeedShowList = useCallback(
    (tokens: TokenList) => {
      const includeKeySet = new Set<string>();
      return tokens.filter((e: TokenInfo) => {
        if (e.chainId !== chainId) {
          return false;
        }
        let isShow = true;
        if (showSet) {
          isShow = showSet.has(e.address.toLowerCase());
        } else {
          isShow = !hiddenSet.has(e.address.toLowerCase());
        }
        if (isShow) {
          if (side) {
            isShow = !e.side || e.side === side;
          } else {
            const key = `${e.chainId}-${e.address}`;
            isShow = !includeKeySet.has(key);
            includeKeySet.add(key);
          }
        }
        return isShow;
      });
    },
    [chainId, showSet, hiddenSet, side],
  );

  const filterTokenListByChainId = useCallback(
    (token: TokenInfo) => {
      if (token.chainId !== chainId) {
        return false;
      }

      // 是否需要筛选支持目标链的token
      if (!filterBySupportTargetChain) {
        return true;
      }

      // 同链 swap 跳过
      if (occupiedChainId == null || occupiedChainId === chainId) {
        return true;
      }

      if (!token.supportTargetChain) {
        return false;
      }

      if (occupiedChainId !== ChainId.SOLANA) {
        return true;
      }

      // 起始链为 SOLANA 时目标链只能为 ZETACHAIN 且指定交易对
      if (chainId !== ChainId.ZETACHAIN) {
        return false;
      }

      const payTokenAddress = occupiedAddrs?.[0]?.toLowerCase();
      const receiveTokenAddress = token.address.toLowerCase();
      if (!payTokenAddress) {
        return true;
      }
      const payBasicToken = basicTokenMap[occupiedChainId];
      switch (payTokenAddress) {
        // SOL
        case payBasicToken.address.toLowerCase():
        // WSOL
        case payBasicToken.wrappedTokenAddress.toLowerCase():
          // SOL.SOL
          return (
            receiveTokenAddress ===
            '0x4bC32034caCcc9B7e02536945eDbC286bACbA073'.toLowerCase()
          );

        // USDC
        case 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'.toLowerCase():
          // USDC.SOL
          return (
            receiveTokenAddress ===
            '0x8344d6f84d26f998fa070BbEA6D2E15E359e2641'.toLowerCase()
          );

        // USDT
        case 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'.toLowerCase():
          // USDT.SOL
          return (
            receiveTokenAddress ===
            '0xEe9CC614D03e7Dbe994b514079f4914a605B4719'.toLowerCase()
          );

        // 如果 SOLANA 上面新增了其他 mint 默认显示
        default:
          return true;
      }
    },
    [chainId, filterBySupportTargetChain, occupiedAddrs, occupiedChainId],
  );

  const tokenList = useMemo(() => {
    return getNeedShowList(tokenListOrigin.filter(filterTokenListByChainId));
  }, [filterTokenListByChainId, getNeedShowList, tokenListOrigin]);

  const popularTokenList = useMemo(() => {
    return getNeedShowList(
      popularTokenListOrigin.filter(filterTokenListByChainId),
    );
  }, [filterTokenListByChainId, getNeedShowList, popularTokenListOrigin]);

  const onSelectToken = useCallback(
    (token: TokenInfo) => {
      const address = token.address.toLowerCase();
      const isOccupied =
        (!occupiedChainId || token.chainId === occupiedChainId) &&
        !!occupiedAddrs?.some((e) => e.toLowerCase() === address);

      if (Array.isArray(value) || (multiple && !value)) {
        const newValue = [...(value as Array<TokenInfo>)];
        const findIndex = newValue.findIndex(
          (item) => item.address.toLocaleLowerCase() === address,
        );
        if (findIndex !== -1) {
          newValue.splice(findIndex, 1);
        } else {
          newValue.push(token);
        }
        onChange(newValue, isOccupied);
      } else {
        onChange(token, isOccupied);
      }
    },
    [onChange, occupiedAddrs, occupiedChainId],
  );

  // 假设 preloaded 已经包含 popularTokenList
  // const showTokenList = useMemo(() => {
  //   const preloadedTokenAddressSet = new Set<string>();
  //   preloaded.forEach((token) => {
  //     preloadedTokenAddressSet.add(token.address);
  //   });
  //   popularTokenList.forEach((token) => {
  //     if (!preloadedTokenAddressSet.has(token.address)) {
  //       preloaded.push(token);
  //     }
  //   });
  //   return preloaded || ([] as TokenList);
  // }, [preloaded, popularTokenList]);

  const tokenInfoMap = useTokenListFetchBalance({
    chainId,
    tokenList,
    popularTokenList,
    value,
    visible,
    defaultLoadBalance,
  });

  const getSortTokenList = useCallback(
    (target: TokenList) => {
      if (target === null) return null;
      const result: {
        token: TokenInfo;
        sort: number;
      }[] = [];
      if (filter) {
        target.forEach((e: TokenInfo) => {
          const sort = getFuzzySearchTokenSort(e, filter, {
            matchAddress: true,
          });
          if (sort) {
            result.push({
              sort,
              token: e,
            });
          }
        });
      } else {
        target.forEach((e: TokenInfo) => {
          result.push({
            sort: 0,
            token: e,
          });
        });
      }
      const tokenRes: TokenList = [];
      result
        .sort((aItem, bItem) => {
          const a = aItem.token;
          const b = bItem.token;
          if (value) {
            if (Array.isArray(value)) {
              const valueAddresses = value.map(
                (valueItem) => valueItem.address,
              );
              const aValueIndexOf = valueAddresses.indexOf(a.address);
              const bValueIndexOf = valueAddresses.indexOf(b.address);
              const hasAValue = aValueIndexOf !== -1;
              const hasBValue = bValueIndexOf !== -1;
              if (hasAValue || hasBValue) {
                return (hasAValue && aValueIndexOf < bValueIndexOf) ||
                  !hasBValue
                  ? -1
                  : 1;
              }
            } else {
              if (a.address === value.address) {
                return -1;
              }
              if (b.address === value.address) {
                return 1;
              }
            }
          }

          if (occupiedAddrs?.includes(a.address)) {
            return -1;
          }
          if (occupiedAddrs?.includes(b.address)) {
            return 1;
          }

          const balA =
            tokenInfoMap.get(`${a.chainId}-${a.address}`)?.balance ||
            new BigNumber(0);
          const balB =
            tokenInfoMap.get(`${b.chainId}-${b.address}`)?.balance ||
            new BigNumber(0);

          const popularAddresses = popularTokenList.map((item) => item.address);
          if (popularAddresses?.includes(a.address)) {
            return -1;
          }
          if (popularAddresses?.includes(b.address)) {
            return 1;
          }

          if (!balA.eq(balB)) return balA.gt(balB) ? -1 : 1;
          if (aItem.sort !== bItem.sort)
            return aItem.sort > bItem.sort ? 1 : -1;

          return a.symbol.localeCompare(b.symbol); // A - Z
        })
        .some((item) => {
          if (filter && tokenRes.length > 21) {
            return true;
          }
          tokenRes.push(item.token);
          return false;
        });
      return tokenRes;
    },
    [filter, tokenInfoMap, occupiedAddrs, value, popularTokenList],
  );

  const sortTokenList = useMemo(
    () => getSortTokenList(tokenList) || ([] as TokenList),
    [getSortTokenList, tokenList],
  );

  return {
    filter,
    setFilter,

    showTokenList: sortTokenList,

    onSelectToken,

    popularTokenList,
    tokenInfoMap,
  };
}
