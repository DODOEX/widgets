import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SwapWidget } from '@dodoex/widgets';
import { TokenInfo } from '@dodoex/widgets';
import { Box } from '@dodoex/components';

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

export const Primary = (args) => (
  <Box
    sx={{
      position: 'relative',
      overflowY: 'hidden',
    }}
  >
    <SwapWidget {...args} />
  </Box>
);

Primary.args = {
  apikey: 'ef9apopzq9qrgntjubojbxe7hy4z5eez',
  defaultFromToken: {
    name: 'GAS',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'GAS',
    decimals: 18,
    slippage: null,
    chainId: 47763,
    logoImg:
      'https://images.dodoex.io/3TUICHDN70nzD1-YhHxYv4MOsPRURNYCfcNmGhsSD7I/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHhlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVl.webp',
    tokenlists: [
      {
        name: 'All',
        status: 'launched',
      },
    ],
    domains: [],
    funcLabels: [],
    attributeLabels: [],
  },
  defaultToToken: {
    name: 'neox2',
    address: '0x817Ef21419B6E8F2e98cFb3F51fF73E9C3dF8b2e',
    symbol: 'neox2',
    decimals: 18,
    slippage: null,
    chainId: 47763,
    logoImg:
      'https://images.dodoex.io/2bBCVTLPccsdjs9f2wkueMw4KhXso3orQ9xsVm5zYgg/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHg4MTdlZjIxNDE5YjZlOGYyZTk4Y2ZiM2Y1MWZmNzNlOWMzZGY4YjJl.webp',
    tokenlists: [
      {
        name: 'All',
        status: 'launched',
      },
    ],
    domains: [],
    funcLabels: [],
    attributeLabels: [],
  },
  popularTokenList: [],
  tokenList: [
    {
      name: 'GAS',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'GAS',
      decimals: 18,
      slippage: null,
      chainId: 47763,
      logoImg:
        'https://images.dodoex.io/3TUICHDN70nzD1-YhHxYv4MOsPRURNYCfcNmGhsSD7I/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHhlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVl.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'neox2',
      address: '0x817Ef21419B6E8F2e98cFb3F51fF73E9C3dF8b2e',
      symbol: 'neox2',
      decimals: 18,
      slippage: null,
      chainId: 47763,
      logoImg:
        'https://images.dodoex.io/2bBCVTLPccsdjs9f2wkueMw4KhXso3orQ9xsVm5zYgg/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHg4MTdlZjIxNDE5YjZlOGYyZTk4Y2ZiM2Y1MWZmNzNlOWMzZGY4YjJl.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'neox1',
      address: '0x93a0CB3ee34aA983db262F904021911eCD199228',
      symbol: 'neox1',
      decimals: 18,
      slippage: null,
      chainId: 47763,
      logoImg:
        'https://images.dodoex.io/lcfdqmeaQM9wZUuErdKUWMx8d7emL_TjwG7TJzQmuTk/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHg5M2EwY2IzZWUzNGFhOTgzZGIyNjJmOTA0MDIxOTExZWNkMTk5MjI4.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'neox3',
      address: '0x153BAA6C0d52d5d8B1D68f8F90D6cE20a595dc4F',
      symbol: 'neox3',
      decimals: 18,
      slippage: null,
      chainId: 47763,
      logoImg:
        'https://images.dodoex.io/PnSWKELh9a7Lj_rkxykc5Xej0V3amzmZiEMUC6PF-4U/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHgxNTNiYWE2YzBkNTJkNWQ4YjFkNjhmOGY5MGQ2Y2UyMGE1OTVkYzRm.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'WGAS',
      address: '0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF',
      symbol: 'WGAS10',
      decimals: 18,
      slippage: null,
      chainId: 47763,
      logoImg:
        'https://images.dodoex.io/lyK1GbuQyYIgO7GnqcWvtYpZGk_GVGzqzlqUH_OHs9M/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHhkZTQxNTkxZWQxZjhlZDE0ODRhYzJjZDhjYTA4NzY0MjhkZTYwZWZm.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [],
      funcLabels: [],
      attributeLabels: [],
    },
  ],
  crossChain: false,
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
  onlyChainId: 47763,
  defaultChainId: 47763,
  noPowerBy: true,
  height: '100%',
  noUI: true,
  noSubmissionDialog: true,
};
