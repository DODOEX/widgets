import { alpha } from '@dodoex/components';
import { SwapWidget, SwapWidgetProps } from '@dodoex/widgets';
import { TokenInfo } from '@dodoex/widgets/dist/src/hooks/Token/type';
import { Web3Provider } from '@ethersproject/providers';
import { ComponentMeta } from '@storybook/react';
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalProvider,
} from '@web3modal/ethers5/react';
import { useMemo } from 'react';

// 1. Get projectId
const projectId = '3c0b09fae76fbc7d8d8c04221441d6fd';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/'],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId,
});

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
  component: 'div',
};

export const Primary = (args) => {
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const ethersProvider = useMemo(() => {
    if (!walletProvider) return undefined;
    return new Web3Provider(walletProvider);
  }, [walletProvider]);

  return (
    <SwapWidget
      {...args}
      provider={ethersProvider}
      onConnectWalletClick={() => {
        open();
        return true;
      }}
    />
  );
};

Primary.args = {
  apikey: 'ef9apopzq9qrgntjubojbxe7hy4z5eez',
  theme: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#7BF179',
        contrastText: '#323227',
      },
      secondary: {
        main: '#7BF179',
        contrastText: '#323227',
      },
      error: {
        main: '#FF4646',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: '#B15600',
        contrastText: '#323227',
      },
      success: {
        main: '#42FF3F',
        contrastText: '#323227',
      },
      purple: {
        main: '#BC9CFF',
        contrastText: '#323227',
      },
      background: {
        default: '#0C0C0C',
        paper: '#171717',
        paperContrast: '#212221',
        paperDarkContrast: 'rgba(255, 255, 255, 0.04)',
        backdrop: 'rgba(0, 0, 0, 0.6)',
        input: '#171717',
        tag: 'rgba(255, 255, 255, 0.1)',
      },
      text: {
        primary: '#FFFFFF',
        secondary: alpha('#FFF', 0.5),
        disabled: alpha('#FFF', 0.3),
        placeholder: alpha('#FFF', 0.3),
        link: '#7BF179',
      },
      border: {
        main: '#292929',
        light: alpha('#FFF', 0.3),
        disabled: alpha('#FFF', 0.1),
      },
      hover: {
        default: 'rgba(255, 255, 255, 0.04)',
      },
      tabActive: {
        main: '#7BF179',
        contrastText: '#323227',
      },
    },
  },
  colorMode: 'dark',
  noUI: true,
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
