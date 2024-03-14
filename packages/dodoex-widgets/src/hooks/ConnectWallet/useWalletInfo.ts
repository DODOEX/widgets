import { useWeb3React } from '@web3-react/core';
import { useSelector } from 'react-redux';
import { getDefaultChainId } from '../../store/selectors/wallet';

export function useWalletInfo() {
  const { account, chainId } = useWeb3React();
  const defaultChainId = useSelector(getDefaultChainId);

  return {
    account,
    chainId: chainId || defaultChainId,
    connectedChainId: chainId,
    defaultChainId,
  };
}
