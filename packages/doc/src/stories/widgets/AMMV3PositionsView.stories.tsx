import { SwapWidgetApi } from '@dodoex/api';
import { AMMV3PositionsView, SwapWidgetProps, Widget } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/AMMV3PositionsView',
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
      <AMMV3PositionsView
        chainId={11155111}
        baseToken={{
          address: '0x8f2a9f23d5d70226491B0c10365dE88f64cD4a01',
          decimals: 18,
          symbol: 'TK1A',
          name: 'token1A',
          chainId: 11155111,
          // chainId: 1,
        }}
        quoteToken={{
          address: '0xd05553BC85FA8c004073d91097B7611CD5E478f5',
          // address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 6,
          symbol: 'USDT-A',
          name: 'usdtA',
          chainId: 11155111,
          // chainId: 1,
        }}
        feeAmount={100}
        onClose={() => window.alert('onClose')}
        handleGoToAddLiquidityV3={() =>
          window.alert('handleGoToAddLiquidityV3')
        }
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
