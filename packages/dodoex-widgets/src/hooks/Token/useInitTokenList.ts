import { isArray, unionBy } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import defaultTokens from '../../constants/tokenList';
import { AppThunkDispatch } from '../../store/actions';
import { setPopularTokenList, setTokenList } from '../../store/actions/token';
import { TokenList, TokenListType } from './type';

export interface InitTokenListProps {
  tokenList?: TokenList | TokenListType;
  popularTokenList?: TokenList;
}
export default function useInitTokenList({
  tokenList,
  popularTokenList,
}: InitTokenListProps) {
  const dispatch = useDispatch<AppThunkDispatch>();

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
      dispatch(setTokenList(allTokenList));
    };
    computed();
  }, [tokenList, dispatch, popularTokenList]);

  useEffect(() => {
    dispatch(setPopularTokenList(popularTokenList ?? []));
  }, [popularTokenList, dispatch]);
}
