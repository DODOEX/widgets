import { ChainId } from '@dodoex/api';
import { Widget, Crowdpooling } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/CrowdpoolingPoolDetail',
  component: 'div',
};

export const CrowdpoolingPoolDetail = (props: any) => {
  const { apiKey, ...other } = props;

  return (
    <Widget
      {...other}
      apikey={apiKey}
      onlyChainId={ChainId.SEPOLIA}
      routerPage={{
        type: 'crowdpoolingPoolDetail',
        params: {
          address: '0xfd222aab79f6db94e71479a66003051e52ee3d35',
          chainId: ChainId.SEPOLIA,
        },
      }}
    >
      <Crowdpooling />
    </Widget>
  );
};

CrowdpoolingPoolDetail.args = {
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
};
