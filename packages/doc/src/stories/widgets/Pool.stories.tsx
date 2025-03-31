import { SwapWidgetApi } from '@dodoex/api';
import { PoolWidget, SwapWidgetProps } from '@dodoex/widgets';
import { Box } from '@dodoex/components';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // height: 900,
        overflow: 'hidden',
      }}
    >
      <PoolWidget
        {...config}
        tokenList={[
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
                name: 'wonkaswap.xyz',
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
                name: 'wonkaswap.xyz',
              },
            ],
            funcLabels: [],
            attributeLabels: [],
          },
          {
            name: 'MTK',
            address: '0x4f59b88556c1B133939b2655729Ad53226ed5FAD',
            symbol: 'MTK',
            decimals: 18,
            slippage: null,
            chainId: 10143,
            logoImg:
              'https://images.dodoex.io/GpbsR9irReXLCC1Tgq3MvS09pA_Ac2GqnWrMCBsQRE4/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy8xMDE0My8weDRmNTliODg1NTZjMWIxMzM5MzliMjY1NTcyOWFkNTMyMjZlZDVmYWQ.webp',
            tokenlists: [
              {
                name: 'All',
                status: 'launched',
              },
            ],
            domains: [
              {
                name: 'wonkaswap.xyz',
              },
            ],
            funcLabels: [],
            attributeLabels: [],
          },
          {
            name: 'MTK2',
            address: '0x973CAFEDB651D710CD1890ebc5C207D836BA5E9F',
            symbol: 'MTK2',
            decimals: 18,
            slippage: null,
            chainId: 10143,
            logoImg:
              'https://images.dodoex.io/iJAnev4ye1v-NeAInZVM7G4E6aex6zsAO4UEI29jUnY/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy8xMDE0My8weDk3M2NhZmVkYjY1MWQ3MTBjZDE4OTBlYmM1YzIwN2Q4MzZiYTVlOWY.webp',
            tokenlists: [
              {
                name: 'All',
                status: 'launched',
              },
            ],
            domains: [
              {
                name: 'wonkaswap.xyz',
              },
            ],
            funcLabels: [],
            attributeLabels: [],
          },
        ]}
        {...other}
        apikey={apiKey}
      />
    </Box>
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
  onlyChainId: 10143,
};
