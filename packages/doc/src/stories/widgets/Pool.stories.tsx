import { ChainId, SwapWidgetApi } from '@dodoex/api';
import { PoolWidget, SwapWidgetProps } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/Pool',
  component: 'div',
};

export const Primary = (props: any) => {
  const [config, setConfig] = React.useState<SwapWidgetProps>({});
  const { projectId, apiKey, ...other } = props;
  React.useEffect(() => {
    if (projectId && apiKey) {
      const dodoService = new SwapWidgetApi();
      dodoService
        .getConfigSwapWidgetProps(projectId, apiKey)
        .then(({ swapWidgetProps }) => {
          setConfig(swapWidgetProps);
        });
    }
  }, [projectId, apiKey]);

  return (
    <PoolWidget
      {...config}
      tokenList={[
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
      ]}
      {...other}
      apikey={apiKey}
    />
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
  routerPage: undefined,
  supportAMMV2: true,
  supportAMMV3: true,
  onlyChainId: ChainId.PHAROS_TESTNET,
};
