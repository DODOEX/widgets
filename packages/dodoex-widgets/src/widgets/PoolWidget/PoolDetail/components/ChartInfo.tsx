import { getPmmModel } from '@dodoex/api';
import { Box, TabPanel, Tabs, TabsGroup } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { usePoolDetail } from '../../hooks/usePoolDetail';
import DepthAndLiquidityChart from '../../PoolCreate/components/DepthAndLiquidityChart';
import { poolApi } from '../../utils';
import { usePoolDayData } from '../hooks/usePoolDayData';
import StatBarChart from './StatBarChart';

enum ChartTab {
  depth = 1,
  volume,
  feeRevenue,
  traders,
}

export default function ChartInfo({
  poolDetail,
  chart24hDataFirst,
}: {
  poolDetail?: ReturnType<typeof usePoolDetail>['poolDetail'];
  chart24hDataFirst?: boolean;
}) {
  const [chartTab, setChartTab] = React.useState(
    chart24hDataFirst ? ChartTab.volume : ChartTab.depth,
  );

  const depthTab = { key: ChartTab.depth, value: t`Depth` };
  const tabList = [
    { key: ChartTab.volume, value: t`Volume` },
    { key: ChartTab.feeRevenue, value: t`FeeRevenue` },
    { key: ChartTab.traders, value: t`Traders` },
  ];
  if (chart24hDataFirst) {
    tabList.push(depthTab);
  } else {
    tabList.splice(0, 0, depthTab);
  }

  const dayDataQuery = usePoolDayData({
    chainId: poolDetail?.chainId,
    address: poolDetail?.address,
    day: 30,
  });
  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      poolDetail?.chainId as number,
      poolDetail?.address,
      poolDetail?.type,
      poolDetail?.baseToken?.decimals,
      poolDetail?.quoteToken?.decimals,
    ),
  );
  const { pmmParamsBG } = pmmStateQuery.data ?? {};
  const pmmParams = pmmParamsBG
    ? {
        i: pmmParamsBG.i.toNumber(),
        k: pmmParamsBG.k.toNumber(),
        b: pmmParamsBG.b.toNumber(),
        b0: pmmParamsBG.b0.toNumber(),
        q: pmmParamsBG.q.toNumber(),
        q0: pmmParamsBG.k.isEqualTo(0)
          ? pmmParamsBG.q.toNumber()
          : pmmParamsBG.q0.toNumber(),
        R: pmmParamsBG.k.isEqualTo(0) ? 0 : pmmParamsBG.R,
      }
    : undefined;
  const pmmModel = pmmParams ? getPmmModel(pmmParams) : undefined;
  return (
    <Box
      sx={{
        mt: {
          mobile: 24,
          tablet: 52,
        },
      }}
    >
      <Tabs
        value={chartTab}
        onChange={(_, value) => setChartTab(value as ChartTab)}
      >
        <TabsGroup
          tabs={tabList}
          variant="rounded"
          tabsListSx={{
            borderWidth: 0,
          }}
        />
        <TabPanel value={ChartTab.depth}>
          <DepthAndLiquidityChart
            baseToken={poolDetail?.baseToken ?? null}
            quoteToken={poolDetail?.quoteToken ?? null}
            pmmParams={pmmParams}
            pmmModel={pmmModel}
            midPrice={pmmStateQuery.data?.midPrice}
          />
        </TabPanel>
        <TabPanel value={ChartTab.volume}>
          <StatBarChart
            data={dayDataQuery.dayDataList}
            masterKey="volume"
            sumKey="volume"
            unit="$"
          />
        </TabPanel>
        <TabPanel value={ChartTab.feeRevenue}>
          <StatBarChart
            data={dayDataQuery.dayDataList}
            masterKey="fee"
            sumKey="fee"
            unit="$"
          />
        </TabPanel>
        <TabPanel value={ChartTab.traders}>
          <StatBarChart
            data={dayDataQuery.dayDataList}
            masterKey="traders"
            sumKey="traders"
            unit=""
          />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
