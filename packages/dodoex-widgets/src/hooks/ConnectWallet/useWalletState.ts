import { useWeb3React } from '@web3-react/core';
import React from 'react';
import useTonConnectStore from './TonConnect';

export function useWalletState({
  isTon,
}: {
  isTon?: boolean;
} = {}) {
  const web3React = useWeb3React();
  const tonConnect = useTonConnectStore();

  return React.useMemo(() => {
    if (isTon || tonConnect.enabled) {
      return {
        isTon: true,
        chainId: tonConnect.connected?.chainId,
        account: tonConnect.connected?.account,
        isMetamask: false,
        autoConnect: async (chainId?: number) => {
          if (!tonConnect.tonConnectUI) {
            await tonConnect.initialize();
          }
          if (tonConnect.tonConnectUI) {
            tonConnect.tonConnectUI.connector.restoreConnection();
          }
        },
        connect: tonConnect.connect,
        getLastBlockNumber: tonConnect.getBlockNumber,
      };
    }
    return {
      isTon: false,
      chainId: web3React.chainId,
      account: web3React.account,
      isMetamask: web3React.provider?.provider?.isMetaMask,
      autoConnect: async (chainId?: number) => {
        if (web3React.connector?.connectEagerly) {
          await web3React.connector.connectEagerly(chainId);
        } else {
          await web3React.connector.activate(chainId);
        }
      },
      connect: () => {
        return web3React.connector.deactivate
          ? web3React.connector.deactivate()
          : web3React.connector.resetState();
      },
      provider: web3React.provider,
      getLastBlockNumber: web3React.provider?.getBlockNumber,
    };
  }, [isTon, web3React, tonConnect]);
}
