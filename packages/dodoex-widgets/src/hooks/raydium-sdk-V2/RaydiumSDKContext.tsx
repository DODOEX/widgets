import { Raydium } from '@raydium-io/raydium-sdk-v2';
import { createContext, ReactNode, useContext } from 'react';
import { useRaydiumSDK } from './useRaydiumSDK';

// 创建统一的 context 来管理 SDK 实例
const RaydiumSDKContext = createContext<Raydium | undefined>(undefined);

export function RaydiumSDKProvider({ children }: { children: ReactNode }) {
  const sdkInstance = useRaydiumSDK();

  return (
    <RaydiumSDKContext.Provider value={sdkInstance}>
      {children}
    </RaydiumSDKContext.Provider>
  );
}

// 在组件中使用
export function useRaydiumSDKContext() {
  return useContext(RaydiumSDKContext);
}
