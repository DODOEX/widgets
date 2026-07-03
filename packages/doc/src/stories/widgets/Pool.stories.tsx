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
  supportChainIds: [
    1, 42161, 137, 56, 10, 43114, 1313161554, 1030, 8453, 59144, 534352, 169,
    5000, 200901, 48900, 196, 543210, 177, 43111, 988, 421614, 53457, 173
  ],
  // onlyChainId: 688689,
  showSubmissionSubmittedDialog: true,
  // onlyChainId: 1,
  // LP fee reward (liquidity mining) activity demo config.
  // The per-pool 🔥 badge / "Mining Only" filter is driven by the liquidity
  // list's `apy.lpFeeRewardApy`; the banner reward comes from
  // `lp_fee_reward_getUserReward` (needs a connected wallet).
  lpFeeRewardActivity: {
    activity: 'pharos_amm_v3_lp_fee_reward',
    title: 'FBTC Liquidity Mining',
    description: 'Earn extra $PROS from Jul 01 to Jul 25.',
    viewMoreLink: 'https://dodoex.io',
    rewardTokenSymbol: 'PROS',
    rewardTokenLogo:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    myRewardsTooltip:
      'Rewards are settled daily and can be claimed once the activity ends.',
  },
};
