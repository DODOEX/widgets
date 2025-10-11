import { ChainId } from '@dodoex/api';
import { Box } from '@dodoex/components';
import {
  Ve33IncentiveList,
  Ve33IncentiveDetail,
  Widget,
  WidgetProps,
} from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/Ve33Incentive',
  component: 'div',
};

export const Primary = (props: WidgetProps) => {
  const { apikey, ...other } = props;
  const [showDetail, setShowDetail] = React.useState<any>({
    id: '0x98ecc0d3f774a7bda38918bf5830a476dd5a606c',
    chainId: 2810,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Widget
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
      >
        {showDetail ? (
          <Ve33IncentiveDetail
            id={showDetail.id}
            chainId={showDetail.chainId}
            onClickGoBack={() => setShowDetail(null)}
          />
        ) : (
          <Ve33IncentiveList
            onGoIncentiveDetail={(pool) => setShowDetail(pool)}
          />
        )}
      </Widget>
    </Box>
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
