/// <reference types="node" />
/// <reference types="react" />

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

// NextJs
interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
}

declare module '*.avif' {
  const src: string | StaticImageData;
  export default src;
}

declare module '*.bmp' {
  const src: string | StaticImageData;
  export default src;
}

declare module '*.gif' {
  const src: string | StaticImageData;
  export default src;
}

declare module '*.jpg' {
  const src: string | StaticImageData;
  export default src;
}

declare module '*.jpeg' {
  const src: string | StaticImageData;
  export default src;
}

declare module '*.png' {
  const src: string | StaticImageData;
  export default src;
}

declare module '*.webp' {
  const src: string | StaticImageData;
  export default src;
}
declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

declare module 'strip-hex-prefix';
declare module 'web3-provider-engine/subproviders/hooked-wallet';
declare module 'web3-provider-engine/subproviders/rpc';
declare module 'web3-provider-engine/subproviders/cache.js';
