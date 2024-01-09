import { StaticJsonRpcProvider } from '@ethersproject/providers';

const providerCacheMap = new Map<string, StaticJsonRpcProvider>();
export function getStaticJsonRpcProvider(rpcUrl: string, chainId: number) {
  if (providerCacheMap.has(rpcUrl)) {
    return providerCacheMap.get(rpcUrl) as StaticJsonRpcProvider;
  }
  const result = new StaticJsonRpcProvider(rpcUrl, chainId);
  providerCacheMap.set(rpcUrl, result);
  return result;
}
