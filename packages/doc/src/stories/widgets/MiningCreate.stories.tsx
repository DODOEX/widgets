import { SwapWidgetApi } from '@dodoex/api';
import { MiningCreate, SwapWidgetProps, Widget } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/MiningCreate',
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
  const dappMetadata = React.useMemo(() => {
    return {
      name: 'test dapp',
      logoUrl: 'https://app.dodoex.io/DODO.svg',
    };
  }, []);
  return (
    <Widget {...config} {...other} apikey={apiKey} dappMetadata={dappMetadata}>
      <MiningCreate
        handleGotoMiningList={() => window.alert('handleGotoMiningList')}
        handleGotoCreatePool={() => window.alert('handleGotoCreatePool')}
        handleGoBack={() => window.alert('handleGoBack')}
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
