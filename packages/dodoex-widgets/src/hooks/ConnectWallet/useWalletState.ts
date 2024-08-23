import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useSelector } from 'react-redux';
import { ChainId } from '../../constants/chains';
import { getFromTokenChainId } from '../../store/selectors/wallet';
import useTonConnectStore from './TonConnect';

export function useWalletState({
  isTon,
}: {
  isTon?: boolean;
} = {}) {
  const web3React = useWeb3React();
  const tonConnect = useTonConnectStore();
  const fromChainId = useSelector(getFromTokenChainId);

  const autoConnect = React.useCallback(
    async (chainId?: number) => {
      if (isTon) {
        if (!tonConnect.tonConnectUI) {
          await tonConnect.initialize();
        }
        if (tonConnect.tonConnectUI) {
          tonConnect.tonConnectUI.connector.restoreConnection();
        }
      }

      if (web3React.connector?.connectEagerly) {
        await web3React.connector.connectEagerly(chainId);
      } else {
        await web3React.connector.activate(chainId);
      }
    },
    [isTon, web3React, tonConnect],
  );

  return React.useMemo(() => {
    if (fromChainId === ChainId.TON || isTon) {
      return {
        isTon: true,
        chainId: tonConnect.connected?.chainId,
        account: tonConnect.connected?.account,
        tonAccount: tonConnect.connected?.account,
        evmAccount: web3React.account,
        isMetamask: false,
        autoConnect,
        connect: tonConnect.connect,
        getLastBlockNumber: tonConnect.getBlockNumber,
        getBalance: async (account: string) => {
          const balance = await tonConnect.getBalance(account);
          return balance;
        },
      };
    }
    return {
      isTon: false,
      chainId: web3React.chainId,
      account: web3React.account,
      tonAccount: tonConnect.connected?.account,
      evmAccount: web3React.account,
      isMetamask: web3React.provider?.provider?.isMetaMask,
      autoConnect,
      connect: () => {
        return web3React.connector.deactivate
          ? web3React.connector.deactivate()
          : web3React.connector.resetState();
      },
      provider: web3React.provider,
      getLastBlockNumber: web3React.provider?.getBlockNumber,
      getBalance: web3React.provider
        ? async (account: string) => {
            const balance = await web3React.provider?.getBalance(account);
            return balance
              ? new BigNumber(balance.toString()).div(1e18)
              : balance;
          }
        : undefined,
    };
  }, [autoConnect, isTon, fromChainId, web3React, tonConnect]);
}
