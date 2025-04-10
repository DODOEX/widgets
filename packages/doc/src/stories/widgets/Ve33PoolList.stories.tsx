/* eslint-disable import/no-extraneous-dependencies */
import { Ve33PoolListWidget } from '@dodoex/widgets';

export default {
  title: 'Widgets/Ve33PoolList',
  component: 'div',
};

export const Primary = (props: any) => {
  const { projectId, apiKey, ...other } = props;

  return (
    <Ve33PoolListWidget
      tokenList={[
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
      ]}
      {...other}
      apikey={apiKey}
    />
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  apiDomain: process.env.STORYBOOK_API_DOMAIN,
  width: '100%',
  height: '100%',
  routerPage: undefined,
  onlyChainId: 2810,
};
