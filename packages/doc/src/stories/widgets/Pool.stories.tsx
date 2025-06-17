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
      colorMode="dark"
      tokenList={[
        {
          name: 'Wrapped Bera',
          address: '0x6969696969696969696969696969696969696969',
          symbol: 'WBERA',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/epFXAa1slm_aY42rqEjl4CJIJONpxS7bihgOoViGHRU/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weDY5Njk2OTY5Njk2OTY5Njk2OTY5Njk2OTY5Njk2OTY5Njk2OTY5Njk.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'BERA',
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          symbol: 'BERA',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/Lji3Q61bl9ZED9ydYWQoi5timdzxknvE_MBYjJk9HSI/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWU.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [
            {
              key: 'non-standard-erc20',
            },
          ],
        },
        {
          name: 'henlo',
          address: '0xb2F776e9c1C926C4b2e54182Fac058dA9Af0B6A5',
          symbol: 'HENLO',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/ChKIdIwCV95nHLx6Xs2CTUs6Zhnv2fB5_Bth8pvFfgI/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weGIyZjc3NmU5YzFjOTI2YzRiMmU1NDE4MmZhYzA1OGRhOWFmMGI2YTU.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'Honey',
          address: '0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce',
          symbol: 'HONEY',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/hd7rQKrISESlAWvU2-PYqSU-P-t9Yt1lc08F4Myo1v4/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weGZjYmQxNGRjNTFmMGE0ZDQ5ZDVlNTNjMmUwOTUwZTBiYzI2ZDBkY2U.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'the chain has a bear on it ',
          address: '0x539ACed84eBB5cbD609CFaf4047Fb78b29553dA9',
          symbol: 'BERACHAIN',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/90ZKB2iJpYTkeDwd6XBugBajKNpUhgAlbbQzoGqPqQc/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weDUzOWFjZWQ4NGViYjVjYmQ2MDljZmFmNDA0N2ZiNzhiMjk1NTNkYTk.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'Bridged USDC (Stargate)',
          address: '0x549943e04f40284185054145c6E4e9568C1D3241',
          symbol: 'USDC.e',
          decimals: 6,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/O077XqapOrY6khPfkdWER_uwRcBgAhkrQq--HOQJ9eI/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weDU0OTk0M2UwNGY0MDI4NDE4NTA1NDE0NWM2ZTRlOTU2OGMxZDMyNDE.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'Xi BERA',
          address: '0xa40E6433782Ffb18c8eEb16D201E331E37AbFB74',
          symbol: 'XI',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/zjCJSls0KHiBrcEZfsUeqEoYK-xuS4FPp6-bF7GJEek/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weGE0MGU2NDMzNzgyZmZiMThjOGVlYjE2ZDIwMWUzMzFlMzdhYmZiNzQ.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'Wrapped gBERA',
          address: '0xD77552D3849ab4D8C3b189A9582d0ba4C1F4f912',
          symbol: 'wgBERA',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/nSglOg-koQ_eVf4yO7nXvbkU_NOMGLAT6tllo_4PFik/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weGQ3NzU1MmQzODQ5YWI0ZDhjM2IxODlhOTU4MmQwYmE0YzFmNGY5MTI.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'Q5',
          address: '0x10AcD894a40d8584aD74628812525EF291e16C47',
          symbol: 'Q5',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/lI5BqlO1Q6AHiRPfxBjLfIFI8Ff2L-BG7B9392OT6rs/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weDEwYWNkODk0YTQwZDg1ODRhZDc0NjI4ODEyNTI1ZWYyOTFlMTZjNDc.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'WETH',
          address: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590',
          symbol: 'WETH',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/0uRT2yYakDMXf-sP992afyBnZqNIoBRkeew2f9x02A0/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weDJmNmYwN2NkY2YzNTg4OTQ0YmY0YzQyYWM3NGZmMjRiZjU2ZTc1OTA.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'Wrapped BTC',
          address: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
          symbol: 'WBTC',
          decimals: 8,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/Fo2rf07JDIxwKzb5pRqQioWdfafWzdgl3td1OzzBCGY/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weDA1NTVlMzBkYThmOTgzMDhlZGI5NjBhYTk0YzBkYjQ3MjMwZDJiOWM.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'Berachain MEME test token',
          address: '0x487d5EEfb8aD26bBCa2A6113A87C8893a8b63fCa',
          symbol: 'BM',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/ulhG2FDpVR9GArxoVhBqgSgIPATkpa5yQWHwA0Vj_4U/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weDQ4N2Q1ZWVmYjhhZDI2YmJjYTJhNjExM2E4N2M4ODkzYThiNjNmY2E.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'BYUSD | HONEY',
          address: '0xdE04c469Ad658163e2a5E860a03A86B52f6FA8C8',
          symbol: 'BYUSD-HONEY-STABLE',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/kyqHTnAFZOWV-mlLzHipsVn7E8lNCDMBoiJ7bufAvjQ/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weGRlMDRjNDY5YWQ2NTgxNjNlMmE1ZTg2MGEwM2E4NmI1MmY2ZmE4Yzg.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'USD₮0',
          address: '0x779Ded0c9e1022225f8E0630b35a9b54bE713736',
          symbol: 'USD₮0',
          decimals: 6,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/NARhMy04lWgYq2hZM2tEb7MyPqa_TjvvBN779WIC6aA/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weDc3OWRlZDBjOWUxMDIyMjI1ZjhlMDYzMGIzNWE5YjU0YmU3MTM3MzY.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
        {
          name: 'Bee Token',
          address: '0x93a0CB3ee34aA983db262F904021911eCD199228',
          symbol: 'BEE',
          decimals: 18,
          slippage: null,
          chainId: 80094,
          logoImg:
            'https://images.dodoex.io/rz07zQubG6s_NLrToYsLr3QfrQvZWrWLGLpliExp6Yc/rs:fit:160:160:0/g:no/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2RvZG8tbWVkaWEtc3RhZ2luZy84MDA5NC8weDkzYTBjYjNlZTM0YWE5ODNkYjI2MmY5MDQwMjE5MTFlY2QxOTkyMjg.webp',
          tokenlists: [
            {
              name: 'All',
              status: 'launched',
            },
          ],
          domains: [
            {
              name: 'wasabee.xyz',
            },
          ],
          funcLabels: [],
          attributeLabels: [],
        },
      ]}
      {...other}
      onlyChainId={80094}
      getTokenLogoUrl={(params) => {
        return `https://token-img.dodoex.io/${params?.chainId}/${params?.address?.toLocaleLowerCase()}`;
      }}
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
      {/* <AlgebraPositionManage */}
      {/*   tokenId={508} */}
      {/*   chainId={80094} */}
      {/*   border */}
      {/*   baseToken={{ */}
      {/*     chainId: 80094, */}
      {/*     address: '0x6969696969696969696969696969696969696969', */}
      {/*     symbol: 'WBERA', */}
      {/*     name: 'Wrapped Bera', */}
      {/*     decimals: 18, */}
      {/*   }} */}
      {/*   quoteToken={{ */}
      {/*     chainId: 80094, */}
      {/*     address: '0xd77552d3849ab4d8c3b189a9582d0ba4c1f4f912', */}
      {/*     symbol: 'wgBERA', */}
      {/*     name: 'wgBERA', */}
      {/*     decimals: 18, */}
      {/*   }} */}
      {/* /> */}
    </Widget>
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
  routerPage: {
    type: 'createPoolAlgebra',
  },
  supportAMMV2: true,
  supportAMMV3: true,
  onlyChainId: 80094,
};
