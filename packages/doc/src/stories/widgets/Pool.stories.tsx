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
          setConfig({
            ...swapWidgetProps,
            tokenList: [
              ...swapWidgetProps.tokenList,
              {
                chainId: ChainId.SEPOLIA,
                name: 'test',
                symbol: 'test',
                address: '0xf86ed431954d101eac10f3ebc19e6eaed1291365',
                decimals: 18,
              },
              {
                chainId: ChainId.SEPOLIA,
                name: 'usdt',
                symbol: 'usdt',
                address: '0x7d381e6a9c23a0e6969658f6b8eba57a4dbf93a0',
                decimals: 18,
              },
            ],
          });
        });
    }
  }, [projectId, apiKey]);
  return <PoolWidget {...config} {...other} apikey={apiKey} />;
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
  routerPage: {
    type: 'pool',
  },
  // onlyChainId: 1,
};
