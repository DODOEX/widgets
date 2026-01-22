import { ChainId, SwapWidgetApi } from '@dodoex/api';
import { Crowdpooling, SwapWidgetProps, Widget } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/Crowdpooling',
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
      <Crowdpooling />
    </Widget>
  );
};

export const CrowdpoolingList = (props: any) => {
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
    <Widget
      {...config}
      {...other}
      apikey={apiKey}
      onlyChainId={ChainId.SEPOLIA}
      routerPage={{
        type: 'crowdpoolingList',
        params: { tab: 'all' },
      }}
    >
      <Crowdpooling />
    </Widget>
  );
};

export const CrowdpoolingDetail = (props: any) => {
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
    <Widget
      {...config}
      {...other}
      apikey={apiKey}
      routerPage={{
        type: 'crowdpoolingDetail',
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

export const CrowdpoolingPoolDetail = (props: any) => {
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
    <Widget
      {...config}
      {...other}
      apikey={apiKey}
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

export const CreateCrowdpooling = (props: any) => {
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
    <Widget
      {...config}
      {...other}
      apikey={apiKey}
      routerPage={{
        type: 'createCrowdpooling',
      }}
      onlyChainId={ChainId.PHAROS_ATLANTIC_TESTNET}
      tokenList={[
        {
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          name: 'Ether',
          decimals: 18,
          symbol: 'ETH',
          chainId: ChainId.PHAROS_ATLANTIC_TESTNET,
        },
        {
          address: '0x838800b758277CC111B2d48Ab01e5E164f8E9471',
          name: 'Wrapped Ether',
          decimals: 18,
          symbol: 'WETH',
          chainId: ChainId.PHAROS_ATLANTIC_TESTNET,
        },
        {
          address: '0xE7E84B8B4f39C507499c40B4ac199B050e2882d5',
          symbol: 'USDT',
          name: 'USDT',
          decimals: 6,
          chainId: ChainId.PHAROS_ATLANTIC_TESTNET,
        },
      ]}
    >
      <Crowdpooling />
    </Widget>
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
};

CrowdpoolingList.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
};

CrowdpoolingDetail.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
};

CrowdpoolingPoolDetail.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
};

CreateCrowdpooling.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
};

export const MyCrowdpoolingList = (props: any) => {
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
    <Widget
      {...config}
      {...other}
      apikey={apiKey}
      routerPage={{
        type: 'myCrowdpoolingList',
      }}
    >
      <Crowdpooling />
    </Widget>
  );
};

MyCrowdpoolingList.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
};
