import { ChainId, SwapWidgetApi } from '@dodoex/api';
import { PoolWidget, SwapWidgetProps } from '@dodoex/widgets';
import { NATIVE_MINT } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import React from 'react';

export default {
  title: 'Widgets/Pool',
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
    <PoolWidget
      {...config}
      tokenList={[
        {
          decimals: 9,
          name: 'SOL',
          address: PublicKey.default.toBase58(),
          symbol: 'SOL',
          chainId: ChainId.SOON_TESTNET,
        },
        {
          decimals: 9,
          name: 'Wrapped SOL',
          address: NATIVE_MINT.toBase58(),
          symbol: 'WSOL',
          chainId: ChainId.SOON_TESTNET,
        },
        {
          decimals: 9,
          name: 'SOON Training Token',
          address: '4wnJ7T4w92YM3Taet7DtTUMquDv8HDkktQbpbAH5itHz',
          symbol: 'TRAINING',
          chainId: ChainId.SOON_TESTNET,
        },
        {
          decimals: 9,
          name: 'SOON Training1 Token',
          address: '5FLzARYothWbBDeiJAqwzusz4hM2ah4QrGxXW6X4RRWZ',
          symbol: 'TRAINING1',
          chainId: ChainId.SOON_TESTNET,
        },
      ]}
      {...other}
      apikey={apiKey}
    />
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  apiDomain: process.env.STORYBOOK_API_DOMAIN,
  colorMode: 'dark',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
  routerPage: undefined,
  notSupportPMM: true,
  supportAMMV2: true,
  supportAMMV3: false,
  onlySolana: true,
  onlyChainId: ChainId.SOON_TESTNET,
};
