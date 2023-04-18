import type {
  ExternalProvider,
  JsonRpcFetchFunc,
  JsonRpcProvider,
} from '@ethersproject/providers';

export async function convertWeb3Provider(
  provider: ExternalProvider | JsonRpcFetchFunc,
) {
  const { Web3Provider } = await import(
    /* webpackChunkName: "@ethersproject/providers" */ '@ethersproject/providers'
  );
  return new Web3Provider(provider) as JsonRpcProvider;
}
