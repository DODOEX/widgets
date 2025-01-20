import { SwapWidgetApi } from '@dodoex/api';
import { AddLiquidityV3, SwapWidgetProps, Widget } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/AddLiquidityV3',
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
    <Widget {...config} {...other} apikey={apiKey} tokenList={'all'}>
      <AddLiquidityV3
        handleGoBack={() => window.alert('handleGoBack')}
        handleGoToPoolList={() => window.alert('handleGoToPoolList')}
        params={{
          from: '0x8f2a9f23d5d70226491b0c10365de88f64cd4a01',
          to: '0xd05553bc85fa8c004073d91097b7611cd5e478f5',
          fee: '100',
        }}
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
