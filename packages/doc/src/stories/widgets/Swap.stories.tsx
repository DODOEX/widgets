import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SwapWidget } from '@dodoex/widgets';
import { TokenInfo } from '@dodoex/widgets/dist/src/hooks/Token/type';

export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
  GOERLI = 5,

  BSC = 56,

  HECO = 128,

  POLYGON = 137,

  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,

  AURORA = 1313161554,

  MOONRIVER = 1285,

  OKCHAIN = 66,

  OPTIMISM = 10,

  BOBA = 288,

  AVALANCHE = 43114,

  CRONOS = 25,

  // ZETACHAIN = 7000,

  ZETACHAIN_TESTNET = 7001,
}
const ChainIdObj: {
  [key in ChainId]?: keyof typeof ChainId;
} = {};
Object.keys(ChainId).forEach((key: any) => {
  const numVal = Number(ChainId[key]) as ChainId;
  if (!isNaN(numVal)) {
    ChainIdObj[numVal] = key;
  }
});

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Widgets/Swap',
  component: SwapWidget,
  argTypes: {
    defaultChainId: {
      options: Object.keys(ChainIdObj).map((key) => Number(key)),
      control: {
        type: 'select',
        labels: ChainIdObj,
      },
    },
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
} as ComponentMeta<typeof SwapWidget>;

export const Primary = (args) => <SwapWidget {...args} />;

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
    chainId: 1,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    name: 'Ether',
    decimals: 18,
    symbol: 'ETH',
    logoURI:
      'https://images.dodoex.io/prKmKP8yDTuPMHTCZ_DcxG8BqsuHNO8w5KDmJWmPodg/rs:fit:96:96:0/g:no/aHR0cHM6Ly9pbWFnZS1wcm94eS5kb2RvZXguaW8vOUVaWU1ER2ZVN3g2N3ZBZThqWkUxZzA0RExUaFhaV0JIb09wZFhpeXhHRS9hSFIwY0hNNkx5OWpaRzR0YldWa2FXRXVaRzlrYjJWNExtbHZMMlZ5WXpJd0wyaDBkSEJ6WDNNeVgyTnZhVzV0WVhKclpYUmpZWEJmWTI5dFgzTjBZWFJwWTE5cGJXZGZZMjlwYm5OZk5qUjROalJmTVRBeU4xOHhNekkyTjJGbE5EY3dMbkJ1WncucG5n.webp',
    // amount: 10,
  },
  defaultToToken: {
    chainId: 1,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USD Coin',
    decimals: 6,
    symbol: 'USDC',
    logoURI:
      'https://images.dodoex.io/sQ5dF3FkjjQUsmfqFFE5cKq-cthh4u0wUooBE5Epf-k/rs:fit:96:96:0/g:no/aHR0cHM6Ly9pbWFnZS1wcm94eS5kb2RvZXguaW8vTDlEVElLa2dONG5mRkNTSF9GMUdXU3JiZkJDa2JZRTkwbmFDS0dIWnRsby9hSFIwY0hNNkx5OWpaRzR0YldWa2FXRXVaRzlrYjJWNExtbHZMM1Z6WkdOZlpXVTFNbUV4WldReVlpOTFjMlJqWDJWbE5USmhNV1ZrTW1JdWNHNW4ucG5n.webp',
    amount: 100,
  },
  popularTokenList: [
    {
      chainId: 1,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      name: 'USD Coin',
      decimals: 6,
      symbol: 'USDC',
      logoURI:
        'https://images.dodoex.io/sQ5dF3FkjjQUsmfqFFE5cKq-cthh4u0wUooBE5Epf-k/rs:fit:96:96:0/g:no/aHR0cHM6Ly9pbWFnZS1wcm94eS5kb2RvZXguaW8vTDlEVElLa2dONG5mRkNTSF9GMUdXU3JiZkJDa2JZRTkwbmFDS0dIWnRsby9hSFIwY0hNNkx5OWpaRzR0YldWa2FXRXVaRzlrYjJWNExtbHZMM1Z6WkdOZlpXVTFNbUV4WldReVlpOTFjMlJqWDJWbE5USmhNV1ZrTW1JdWNHNW4ucG5n.webp',
    },
    {
      chainId: 1,
      address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
      name: 'Binance USD',
      decimals: 18,
      symbol: 'BUSD',
      logoURI:
        'https://images.dodoex.io/xZmadzpVOnpuq2jNG_5EGKeqMET0LU_gmfnp4VxkcxI/rs:fit:96:96:0/g:no/aHR0cHM6Ly9pbWFnZS1wcm94eS5kb2RvZXguaW8vSHQwWXZKMGNnU0lGTFM0aHExTV9jOXVITV9fMHpXaHBKSGVOQU5neTBuby9hSFIwY0hNNkx5OWpaRzR0YldWa2FXRXVaRzlrYjJWNExtbHZMMkoxYzJSZk4ySTJOalJpWWpReVpDOWlkWE5rWHpkaU5qWTBZbUkwTW1RdWNHNW4ucG5n.webp',
    },
    {
      chainId: 4,
      symbol: 'DODO',
      address: '0xeaa70c2a40820dF9D38149C84dd943CFcB562587',
      name: 'DODO',
      decimals: 18,
      source: 'dodo',
      logoURI: '',
    },
  ],
  tokenList: 'all',
  crossChain: true,
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
