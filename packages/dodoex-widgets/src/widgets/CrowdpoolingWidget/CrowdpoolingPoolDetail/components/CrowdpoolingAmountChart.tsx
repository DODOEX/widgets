import { Box } from '@dodoex/components';
import StatBarChart from '../../../PoolWidget/PoolDetail/components/StatBarChart';
import { CPDetail } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { cpGraphqlQuery } from '@dodoex/api';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';
import { useMemo } from 'react';

const EmptyData = {
  investedQuote: 0,
  investCount: 0,
  newcome: 0,
  poolQuote: 0,
  investors: 0,
  date: 0,
  hour: 0,
};

export default function CrowdpoolingAmountChart({
  detail,
  activeChartType,
}: {
  detail: CPDetail | undefined;
  activeChartType: 'taker-token' | 'creators';
}) {
  const graphQLRequests = useGraphQLRequests();

  const { data: cpDayData } = useQuery({
    ...graphQLRequests.getQuery(cpGraphqlQuery.fetchCPDayData, {
      first: 1000,
      where: { crowdPooling: detail?.id.toLowerCase() || '' },
    }),
    enabled: !!detail?.id,
  });

  const { data: cpHourData } = useQuery({
    ...graphQLRequests.getQuery(cpGraphqlQuery.fetchCPHourData, {
      first: 1000,
      where: { crowdPooling: detail?.id.toLowerCase() || '' },
    }),
    enabled: !!detail?.id,
  });

  // Format and fill day data - ensure at least 7 days
  const cpDayDataList = useMemo(() => {
    const rawData = cpDayData?.crowdPoolingDayDatas || [];
    const formatedDayData = rawData.map((item) => ({
      ...item,
      investors: Number(item.investors),
      newcome: Number(item.newcome),
      investedQuote: Number(item.investedQuote),
      poolQuote: Number(item.poolQuote),
      date: Number(item.date) * 1000,
    }));

    if (formatedDayData.length === 0) {
      // No data, create 7 days of empty data
      const now = Date.now();
      const result = [];
      for (let i = 6; i >= 0; i--) {
        result.push({
          ...EmptyData,
          date: now - i * 24 * 60 * 60 * 1000,
        });
      }
      return result;
    }

    const lastDayData = formatedDayData[formatedDayData.length - 1];
    const lastDayInvestors = lastDayData.investors;
    const lastDayPoolQuote = lastDayData.poolQuote;

    // Only keep recent data and fill to 7 days
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Filter to only recent 7 days
    let recentData = formatedDayData.filter(d => d.date >= sevenDaysAgo);

    // If we have data, fill from last data point to now
    if (recentData.length > 0) {
      const lastData = recentData[recentData.length - 1];
      const daysSinceLastData = Math.floor((now - lastData.date) / (24 * 60 * 60 * 1000));

      // Add missing days from last data to now (max 7 days total)
      for (let i = 1; i <= Math.min(daysSinceLastData, 7 - recentData.length); i++) {
        recentData.push({
          ...EmptyData,
          date: lastData.date + i * 24 * 60 * 60 * 1000,
          investors: lastDayInvestors,
          poolQuote: lastDayPoolQuote,
        });
      }
    }

    // Fill at the beginning if needed
    while (recentData.length < 7) {
      const firstDate = recentData.length > 0
        ? recentData[0].date - 24 * 60 * 60 * 1000
        : now - (7 - recentData.length) * 24 * 60 * 60 * 1000;
      recentData.unshift({
        ...EmptyData,
        date: firstDate,
        investors: recentData.length > 0 ? lastDayInvestors : 0,
        poolQuote: recentData.length > 0 ? lastDayPoolQuote : 0,
      });
    }

    // Ensure exactly 7 items
    return recentData.slice(-7);
  }, [cpDayData]);

  // Format and fill hour data - ensure at least 24 hours
  const cpHourDataList = useMemo(() => {
    const rawData = cpHourData?.crowdPoolingHourDatas || [];
    const formatedHourData = rawData.map((item) => ({
      ...item,
      investors: Number(item.investors),
      newcome: Number(item.newcome),
      investedQuote: Number(item.investedQuote),
      poolQuote: Number(item.poolQuote),
      hour: Number(item.hour) * 1000,
    }));

    if (formatedHourData.length === 0) {
      // No data, create 24 hours of empty data
      const now = Date.now();
      const result = [];
      for (let i = 23; i >= 0; i--) {
        result.push({
          ...EmptyData,
          hour: now - i * 60 * 60 * 1000,
        });
      }
      return result;
    }

    const lastHourData = formatedHourData[formatedHourData.length - 1];
    const lastHourInvestors = lastHourData.investors;
    const lastHourPoolQuote = lastHourData.poolQuote;

    // Only keep recent data and fill to 24 hours
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    // Filter to only recent 24 hours
    let recentData = formatedHourData.filter(h => h.hour >= twentyFourHoursAgo);

    // If we have data, fill from last data point to now
    if (recentData.length > 0) {
      const lastData = recentData[recentData.length - 1];
      const hoursSinceLastData = Math.floor((now - lastData.hour) / (60 * 60 * 1000));

      // Add missing hours from last data to now (max 24 hours total)
      for (let i = 1; i <= Math.min(hoursSinceLastData, 24 - recentData.length); i++) {
        recentData.push({
          ...EmptyData,
          hour: lastData.hour + i * 60 * 60 * 1000,
          investors: lastHourInvestors,
          poolQuote: lastHourPoolQuote,
        });
      }
    }

    // Fill at the beginning if needed
    while (recentData.length < 24) {
      const firstHour = recentData.length > 0
        ? recentData[0].hour - 60 * 60 * 1000
        : now - (24 - recentData.length) * 60 * 60 * 1000;
      recentData.unshift({
        ...EmptyData,
        hour: firstHour,
        investors: recentData.length > 0 ? lastHourInvestors : 0,
        poolQuote: recentData.length > 0 ? lastHourPoolQuote : 0,
      });
    }

    // Ensure exactly 24 items
    return recentData.slice(-24);
  }, [cpHourData]);

  if (!detail) return null;

  return (
    <Box
      sx={{
        mt: 14,
      }}
    >
      <StatBarChart
        unit={activeChartType === 'taker-token' ? detail.quoteToken.symbol : ''}
        dayData={cpDayDataList}
        hourData={cpHourDataList}
        masterKey={
          activeChartType === 'taker-token' ? 'investedQuote' : 'newcome'
        }
        sumKey={activeChartType === 'taker-token' ? 'poolQuote' : 'investors'}
        investorsCount={detail.investorsCount || '--'}
      />
    </Box>
  );
}
