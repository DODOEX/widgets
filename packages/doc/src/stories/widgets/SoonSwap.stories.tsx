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
  theme: {
    palette: {
      mode: 'light',
      primary: {
        main: '#1A1A1B',
      },
      secondary: {
        main: '#FFE804',
        contrastText: '#1A1A1B',
      },
      error: {
        main: '#EC5A7D',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: '#B15600',
        contrastText: '#1A1A1B',
      },
      success: {
        main: '#2FBA90',
        contrastText: '#1A1A1B',
      },
      purple: {
        main: '#6851B4',
        contrastText: '#1A1A1B',
      },
      background: {
        default: '#F9F6E8',
        paper: '#FFFFFF',
        paperContrast: '#F6F6F6',
        paperDarkContrast: 'rgba(26, 26, 27, 0.1)',
        backdrop: 'rgba(0, 0, 0, 0.9)',
        input: '#F0F0F0',
        tag: 'rgba(26, 26, 27, 0.04)',
      },
      text: {
        primary: '#1A1A1B',
        secondary: 'rgba(26, 26, 27, 0.5)',
        disabled: 'rgba(26, 26, 27, 0.3)',
        placeholder: 'rgba(26, 26, 27, 0.3)',
        link: '#1A1A1B',
      },
      border: {
        main: 'rgba(26, 26, 27, 0.1)',
        light: 'rgba(26, 26, 27, 0.3)',
        disabled: 'rgba(26, 26, 27, 0.1)',
      },
      hover: {
        default: 'rgba(26, 26, 27, 0.1)',
      },
    },
  },
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
