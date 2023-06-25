import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { unionBy, isArray } from 'lodash';
import { AppThunkDispatch } from '../../store/actions';
import {
  setPopularTokenList,
  setTokenBalances,
  setTokenList,
} from '../../store/actions/token';
import { TokenList, TokenListType } from './type';
import { useCurrentChainId } from '../ConnectWallet';
import defaultTokens from '../../constants/tokenList';
import { setShowCoingecko } from '../../store/actions/globals';
import { useGetCGTokenList } from './useGetCGTokenList';

export interface InitTokenListProps {
  tokenList?: TokenList | TokenListType;
  popularTokenList?: TokenList;
}
export default function useInitTokenList({
  tokenList,
  popularTokenList,
}: InitTokenListProps) {
  const dispatch = useDispatch<AppThunkDispatch>();
  const { account } = useWeb3React();
  const chainId = useCurrentChainId();
  // cache token list
  const { refetch } = useGetCGTokenList({
    chainId,
    skip: true,
  });

  useEffect(() => {
    const computed = async () => {
      let allTokenList = [];
      if (isArray(tokenList)) {
        allTokenList = tokenList;
      } else if (tokenList === TokenListType.Coingecko) {
        refetch();
        dispatch(setShowCoingecko(true));
        allTokenList = [...(popularTokenList ?? [])];
      } else if (tokenList === TokenListType.All) {
        refetch();
        dispatch(setShowCoingecko(true));
        allTokenList = unionBy(popularTokenList, defaultTokens, (token) =>
          token.address.toLowerCase(),
        );
      } else {
        dispatch(setShowCoingecko(false));
        allTokenList = unionBy(popularTokenList, defaultTokens, (token) =>
          token.address.toLowerCase(),
        );
      }
      dispatch(setTokenList(allTokenList));
    };
    computed();
  }, [tokenList, dispatch, popularTokenList]);

  useEffect(() => {
    dispatch(setTokenBalances({}));
  }, [account, chainId]);

  useEffect(() => {
    dispatch(setPopularTokenList(popularTokenList ?? []));
  }, [popularTokenList, dispatch]);
}
