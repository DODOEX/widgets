import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unionBy } from 'lodash';
import {
  getDefaultChainId,
  getLatestBlockNumber,
} from '../../store/selectors/wallet';
import { AppThunkDispatch } from '../../store/actions';
import {
  setPopularTokenList,
  setTokenBalances,
  setTokenList,
} from '../../store/actions/token';
import {
  useFetchTokens,
  useFetchETHBalance,
  useFetchBlockNumber,
} from '../contract';
import { TokenList } from './type';
import { useCurrentChainId } from '../ConnectWallet';
import { useGetCGTokenList } from './useGetCGTokenList';

export interface InitTokenListProps {
  tokenList?: TokenList;
  popularTokenList?: TokenList;
}
export default function useInitTokenList({
  tokenList,
  popularTokenList: popularTokenListProps,
}: InitTokenListProps) {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [tokenListOrigin, setTokenListOrigin] = useState<TokenList>([]);
  const { account } = useWeb3React();
  const chainId = useCurrentChainId();
  const { cgTokenList } = useGetCGTokenList();
  const blockNumber = useSelector(getLatestBlockNumber);

  const popularTokenList = useMemo(() => {
    return (
      popularTokenListProps?.filter((token) => token.chainId === chainId) || []
    );
  }, [popularTokenListProps, chainId]);

  const checkTokenAddresses = useMemo(() => {
    const res = tokenListOrigin.map(({ address }) => address);
    popularTokenListProps?.forEach(({ address }) => {
      if (!res.includes(address)) {
        res.push(address);
      }
    });
    return res;
  }, [tokenListOrigin, popularTokenListProps]);

  useFetchTokens({
    addresses: checkTokenAddresses,
    // addresses: ['0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2'], // TODO: DELETE
    blockNumber,
  });

  useEffect(() => {
    const computed = async () => {
      let allTokenList = [] as TokenList;
      if (tokenList) {
        allTokenList = tokenList;
      } else {
        const defaultTokenList = await import('../../constants/tokenList');
        const combinedTokenList = cgTokenList.toArray().concat(defaultTokenList.default);
        allTokenList = unionBy(
          combinedTokenList as TokenList,
          popularTokenList, 'address');
      }
      const defaultChainId = chainId;
      const currentChainTokenList = allTokenList.filter(
        (token) => token.chainId === defaultChainId,
      );
      setTokenListOrigin(currentChainTokenList);
      dispatch(setTokenList(currentChainTokenList));
    };
    computed();
  }, [tokenList, dispatch, chainId, cgTokenList, popularTokenList]);

  useEffect(() => {
    dispatch(setTokenBalances({}));
  }, [account, chainId]);

  useEffect(() => {
    dispatch(setPopularTokenList(popularTokenList));
  }, [popularTokenList, dispatch]);
}
