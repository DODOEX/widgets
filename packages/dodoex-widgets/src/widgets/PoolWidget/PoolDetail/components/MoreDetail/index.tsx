import { Box, Tabs, TabsGroup, TabPanel } from '@dodoex/components';
import { t } from '@lingui/macro';
import React from 'react';
import { useWidgetDevice } from '../../../../../hooks/style/useWidgetDevice';
import { usePoolDetail } from '../../../hooks/usePoolDetail';
import LiquidityProvidersTable from './LiquidityProvidersTable';
import ParametersTable from './ParametersTable';
import SwapsTable from './SwapsTable';

enum MoreTab {
  parameters = 1,
  swaps,
  liquidityProviders,
}

export default function MoreDetail({
  poolDetail,
  cardBg,
}: {
  poolDetail: ReturnType<typeof usePoolDetail>['poolDetail'];
  cardBg: string;
}) {
  const { isMobile } = useWidgetDevice();
  const [moreTab, setMoreTab] = React.useState(MoreTab.parameters);
  const tableTabList = [
    { key: MoreTab.parameters, value: t`Parameters` },
    { key: MoreTab.swaps, value: t`Swaps` },
  ];
  if (poolDetail && poolDetail?.type !== 'DPP') {
    tableTabList.push({
      key: MoreTab.liquidityProviders,
      value: t`Liquidity Providers`,
    });
  }

  return (
    <Box
      sx={{
        mt: 24,
        backgroundColor: cardBg,
        borderRadius: 16,
        overflow: 'hidden',
        ...(isMobile
          ? {}
          : {
              mt: 32,
              px: 20,
            }),
      }}
    >
      <Tabs value={moreTab} onChange={(_, v) => setMoreTab(v as MoreTab)}>
        <TabsGroup tabs={tableTabList} />
        <TabPanel value={MoreTab.parameters}>
          <ParametersTable detail={poolDetail} />
        </TabPanel>
        <TabPanel value={MoreTab.swaps}>
          <SwapsTable poolDetail={poolDetail} />
        </TabPanel>
        <TabPanel value={MoreTab.liquidityProviders}>
          <LiquidityProvidersTable poolDetail={poolDetail} />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
