import { SwapWidgetApi } from '@dodoex/api';
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
          address: '0x7D381e6a9c23A0E6969658f6B8Eba57A4Dbf93a0',
          symbol: 'USDT',
          name: 'USDT',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0xf86Ed431954d101eaC10F3eBC19E6EaeD1291365',
          symbol: 'test',
          name: 'test',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0x163D876AF3949f45D934870a1783A040Cf717Bc5',
          symbol: 'uni_test2',
          name: 'test',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0xac4D957b99482C0309717FDd8fA779f3FEE5c309',
          symbol: 'uni_test1',
          name: 'test',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          symbol: 'ETH',
          name: 'ETH',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0x7B07164ecFaF0F0D85DFC062Bc205a4674c75Aa0',
          symbol: 'WETH',
          name: 'WETH',
          decimals: 18,
          chainId: 11155111,
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
  // onlyChainId: 1,
};
