import { ChainId } from '@dodoex/api';
import { Box } from '@dodoex/components';
import {
  Ve33LockOperate,
  Ve33LockList,
  Widget,
  WidgetProps,
} from '@dodoex/widgets';

export default {
  title: 'Widgets/Ve33Lock',
  component: 'div',
};

export const Primary = (props: WidgetProps) => {
  const { apikey, ...other } = props;

  return (
    <Widget
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
      chainId={ChainId.MORPH_HOLESKY_TESTNET}
      onClickGoBack={() => {
        window.alert('onClickGoBack');
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <Ve33LockOperate />
        <Ve33LockList />
      </Box>
    </Widget>
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
