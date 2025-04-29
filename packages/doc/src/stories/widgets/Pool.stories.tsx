import { SwapWidgetApi } from '@dodoex/api';
import { PoolWidget, SwapWidgetProps } from '@dodoex/widgets';
import { Web3Provider } from '@ethersproject/providers';
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalProvider,
} from '@web3modal/ethers5/react';
import React, { useMemo } from 'react';

// 1. Get projectId
const projectId = '3c0b09fae76fbc7d8d8c04221441d6fd';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/'],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId,
});

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
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const ethersProvider = useMemo(() => {
    if (!walletProvider) return undefined;
    return new Web3Provider(walletProvider);
  }, [walletProvider]);

  return (
    <PoolWidget
      {...config}
      colorMode="dark"
      tokenList={[
        {
          address: '0x7D381e6a9c23A0E6969658f6B8Eba57A4Dbf93a0',
          symbol: 'USDT',
          name: 'USDT',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0xf86Ed431954d101eaC10F3eBC19E6EaeD1291365',
          symbol: 'test',
          name: 'test',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0x163D876AF3949f45D934870a1783A040Cf717Bc5',
          symbol: 'uni_test2',
          name: 'test',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0xac4D957b99482C0309717FDd8fA779f3FEE5c309',
          symbol: 'uni_test1',
          name: 'test',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          symbol: 'ETH',
          name: 'ETH',
          decimals: 18,
          chainId: 11155111,
        },
        {
          address: '0x7B07164ecFaF0F0D85DFC062Bc205a4674c75Aa0',
          symbol: 'WETH',
          name: 'WETH',
          decimals: 18,
          chainId: 11155111,
        },
      ]}
      {...other}
      apikey={apiKey}
      provider={ethersProvider}
      onConnectWalletClick={() => {
        open();
        return true;
      }}
    />
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
  routerPage: undefined,
  supportAMMV2: true,
  supportAMMV3: true,
  notSupportPMM: false,
  onlyChainId: 11155111,
  noUI: true,
};
