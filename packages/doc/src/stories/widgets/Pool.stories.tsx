import { SwapWidgetApi } from '@dodoex/api';
import {
  PoolWidget,
  SwapWidgetProps,
  Widget,
  AlgebraPositionManage,
  Pool,
} from '@dodoex/widgets';
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
    <Widget
      {...config}
      tokenList={[
        {
          decimals: 18,
          logoURI:
            'https://imgproxy-testnet.avascan.com/oP3JPRzu-mhw8raHUAJdicemAzSQyrtGduHjkG2sVC4/pr:thumb_32/aHR0cHM6Ly9jbXMtY2RuLmF2YXNjYW4uY29tL2NtczIvSE9ORVkuYmQ1ZmExOGM2YTE4LnBuZw',
          name: 'HONEY',
          address: '0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03',
          symbol: 'HONEY',
          chainId: 80084,
        },
        {
          decimals: 6,
          logoURI:
            'https://images.dodoex.io/XbtxsPIscM6p5ClHbLO0JumFHA9U23eON8-MDh-Plkg/rs:fit:96:96:0/g:no/aHR0cHM6Ly9pbWFnZS1wcm94eS5kb2RvZXguaW8vaG1nM3hRa1BUTUtkcUNFVnd0LXU4S2lwTW5od1JCdGhLYWxENW9vSWlTZy9hSFIwY0hNNkx5OXpkRzl5WVdkbExtZHZiMmRzWldGd2FYTXVZMjl0TDJSdlpHOHRiV1ZrYVdFdGMzUmhaMmx1Wnk5MWNHeHZZV1JmYVcxblh6UXlNRFEyTkRaZk1qQXlNakEwTWpJd01UQTFNekF4TmpVdWNHNW4ucG5n.webp',
          name: 'USD Coin',
          address: '0xd6D83aF58a19Cd14eF3CF6fe848C9A4d21e5727c',
          symbol: 'USDC',
          chainId: 80084,
        },
        {
          chainId: 80084,
          address: '0xE28AfD8c634946833e89ee3F122C06d7C537E8A8',
          name: 'Wrapped Ether',
          decimals: 18,
          symbol: 'WETH',
          logoURI:
            'https://images.dodoex.io/mI69kq-S-tNT1W57qYizPd5r2WNFzpAq5y6NhOcrTkY/rs:fit:96:96:0/g:no/aHR0cHM6Ly9pbWFnZS1wcm94eS5kb2RvZXguaW8vVEZhSVNLVVZIWThLTVhyTkVmZDRXRUJmMGJoSHRweHY3Q1hDT0dKbGY2by9hSFIwY0hNNkx5OWpaRzR0YldWa2FXRXVaRzlrYjJWNExtbHZMMlZ5WXpJd0wyeHZaMjlmT0dVeFpEaG1PVEEyWlM1d2JtYy5wbmc.webp',
        },
        {
          chainId: 80084,
          address: '0x2577D24a26f8FA19c1058a8b0106E2c7303454a4',
          name: 'Wrapped BTC',
          decimals: 8,
          symbol: 'WBTC',
          logoURI:
            'https://images.dodoex.io/n4n7ccBom2tgcZNN0jBv9YiTq5qGMjX6PHO0YGlpzZo/rs:fit:96:96:0/g:no/aHR0cHM6Ly9pbWFnZS1wcm94eS5kb2RvZXguaW8vMElrSkQzVEc2SkFQdG1DV24tNnhfa0ozS3lXYXlVVHRhZ19PQmF0TFEwRS9hSFIwY0hNNkx5OWpaRzR0YldWa2FXRXVaRzlrYjJWNExtbHZMMWRDVkVOZmFXTnZibDgzWW1JelpUQTRaak14TDFkQ1ZFTmZhV052Ymw4M1ltSXpaVEE0WmpNeExuQnVady5wbmc.webp',
        },
        {
          decimals: 18,
          logoURI:
            'https://imgproxy-testnet.avascan.com/vR2RHZ04yHbMN2I13_cmz-fbzFYfCI4_e61WV5fbmNs/pr:thumb_32/aHR0cHM6Ly9jbXMtY2RuLmF2YXNjYW4uY29tL2NtczIvQkVSQS45MjBjMGJiZTM1MWEucG5n',
          name: 'Wrapped Bera',
          address: '0x7507c1dc16935B82698e4C63f2746A2fCf994dF8',
          symbol: 'WBERA',
          chainId: 80084,
        },
        {
          chainId: 80084,
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          name: 'BERA',
          decimals: 18,
          symbol: 'BERA',
          logoURI:
            'https://imgproxy-testnet.avascan.com/vR2RHZ04yHbMN2I13_cmz-fbzFYfCI4_e61WV5fbmNs/pr:thumb_32/aHR0cHM6Ly9jbXMtY2RuLmF2YXNjYW4uY29tL2NtczIvQkVSQS45MjBjMGJiZTM1MWEucG5n',
        },
        {
          chainId: 80084,
          address: '0x163Ca756DE30d64393f8ca8349E0513B1E463aaC',
          name: 'Bera_test1',
          decimals: 18,
          symbol: 'Bera_test1',
        },
      ]}
      {...other}
      onlyChainId={80084}
      apikey={apiKey}
    >
      {/* <AlgebraPositionManage
        chainId={80084}
        baseToken={{
          chainId: 80084,
          address: '0xd6D83aF58a19Cd14eF3CF6fe848C9A4d21e5727c',
          name: 'USD Coin',
          decimals: 6,
          symbol: 'USDC',
          logoURI: '',
        }}
        quoteToken={{
          chainId: 80084,
          address: '0xfc5e3743E9FAC8BB60408797607352E24Db7d65E',
          name: 'Test Honeypot Finance',
          decimals: 18,
          symbol: 'tHPOT',
          logoURI: '',
        }}
        feeAmount={500}
        tokenId="2871"
        border
      /> */}
      <Pool />
    </Widget>
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
  onlyChainId: 2818,
};
