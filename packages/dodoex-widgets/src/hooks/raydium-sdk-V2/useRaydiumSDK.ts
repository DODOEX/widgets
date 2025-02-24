import { Raydium } from '@raydium-io/raydium-sdk-v2';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { initSdk } from './config';

export const useRaydiumSDK = () => {
  const { connection } = useConnection();
  const { solanaWallet, chainId } = useWalletInfo();

  const [sdkInstance, setSdkInstance] = useState<Raydium | undefined>(
    undefined,
  );

  useEffect(() => {
    let mounted = true;
    const initSDK = async () => {
      try {
        const raydiumSDK = await initSdk({
          chainId,
          walletConnection: connection,
          wallet: solanaWallet,
        });

        if (mounted) {
          setSdkInstance(raydiumSDK);
        }
      } catch (error) {
        console.error('初始化 Raydium SDK 失败:', error);
      }
    };

    initSDK();

    return () => {
      mounted = false;
    };
  }, [chainId, connection, solanaWallet]);

  return sdkInstance;
};
