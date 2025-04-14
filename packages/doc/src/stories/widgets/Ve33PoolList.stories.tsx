import { ChainId } from '@dodoex/api';
import { Ve33PoolListWidget, WidgetProps } from '@dodoex/widgets';

export default {
  title: 'Widgets/Ve33PoolList',
  component: 'div',
};

export const Primary = (props: WidgetProps) => {
  const { apikey, ...other } = props;

  return (
    <Ve33PoolListWidget
      tokenList={[
        {
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          symbol: 'ETH',
          name: 'ETH',
          decimals: 18,
          chainId: ChainId.MORPH_HOLESKY_TESTNET,
        },
        {
          address: '0x5300000000000000000000000000000000000011',
          symbol: 'WETH',
          name: 'WETH',
          decimals: 18,
          chainId: ChainId.MORPH_HOLESKY_TESTNET,
        },
      ]}
      {...other}
      apikey={apikey}
      onClickPoolListRow={(id, chainId) => {
        window.alert(`${id} ${chainId}`);
      }}
    />
  );
};

Primary.args = {
  projectId: 'project2',
  apikey: 'ee53d6b75b12aceed4',
  apiDomain: process.env.STORYBOOK_API_DOMAIN,
  width: '100%',
  height: '100%',
  routerPage: undefined,
  onlyChainId: ChainId.MORPH_HOLESKY_TESTNET,
  noUI: true,
};

/**
{
    "data": {
        "ve33_getPoolList": [
            {
                "id": "0x98ecc0d3f774a7bda38918bf5830a476dd5a606c",
                "title": "V2.Volatile",
                "version": "v2",
                "gaugeAddress": "0x7b156830fdbc76d327a48a19b0143663e16a95ba",
                "feeRate": "30",
                "apr": {
                    "fees": "0",
                    "incentives": "0"
                },
                "tvl": "0",
                "totalValueLockedUSD": "0",
                "totalValueLockedToken0": "0",
                "totalValueLockedToken1": "0",
                "volumeUSD": "0",
                "volumeToken0": "0",
                "volumeToken1": "0",
                "feesUSD": "0",
                "feesToken0": "0",
                "feesToken1": "0",
                "token0Address": "0x42edf453f8483c7168c158d28d610a58308517d1",
                "token0Name": "Momodrome",
                "token0Symbol": "MOMO",
                "token0Decimals": 18,
                "token1Address": "0x5300000000000000000000000000000000000011",
                "token1Name": "Wrapped Ether",
                "token1Symbol": "WETH",
                "token1Decimals": 18
            },
            {
                "id": "0x2f63a87bf42dc4c021af8be085cece16269e3b67",
                "title": "V3.CL=200",
                "version": "v3",
                "gaugeAddress": "0x640be2253a65740152dc933fab757606e9c7bd52",
                "feeRate": "3000",
                "apr": {
                    "fees": "0",
                    "incentives": "0"
                },
                "tvl": "0",
                "totalValueLockedUSD": "0",
                "totalValueLockedToken0": "0",
                "totalValueLockedToken1": "0",
                "volumeUSD": "0",
                "volumeToken0": "0",
                "volumeToken1": "0",
                "feesUSD": "0",
                "feesToken0": "0",
                "feesToken1": "0",
                "token0Address": "0x42edf453f8483c7168c158d28d610a58308517d1",
                "token0Name": "Momodrome",
                "token0Symbol": "MOMO",
                "token0Decimals": 18,
                "token1Address": "0x5300000000000000000000000000000000000011",
                "token1Name": "Wrapped Ether",
                "token1Symbol": "WETH",
                "token1Decimals": 18
            }
        ]
    }
}
 */
