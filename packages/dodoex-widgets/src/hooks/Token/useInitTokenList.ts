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

  useEffect(() => {
    const computed = async () => {
      let allTokenList = [];
      if (isArray(tokenList)) {
        allTokenList = tokenList;
      } else {
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
