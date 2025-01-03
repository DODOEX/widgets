import { SwapWidgetApi } from '@dodoex/api';
import { MiningDetail, SwapWidgetProps, Widget } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/MiningDetail',
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
      <MiningDetail
        query={{
          mining: '0x15816C9baAf11b785DcF37F558c53F83d6c30Ef2',
          address: '0xE9a586152879f4817cb6c599E32e8f8e96BFba4c',
          chainId: 11155111,
        }}
        handleGotoMiningList={function (): void {
          throw new Error('Function not implemented.');
        }}
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
  // onlyChainId: 1,
};
