import { useWeb3React } from '@web3-react/core';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getDefaultChainId } from '../../store/selectors/wallet';
import { basicTokenMap, ChainId } from '../../constants/chains';
import { getAccountBalances } from '../../store/selectors/token';
import { TokenInfo } from './type';
import BigNumber from 'bignumber.js';
import { isSameAddress } from '../../utils';
import { BIG_ALLOWANCE } from '../../constants/token';
import contractConfig from '../contract/contractConfig';

export default function useGetAllowance(
  contract: string | null,
): (token: TokenInfo) => BigNumber | null {
  const { account, chainId: currentChainId } = useWeb3React();
  const defaultChainId = useSelector(getDefaultChainId);
  const chainId = useMemo(
    () => (currentChainId ?? defaultChainId) as ChainId,
    [currentChainId, defaultChainId],
  );
  const accountBalances = useSelector(getAccountBalances);

  const getAllowance = useCallback(
    (token: TokenInfo) => {
      if (!account || !contract) return null;
      const tokenChainId: ChainId = token.chainId ?? chainId;
      const EtherToken = basicTokenMap[tokenChainId];
      if (
        token.symbol === EtherToken.symbol &&
        isSameAddress(token.address, EtherToken.address)
      )
        return new BigNumber(BIG_ALLOWANCE);
      const { DODO_APPROVE: dodoApproveAddress } =
        contractConfig[tokenChainId as ChainId] || {};
      // need fetch from fetchTokenAllowance
      if (contract !== dodoApproveAddress) return null;
      const allowances =
        accountBalances?.[token.address.toLowerCase()]?.tokenAllowances;
      return allowances ?? null;
    },
    [account, chainId, contract, accountBalances],
  );

  return getAllowance;
}
