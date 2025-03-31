import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SwapWidget } from '@dodoex/widgets';
import { TokenInfo } from '@dodoex/widgets/dist/src/hooks/Token/type';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Widgets/Swap',
  component: SwapWidget,
};

export const Primary = (args) => <SwapWidget {...args} />;

Primary.args = {
  apikey: 'ef9apopzq9qrgntjubojbxe7hy4z5eez',
  popularTokenList: [],
  tokenList: [
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
      chainId: 2810,
    },
    {
      address: '0x5300000000000000000000000000000000000011',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
      chainId: 2810,
    },
  ],
  crossChain: false,
  onlyChainId: 2810,
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
