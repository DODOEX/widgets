import { useEffect } from 'react';
import { unionBy, isArray } from 'lodash';
import { TokenList, TokenListType } from './type';
import defaultTokens from '../../constants/tokenList';
import { setPopularTokenList, setTokenList } from '../useTokenState';

export interface InitTokenListProps {
  tokenList?: TokenList | TokenListType;
  popularTokenList?: TokenList;
}
export default function useInitTokenList({
  tokenList,
  popularTokenList,
}: InitTokenListProps) {
  useEffect(() => {
    const computed = async () => {
      let allTokenList = [];
      if (isArray(tokenList)) {
        allTokenList = tokenList;
      } else {
        allTokenList = unionBy(
          popularTokenList,
          defaultTokens,
          (token) => token.address.toLowerCase() + token.chainId + token.side,
        );
      }
      setTokenList(allTokenList);
    };
    computed();
  }, [tokenList, popularTokenList]);

  useEffect(() => {
    setPopularTokenList(popularTokenList ?? []);
  }, [popularTokenList]);
}
