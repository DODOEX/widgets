import { SwapWidgetApi } from '@dodoex/api';
import { PoolWidget, SwapWidgetProps } from '@dodoex/widgets';
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
          name: 'TEST1',
          address: '0x4E59c68F7216Fe96f27f47D3fA1d8306a00aB380',
          symbol: 'test1',
          decimals: 18,
          slippage: null,
          chainId: 2201,
          logoImg:
            'https://images.dodoex.io/Ie7OODKd0GDZlINrR3drPUEk4js0wnlL2mtt5U_bcsk/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvMjIwMS8weDRlNTljNjhmNzIxNmZlOTZmMjdmNDdkM2ZhMWQ4MzA2YTAwYWIzODA.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
              __typename: 'Erc20TokenListV2',
            },
          ],
          domains: [],
          funcLabels: [],
          attributeLabels: [],
          __typename: 'Erc20Erc20V2List',
        },
        {
          name: 'TEST2',
          address: '0x7af9428fC096e469Fa2583B9164f4f87Ba0F75A1',
          symbol: 'test2',
          decimals: 18,
          slippage: null,
          chainId: 2201,
          logoImg:
            'https://images.dodoex.io/4gyRfX982GJg5T_wBJhWpS50VHfjs299hY9Q5Pf5yzI/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvMjIwMS8weDdhZjk0MjhmYzA5NmU0NjlmYTI1ODNiOTE2NGY0Zjg3YmEwZjc1YTE.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
              __typename: 'Erc20TokenListV2',
            },
          ],
          domains: [],
          funcLabels: [],
          attributeLabels: [],
          __typename: 'Erc20Erc20V2List',
        },
        {
          name: 'gUSDT',
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          symbol: 'gUSDT',
          decimals: 18,
          slippage: null,
          chainId: 2201,
          logoImg:
            'https://images.dodoex.io/53IvjioP70fgSHG71f1pVIM87xf9oZuQixZ8O-oXwf8/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvMjIwMS8weGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWU.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
              __typename: 'Erc20TokenListV2',
            },
          ],
          domains: [],
          funcLabels: [],
          attributeLabels: [
            {
              key: 'non-standard-erc20',
              __typename: 'Erc20AttributeLabelV2',
            },
          ],
          __typename: 'Erc20Erc20V2List',
        },

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
  onlyChainId: 988,
  showSubmissionSubmittedDialog: true,
  // onlyChainId: 1,
};
