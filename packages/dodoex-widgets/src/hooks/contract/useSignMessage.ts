import { useWeb3React } from '@web3-react/core';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useCallback } from 'react';
import { useMessageState } from '../useMessageState';
import { getSignHeader } from '../../utils';
import { useUserOptions } from '../../components/UserOptionsProvider';

export function useSignMessage() {
  const { provider } = useWeb3React();
  const { account, chainId } = useWalletInfo();
  const { dappMetadata } = useUserOptions();

  const sign = useCallback(async () => {
    const timestamp = Math.ceil(Date.now() / 1000);
    const message = `${dappMetadata?.name ?? 'DEX'}:${timestamp}`;
    let signature = '';

    try {
      signature = await provider!.getSigner().signMessage(message);
    } catch (e: any) {
      console.error(e);
      if (e.message) {
        if (e.code === 4001 || e.message.indexOf('user rejected') > -1) {
        } else {
          useMessageState.getState().toast({
            message: `Sign error: ${e.message}`,
            type: 'error',
          });
        }
        throw e;
      }
    }

    return signature;
  }, [account, chainId, provider]);

  const signHeader = useCallback(async () => {
    const timestamp = Math.ceil(Date.now() / 1000);
    const message = `${dappMetadata?.name ?? 'DEX'}:${timestamp}`;
    let signature = '';

    try {
      signature = await provider!.getSigner().signMessage(message);
    } catch (e: any) {
      console.error(e);
      if (e.message) {
        if (e.code === 4001 || e.message.indexOf('user rejected') > -1) {
        } else {
          useMessageState.getState().toast({
            message: `Sign error: ${e.message}`,
            type: 'error',
          });
        }
        throw e;
      }
    }

    return getSignHeader({
      address: account!,
      signature,
      timestamp,
      message,
      chainId,
    });
  }, []);

  return {
    sign,
    signHeader,
  };
}
