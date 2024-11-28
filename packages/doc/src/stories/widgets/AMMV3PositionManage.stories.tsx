import { SwapWidgetApi } from '@dodoex/api';
import { AMMV3PositionManage, SwapWidgetProps, Widget } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/AMMV3PositionManage',
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
    <Widget {...config} {...other} apikey={apiKey}>
      <AMMV3PositionManage
        chainId={11155111}
        baseToken={{
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          decimals: 18,
          symbol: 'ETH',
          name: 'ETH',
          chainId: 11155111,
          // chainId: 1,
        }}
        quoteToken={{
          address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
          // address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 6,
          symbol: 'USDC',
          name: 'USDC',
          chainId: 11155111,
          // chainId: 1,
        }}
        // feeAmount={500}
        // tokenId={'25235'}
        feeAmount={10000}
        tokenId={'26887'}
        onClose={() => window.alert('onClose')}
      />
    </Widget>
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
  // onlyChainId: 1,
};
