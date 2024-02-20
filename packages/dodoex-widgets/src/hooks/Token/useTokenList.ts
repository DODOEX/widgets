import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTokenList } from '../../store/selectors/token';
import useGetBalance from './useGetBalance';
import { TokenInfo, TokenList } from './type';
import { useCurrentChainId } from '../ConnectWallet';
import defaultTokens from '../../constants/tokenList';
import { RootState } from '../../store/reducers';
import { getPopularTokenList } from '../../store/selectors/token';
import { unionBy } from 'lodash';
import useTokenListFetchBalance from './useTokenListFetchBalance';
import { ChainId } from '../../constants/chains';

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
}) {
  const [filter, setFilter] = useState('');
  const preloadedOrigin = useSelector(getTokenList);
  const currentChainId = useCurrentChainId();
  const chainId = useMemo(
    () => chainIdProps ?? currentChainId,
    [chainIdProps, currentChainId],
  );
  const getBalance = useGetBalance();
  const preloaded = useMemo(() => {
    const preloadedResult = preloadedOrigin.filter(
      (token) => token.chainId === chainId,
    );
    return preloadedResult;
  }, [preloadedOrigin, chainId]);
  const popularTokenListOrigin = useSelector((state: RootState) =>
    getPopularTokenList(chainId, state),
  );
  const defaultTokenList = useMemo(() => {
    return defaultTokens?.filter((token) => token.chainId === chainId) || [];
  }, [defaultTokens, chainId]);

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
      return tokens.filter((e: TokenInfo) => {
        if (e.chainId !== chainId) return false;
        let isShow = true;
        if (showSet) {
          isShow = showSet.has(e.address.toLowerCase());
        } else {
          isShow = !hiddenSet.has(e.address.toLowerCase());
        }
        if (isShow && side) {
          isShow = !e.side || e.side === side;
        }
        return isShow;
      });
    },
    [showSet, chainId, hiddenSet],
  );

  const popularTokenList = useMemo(
    () => getNeedShowList(popularTokenListOrigin),
    [popularTokenListOrigin, getNeedShowList],
  );

  const sortTokenList = useCallback(
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

          const balA = (getBalance && getBalance(a)) || new BigNumber(0);
          const balB = (getBalance && getBalance(b)) || new BigNumber(0);

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

          const defaultAddresses = defaultTokenList.map((item) => item.address);
          if (defaultAddresses?.includes(a.address)) {
            return -1;
          }
          if (defaultAddresses?.includes(b.address)) {
            return 1;
          }

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
    [
      filter,
      getBalance,
      occupiedAddrs,
      value,
      popularTokenList,
      defaultTokenList,
    ],
  );

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

  const showTokenList = useMemo(() => {
    const needShowList = getNeedShowList(preloaded);
    const preloadedTokenAddressSet = new Set<string>();
    needShowList.forEach((token) => {
      preloadedTokenAddressSet.add(token.address);
    });
    popularTokenList.forEach((token) => {
      if (!preloadedTokenAddressSet.has(token.address)) {
        needShowList.push(token);
      }
    });
    return sortTokenList(needShowList) || ([] as TokenList);
  }, [preloaded, getNeedShowList, sortTokenList, popularTokenList]);

  useTokenListFetchBalance({
    chainId,
    tokenList: showTokenList,
    popularTokenList,
    value,
    visible,
    defaultLoadBalance,
  });

  return {
    filter,
    setFilter,

    showTokenList,

    onSelectToken,

    popularTokenList,
  };
}
