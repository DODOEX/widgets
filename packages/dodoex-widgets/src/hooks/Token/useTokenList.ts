import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTokenList } from '../../store/selectors/token';
import useGetBalance from './useGetBalance';
import { TokenInfo, TokenList } from './type';
import { useCurrentChainId } from '../ConnectWallet';

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
  hiddenAddrs,
  showAddrs,
}: {
  value?: TokenInfo | null;
  onChange: (token: TokenInfo, isOccupied: boolean) => void;

  /** token pair usage */
  occupiedAddrs?: string[];
  /** hide props */
  hiddenAddrs?: string[];
  /** only show props */
  showAddrs?: string[];
}) {
  const [filter, setFilter] = useState('');
  const preloaded = useSelector(getTokenList);
  const chainId = useCurrentChainId();
  const getBalance = useGetBalance();

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
        return isShow;
      });
    },
    [showSet, chainId, hiddenSet],
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
            if (a.address === value.address) {
              return -1;
            }
            if (b.address === value.address) {
              return 1;
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

          if (!balA.eq(balB)) return balA.gt(balB) ? -1 : 1;
          if (aItem.sort !== bItem.sort)
            return aItem.sort > bItem.sort ? 1 : -1;
          return a.symbol.localeCompare(b.symbol);
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
    [filter, getBalance, occupiedAddrs, value],
  );

  const onSelectToken = useCallback(
    (token: TokenInfo) => {
      const address = token.address.toLowerCase();
      onChange(
        token,
        !!occupiedAddrs?.some((e) => e.toLowerCase() === address),
      );
    },
    [onChange, occupiedAddrs],
  );

  const showTokenList = useMemo(() => {
    const needShowList = getNeedShowList(preloaded);
    return sortTokenList(needShowList) || ([] as TokenList);
  }, [preloaded, getNeedShowList, sortTokenList]);

  return {
    filter,
    setFilter,

    showTokenList,

    onSelectToken,
  };
}
