/// <reference types="node" />

declare interface Window {
  env: Env;
  web3: Web3;
  ethereum: ProviderExt;
  dataLayer: Array<unknown> | null;
  isBitKeep: boolean;
  onekey: any;
  BinanceChain: any;
  celo: ProviderExt;
  NaboxWallet: ProviderExt;
  openblock: ProviderExt;
  bitkeep: {
    ethereum: ProviderExt;
  };
  $onekey: {
    ethereum: ProviderExt;
  };
  okxwallet: ProviderExt;
  kucoin: ProviderExt;
  obethereum: ProviderExt;
  frontier: {
    ethereum: ProviderExt;
  };
}

declare module 'eth-ens-namehash' {
  export function normalize(inputName: string): string;
}

declare module 'fake-indexeddb/lib/FDBKeyRange';
declare module 'fake-indexeddb';

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}

declare module 'strip-hex-prefix';
declare module 'web3-provider-engine/subproviders/hooked-wallet';
declare module 'web3-provider-engine/subproviders/rpc';
declare module 'web3-provider-engine/subproviders/cache.js';
