import { PoolWidget, SwapWidgetProps } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/Pool',
  component: 'div',
};

export const Primary = (props: any) => {
  const [config, setConfig] = React.useState<SwapWidgetProps>({
    onlyChainId: 47763,
    defaultChainId: 47763,
  });
  const { projectId, apiKey, ...other } = props;

  return (
    <PoolWidget
      {...config}
      tokenList={[
        {
          name: 'GAS',
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          symbol: 'GAS',
          decimals: 18,
          slippage: null,
          chainId: 47763,
          logoImg:
            'https://images.dodoex.io/3TUICHDN70nzD1-YhHxYv4MOsPRURNYCfcNmGhsSD7I/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHhlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVl.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'neox2',
          address: '0x817Ef21419B6E8F2e98cFb3F51fF73E9C3dF8b2e',
          symbol: 'neox2',
          decimals: 18,
          slippage: null,
          chainId: 47763,
          logoImg:
            'https://images.dodoex.io/2bBCVTLPccsdjs9f2wkueMw4KhXso3orQ9xsVm5zYgg/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHg4MTdlZjIxNDE5YjZlOGYyZTk4Y2ZiM2Y1MWZmNzNlOWMzZGY4YjJl.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'neox1',
          address: '0x93a0CB3ee34aA983db262F904021911eCD199228',
          symbol: 'neox1',
          decimals: 18,
          slippage: null,
          chainId: 47763,
          logoImg:
            'https://images.dodoex.io/lcfdqmeaQM9wZUuErdKUWMx8d7emL_TjwG7TJzQmuTk/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHg5M2EwY2IzZWUzNGFhOTgzZGIyNjJmOTA0MDIxOTExZWNkMTk5MjI4.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'neox3',
          address: '0x153BAA6C0d52d5d8B1D68f8F90D6cE20a595dc4F',
          symbol: 'neox3',
          decimals: 18,
          slippage: null,
          chainId: 47763,
          logoImg:
            'https://images.dodoex.io/PnSWKELh9a7Lj_rkxykc5Xej0V3amzmZiEMUC6PF-4U/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHgxNTNiYWE2YzBkNTJkNWQ4YjFkNjhmOGY5MGQ2Y2UyMGE1OTVkYzRm.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'WGAS',
          address: '0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF',
          symbol: 'WGAS10',
          decimals: 18,
          slippage: null,
          chainId: 47763,
          logoImg:
            'https://images.dodoex.io/lyK1GbuQyYIgO7GnqcWvtYpZGk_GVGzqzlqUH_OHs9M/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy9kZXYvNDc3NjMvMHhkZTQxNTkxZWQxZjhlZDE0ODRhYzJjZDhjYTA4NzY0MjhkZTYwZWZm.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [],
          funcLabels: [],
          attributeLabels: [],
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
  // onlyChainId: 1,
  noUI: true,
  noSubmissionDialog: true,
};
