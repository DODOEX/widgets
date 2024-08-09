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
import { useWalletState } from '../ConnectWallet/useWalletState';
import { ChainId } from '../../constants/chains';

export interface InitTokenListProps {
  tokenList?: TokenList | TokenListType;
  popularTokenList?: TokenList;
}
export default function useInitTokenList({
  tokenList,
  popularTokenList,
  isTon,
}: InitTokenListProps & {
  isTon: boolean;
}) {
  const dispatch = useDispatch<AppThunkDispatch>();
  const { account } = useWalletState();
  const chainId = useCurrentChainId();

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
      if (isTon) {
        allTokenList = allTokenList.filter(
          (token) => token.chainId === ChainId.TON || token.canBridgeToTon,
        );
      }
      dispatch(setTokenList(allTokenList));
    };
    computed();
  }, [tokenList, dispatch, popularTokenList, isTon]);

  useEffect(() => {
    dispatch(setTokenBalances({}));
  }, [account, chainId]);

  useEffect(() => {
    if (isTon) {
      dispatch(
        setPopularTokenList(
          popularTokenList?.filter(
            (item) => item.chainId === ChainId.TON || item.canBridgeToTon,
          ) ?? [],
        ),
      );
    } else {
      dispatch(setPopularTokenList(popularTokenList ?? []));
    }
  }, [popularTokenList, dispatch, isTon]);
}
