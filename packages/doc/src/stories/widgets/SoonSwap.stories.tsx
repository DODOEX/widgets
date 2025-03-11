import { ChainId } from '@dodoex/api';
import { SoonSwapWidget, TokenInfo } from '@dodoex/widgets';
import { NATIVE_MINT } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { ComponentMeta } from '@storybook/react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Widgets/SoonSwap',
  component: SoonSwapWidget,
  argTypes: {
    defaultChainId: ChainId.SOON_TESTNET,
    colorMode: {
      options: ['light', 'dark'],
      control: { type: 'radio' },
    },
    apikey: {
      control: {
        type: 'text',
      },
    },
    width: {
      control: {
        type: 'text',
      },
    },
    height: {
      control: {
        type: 'text',
      },
    },
    locale: {
      options: ['en-US', 'zh-CN'],
      control: { type: 'radio' },
    },
    feeRate: {
      control: {
        type: 'number',
      },
    },
    rebateTo: {
      control: {
        type: 'text',
      },
    },
    onProviderChanged: {
      action: 'providerChanged',
    },
    onTxFail: {
      action: 'txFail',
    },
    onTxSubmit: {
      action: 'txSubmit',
    },
    onTxSuccess: {
      action: 'txSuccess',
    },
    onTxReverted: {
      action: 'txReverted',
    },
    onPayTokenChange: {
      action: 'payTokenChange',
    },
    onReceiveTokenChange: {
      action: 'receiveTokenChange',
    },
    onConnectWalletClick: {
      action: 'connectWalletClick',
    },
    noPowerBy: {
      control: {
        type: 'boolean',
      },
    },
  },
} as ComponentMeta<typeof SoonSwapWidget>;

export const Primary = (args) => <SoonSwapWidget {...args} />;
Primary.args = {
  apikey: 'ef9apopzq9qrgntjubojbxe7hy4z5eez',
  apiDomain: process.env.STORYBOOK_API_DOMAIN,
  colorMode: 'dark',
  defaultFromToken: {
    decimals: 9,
    name: 'SOL',
    address: PublicKey.default.toBase58(),
    symbol: 'SOL',
    chainId: ChainId.SOON_TESTNET,
  },
  defaultToToken: {
    decimals: 9,
    name: 'Wrapped SOL',
    address: NATIVE_MINT.toBase58(),
    symbol: 'WSOL',
    chainId: ChainId.SOON_TESTNET,
  },
  popularTokenList: [],
  // tokenList: 'all',
  // https://docs.soo.network/developers/nativeAssets
  tokenList: [
    {
      decimals: 9,
      name: 'SOL',
      address: PublicKey.default.toBase58(),
      symbol: 'SOL',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: 'Wrapped SOL',
      address: NATIVE_MINT.toBase58(),
      symbol: 'WSOL',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: 'SOON Training Token',
      address: '4wnJ7T4w92YM3Taet7DtTUMquDv8HDkktQbpbAH5itHz',
      symbol: 'TRAINING',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: 'SOON Training1 Token',
      address: '5FLzARYothWbBDeiJAqwzusz4hM2ah4QrGxXW6X4RRWZ',
      symbol: 'TRAINING1',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: '36LzY',
      address: '36LzY5yGXRvySE7safeHuLejhsg8mPjmPiitAQr3Axva',
      symbol: '36LzY',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: 'GLfqS',
      address: 'GLfqSuSUUB6mTA4rfk5BHYbRjQHxYknJu8pSHcMnYgzE',
      symbol: 'GLfqS',
      chainId: ChainId.SOON_TESTNET,
    },
  ],
  crossChain: false,
  onlySolana: true,
  getAutoSlippage: ({
    fromToken,
    toToken,
  }: {
    fromToken: TokenInfo | null;
    toToken: TokenInfo | null;
  }) => {
    if (!fromToken || !toToken || fromToken.chainId !== toToken.chainId) {
      return undefined;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(0.9);
      }, 1000);
    });
  },
};
