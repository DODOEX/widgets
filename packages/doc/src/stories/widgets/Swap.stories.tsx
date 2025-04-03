import { SwapWidget } from '@dodoex/widgets';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Widgets/Swap',
  component: 'div',
};

export const Primary = (props: any) => {
  const { projectId, apiKey, ...other } = props;

  return <SwapWidget {...other} apikey={apiKey} />;
};

Primary.args = {
  apiKey: 'ef9apopzq9qrgntjubojbxe7hy4z5eez',
  popularTokenList: [],
  tokenList: [
    {
      address: '0x42EDf453F8483c7168c158d28D610A58308517D1',
      symbol: 'MOMO',
      name: 'Momodrome',
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
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
      chainId: 2810,
    },
  ],
  crossChain: false,
  onlyChainId: 2810,
};
