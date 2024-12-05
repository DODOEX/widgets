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
          address: '0x163D876AF3949f45D934870a1783A040Cf717Bc5',
          decimals: 18,
          symbol: 'uni_test2',
          name: 'uni_test2',
          chainId: 11155111,
        }}
        quoteToken={{
          address: '0x444d30Eeb001Dc8B7B96cEF088381418B82f9441',
          decimals: 6,
          symbol: 'uni_test3',
          name: 'uni_test3',
          chainId: 11155111,
        }}
        feeAmount={500}
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
