import { useWeb3React } from '@web3-react/core';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getDefaultChainId } from '../../store/selectors/wallet';
import { basicTokenMap } from '../../constants/chains';
import { getAccountBalances } from '../../store/selectors/token';
import { TokenInfo } from './type';
import BigNumber from 'bignumber.js';
import { isSameAddress } from '../../utils';
import { BIG_ALLOWANCE } from '../../constants/token';

export default function useGetAllowance(
  contract: string | null,
): (token: TokenInfo) => BigNumber | null {
  const { account } = useWeb3React();
  const chainId = useSelector(getDefaultChainId);
  const accountBalances = useSelector(getAccountBalances);
  const EtherToken = useMemo(() => basicTokenMap[chainId], [chainId]);

  const getAllowance = useCallback(
    (token: TokenInfo) => {
      if (!account || !contract) return null;
      if (
        token.symbol === EtherToken.symbol &&
        isSameAddress(token.address, EtherToken.address)
      )
        return new BigNumber(BIG_ALLOWANCE);
      const allowances = accountBalances?.[token.address.toLowerCase()]?.tokenAllowances;
      return allowances ?? null;
    },
    [account, contract, EtherToken.symbol, EtherToken.address, accountBalances],
  );

  return getAllowance;
}
