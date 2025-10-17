import { SwapWidgetApi } from '@dodoex/api';
import { AMMV3PositionManage, SwapWidgetProps, Widget } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/AMMV3PositionManage',
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
      <AMMV3PositionManage
        chainId={10143}
        baseToken={{
          chainId: 10143,
          address: '0x760afe86e5de5fa0ee542fc7b7b713e1c5425701',
          symbol: 'WMON',
          name: 'Wrapped Monad',
          decimals: 18,
        }}
        quoteToken={{
          chainId: 10143,
          address: '0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D',
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
        }}
        // feeAmount={500}
        // tokenId={'25235'}
        feeAmount={500}
        tokenId={'7'}
        onClose={() => window.alert('onClose')}
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
  tokenList: [
    {
      name: 'USD Coin',
      address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      symbol: 'USDC',
      decimals: 6,
      slippage: null,
      chainId: 10143,
      logoImg:
        'https://images.dodoex.io/MT8IF3befj6tP6lpcSq9Bcv61QpxevBWd8wRC7WErtI/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy8xMDE0My8weGY4MTcyNTdmZWQzNzk4NTNjZGUwZmE0Zjk3YWI5ODcxODFiMWU1ZWE.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [
        {
          name: 'sigmax.exchange',
        },
      ],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'PumpMONAD',
      address: '0xB32Ab373EC0d9B30D00a2b5c1487E60C9b2eD5C8',
      symbol: 'PumpMONAD',
      decimals: 18,
      slippage: null,
      chainId: 10143,
      logoImg:
        'https://images.dodoex.io/pRk_0RU-1CStIVQU46FbVAfsiAAIB3-jIXgsij3fwec/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy8xMDE0My8weGIzMmFiMzczZWMwZDliMzBkMDBhMmI1YzE0ODdlNjBjOWIyZWQ1Yzg.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [
        {
          name: 'sigmax.exchange',
        },
        {
          name: 'wonkaswap.xyz',
        },
        {
          name: 'app.dodoex.io',
        },
      ],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'Tether USD',
      address: '0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D',
      symbol: 'USDT',
      decimals: 6,
      slippage: null,
      chainId: 10143,
      logoImg:
        'https://images.dodoex.io/jk6oioN4zVyTOJ9jlu4AQNjAJcr7lxIoTCRW-Bu451I/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy8xMDE0My8weDg4YjhlMjE2MWRlZGM3N2VmNGFiNzU4NTU2OWQyNDE1YTFjMTA1NWQ.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [
        {
          name: 'sigmax.exchange',
        },
      ],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'Wrapped ETH',
      address: '0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37',
      symbol: 'WETH',
      decimals: 18,
      slippage: null,
      chainId: 10143,
      logoImg:
        'https://images.dodoex.io/Qp897BPt5etNaVtEtYmVIYrQ6fzK4XPK6e5kfFMQBJM/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy8xMDE0My8weGI1YTMwYjBmZGM1ZWE5NGE1MmZkYzQyZTNlOTc2MGNiODQ0OWZiMzc.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [
        {
          name: 'sigmax.exchange',
        },
      ],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'Wrapped BTC',
      address: '0xcf5a6076cfa32686c0Df13aBaDa2b40dec133F1d',
      symbol: 'WBTC',
      decimals: 8,
      slippage: null,
      chainId: 10143,
      logoImg:
        'https://images.dodoex.io/gezpw6qE4O3rfUyFtkZnA3xB-6NYcJQUNIirNrW6O0Q/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy8xMDE0My8weGNmNWE2MDc2Y2ZhMzI2ODZjMGRmMTNhYmFkYTJiNDBkZWMxMzNmMWQ.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [
        {
          name: 'sigmax.exchange',
        },
      ],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'MON',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'MON',
      decimals: 18,
      slippage: null,
      chainId: 10143,
      logoImg:
        'https://images.dodoex.io/RtVAjU6oDHyqSGDUo1_LGHbIfK-J0uCqMkgI9bKtXIM/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy8xMDE0My8weGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWU.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [
        {
          name: 'sigmax.exchange',
        },
      ],
      funcLabels: [],
      attributeLabels: [],
    },
    {
      name: 'WMON',
      address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
      symbol: 'WMON',
      decimals: 18,
      slippage: null,
      chainId: 10143,
      logoImg:
        'https://images.dodoex.io/d90bXxHvK0MhH99-UqjAaMFHGXqecrkrVyTO1fmo7BQ/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy8xMDE0My8weDc2MGFmZTg2ZTVkZTVmYTBlZTU0MmZjN2I3YjcxM2UxYzU0MjU3MDE.webp',
      tokenlists: [
        {
          name: 'All',
          status: 'launched',
        },
      ],
      domains: [
        {
          name: 'sigmax.exchange',
        },
      ],
      funcLabels: [],
      attributeLabels: [],
    },
  ],
  // onlyChainId: 1,
};
