import { unionBy } from 'lodash';
import { useEffect } from 'react';
import defaultTokens from '../../constants/tokenList';
import { setPopularTokenList, setTokenList } from '../useTokenState';
import { TokenList } from './type';

export interface InitTokenListProps {
  tokenList?: TokenList;
  popularTokenList?: TokenList;
}
export default function useInitTokenList({
  tokenList,
  popularTokenList,
}: InitTokenListProps) {
  useEffect(() => {
    const computed = async () => {
      let allTokenList = [];
      if (tokenList) {
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
