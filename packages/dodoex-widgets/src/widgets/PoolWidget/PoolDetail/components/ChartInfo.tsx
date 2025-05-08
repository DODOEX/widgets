import { getPmmModel } from '@dodoex/api';
import {
  Box,
  HoverOpacity,
  TabPanel,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { Switch } from '@dodoex/icons';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { formatReadableNumber } from '../../../../utils/formatter';
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
  const theme = useTheme();

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

  const [isSwitchMidPrice, setIsSwitchMidPrice] = React.useState(false);
  const midPrice =
    isSwitchMidPrice && pmmStateQuery.data?.midPrice
      ? new BigNumber(1).div(pmmStateQuery.data?.midPrice)
      : pmmStateQuery.data?.midPrice;

  return (
    <Box
      sx={{
        mt: 24,
        [theme.breakpoints.up('tablet')]: {
          mt: 20,
          pt: 28,
          borderTop: `1px solid ${theme.palette.border.main}`,
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
            gap: 4,
            mb: 24,
          }}
        />
        {chartTab === ChartTab.depth &&
        !!poolDetail?.baseToken &&
        !!poolDetail?.quoteToken ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <PoolTokenPair
              baseToken={poolDetail?.baseToken}
              quoteToken={poolDetail?.quoteToken}
              midPrice={midPrice}
              isSwitchMidPrice={isSwitchMidPrice}
              setIsSwitchMidPrice={setIsSwitchMidPrice}
              showMidPrice={chartTab === ChartTab.depth}
            />
          </Box>
        ) : (
          ''
        )}
        <TabPanel value={ChartTab.depth}>
          <DepthAndLiquidityChart
            baseToken={poolDetail?.baseToken ?? null}
            quoteToken={poolDetail?.quoteToken ?? null}
            pmmParams={pmmParams}
            pmmModel={pmmModel}
            midPrice={midPrice}
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

function PoolTokenPair({
  baseToken,
  quoteToken,
  midPrice,
  isSwitchMidPrice,
  setIsSwitchMidPrice,
  showMidPrice,
}: {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  midPrice?: BigNumber;
  isSwitchMidPrice: boolean;
  setIsSwitchMidPrice: React.Dispatch<React.SetStateAction<boolean>>;
  showMidPrice?: boolean;
}) {
  const baseSymbol = baseToken?.symbol;
  const quoteSymbol = quoteToken?.symbol;

  const midPriceLeftSymbol = isSwitchMidPrice ? quoteSymbol : baseSymbol;
  const midPriceRightSymbol = isSwitchMidPrice ? baseSymbol : quoteSymbol;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {showMidPrice ? (
        <Box
          sx={{
            mt: 4,
            typography: 'body2',
            color: 'text.secondary',
            wordBreak: 'break-all',
            display: 'flex',
          }}
        >
          {`1 ${midPriceLeftSymbol} = ${
            midPrice
              ? formatReadableNumber({
                  input: midPrice,
                  showDecimals: 16,
                })
              : '-'
          } ${midPriceRightSymbol}`}
          <HoverOpacity
            weak
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 14,
              height: 14,
              position: 'relative',
              top: 1.5,
              ml: 9,
              cursor: 'pointer',
              borderRadius: '50%',
              backgroundColor: 'background.paperDarkContrast',
              p: 0,
            }}
            onClick={() => setIsSwitchMidPrice((prev) => !prev)}
          >
            <Box component={Switch} />
          </HoverOpacity>
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
}
