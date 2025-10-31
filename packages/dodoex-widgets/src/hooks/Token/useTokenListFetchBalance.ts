import { useMemo } from 'react';
import { chainListMap } from '../../constants/chainList';
import { useFetchTokens } from '../contract';
import useFetchMultiTokensForSingleChain from '../contract/useFetchMultiTokensForSingleChain';
import { useGlobalState } from '../useGlobalState';
import { TokenInfo, TokenList } from './type';

export default function useTokenListFetchBalance({
  chainId,
  value,
  tokenList,
  popularTokenList,
  visible,
  defaultLoadBalance,
}: {
  chainId: number;
  value?: TokenInfo | null | Array<TokenInfo>;
  // 单一链
  tokenList: TokenList;
  popularTokenList?: TokenList;
  visible?: boolean;
  defaultLoadBalance?: boolean;
}) {
  const { latestBlockNumber: blockNumber } = useGlobalState();

  const chain = chainListMap.get(chainId);
  const isBtcOrSolanaOrSuiOrTon =
    chainListMap.get(chainId)?.isBTCChain ||
    chain?.isSolanaChain ||
    chain?.isSUIChain ||
    chain?.isTONChain;

  // BTC or Solana or SUI or TON
  const tokenInfoMap = useFetchTokens({
    tokenList: isBtcOrSolanaOrSuiOrTon ? tokenList : [],
    skip: visible === false && !defaultLoadBalance,
  });

  // EVM
  const multiTokenInfoMap = useFetchMultiTokensForSingleChain({
    chainId,
    tokenList: isBtcOrSolanaOrSuiOrTon ? [] : tokenList,
    skip: visible === false && !defaultLoadBalance,
  });

  const selectTokenList = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => item);
    return [value];
  }, [value]);

  const selectedTokenInfoMap = useFetchTokens({
    tokenList: selectTokenList,
    blockNumber,
  });

  // Merge all token info maps
  const mergedTokenInfoMap = useMemo(() => {
    const merged = new Map();

    // Add BTC/Solana/SUI/TON tokens
    tokenInfoMap.forEach((value, key) => {
      merged.set(key, value);
    });

    // Add EVM tokens
    multiTokenInfoMap.forEach((value, key) => {
      merged.set(key, value);
    });

    // Add selected tokens (overwrite if exists)
    selectedTokenInfoMap.forEach((value, key) => {
      merged.set(key, value);
    });

    return merged;
  }, [tokenInfoMap, multiTokenInfoMap, selectedTokenInfoMap]);

  return mergedTokenInfoMap;
}
