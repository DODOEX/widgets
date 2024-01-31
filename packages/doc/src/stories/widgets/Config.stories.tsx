import { SwapWidget, SwapWidgetProps } from '@dodoex/widgets';
import { SwapWidgetApi } from '@dodoex/api';
import React from 'react';

export default {
  title: 'Widgets/Config',
  component: 'div',
};

export const Primary = ({
  projectId,
  apiKey,
}: {
  projectId: string;
  apiKey: string;
}) => {
  const [config, setConfig] = React.useState<SwapWidgetProps>({});
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

  return <SwapWidget {...config} apikey={apiKey} />;
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
};
