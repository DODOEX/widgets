import { ChainId } from '@dodoex/api';
import { Ve33PoolDetailWidget, WidgetProps } from '@dodoex/widgets';

export default {
  title: 'Widgets/Ve33PoolDetail',
  component: 'div',
};

export const Primary = (props: WidgetProps) => {
  const { apikey, ...other } = props;

  return (
    <Ve33PoolDetailWidget
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
      apikey={apikey}
      id="0x98ecc0d3f774a7bda38918bf5830a476dd5a606c"
      chainId={ChainId.MORPH_HOLESKY_TESTNET}
      onClickGoBack={() => {
        window.alert('onClickGoBack');
      }}
    />
  );
};

Primary.args = {
  projectId: 'project2',
  apikey: 'ee53d6b75b12aceed4',
  apiDomain: process.env.STORYBOOK_API_DOMAIN,
  width: '100%',
  height: '100%',
  routerPage: undefined,
  onlyChainId: ChainId.MORPH_HOLESKY_TESTNET,
  noUI: true,
};
