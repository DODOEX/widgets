import { SwapWidgetApi } from '@dodoex/api';
import { MiningList, SwapWidgetProps, Widget } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/MiningList',
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
      <MiningList
        handleGotoCreate={() => window.alert('view create page')}
        handleGotoDetail={({ mining, pool, chainId }) =>
          window.alert(`view detail page, ${mining}, ${pool}, ${chainId}`)
        }
        handleGotoPoolDetail={function ({
          pool,
          chainId,
        }: {
          pool: string;
          chainId: number;
        }): void {
          window.alert(`view detail page, ${pool}, ${chainId}`);
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
  // onlyChainId: 167000,
};
