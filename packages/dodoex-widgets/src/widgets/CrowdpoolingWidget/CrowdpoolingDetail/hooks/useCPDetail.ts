import { useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { ChainId, cpGraphqlQuery, platformIdMap } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { useGraphQLRequests } from '../../../../hooks/useGraphQLRequests';
import {
  getStatusWithTimes,
  getRealTimePrice,
  getCPHardcapPrice,
} from '../../helper';
import { CPDetail } from '../../types';
import { convertFetchTokenToTokenInfo } from '../../../../utils';
import { secondsToDays } from '../../../../utils/time';
import { getFetchCP_SETTLED_QueryOptions } from '@dodoex/dodo-contract-request';

type Props = {
  id: string;
  chainId: number;
  account?: string | null;
};

export function useCPDetail({ id, chainId }: Props) {
  const graphQLRequests = useGraphQLRequests();

  const query = useQuery({
    ...graphQLRequests.getQuery(cpGraphqlQuery.fetchCPDetail, {
      id: id.toLowerCase(),
      where: {
        chain: platformIdMap[chainId as ChainId],
      },
    }),
    enabled: !!id,
    // refetchInterval: 15000,
  });
  const fetchIsSettled = useQuery(getFetchCP_SETTLED_QueryOptions(chainId, id));

  const detail = useMemo(() => {
    const crowdPooling = query.data?.crowdPooling;
    if (!crowdPooling) return undefined;

    const totalBase = new BigNumber(crowdPooling.totalBase);
    const poolQuoteCap = new BigNumber(crowdPooling.poolQuoteCap);
    const freezeDuration = Number(crowdPooling.freezeDuration) * 1000;
    const bidStartTime = Number(crowdPooling.bidStartTime) * 1000;
    const bidEndTime = Number(crowdPooling.bidEndTime) * 1000;
    const calmEndTime = Number(crowdPooling.calmEndTime) * 1000;
    const utilProtectionTime = bidEndTime + freezeDuration;
    const settled = fetchIsSettled.data ?? crowdPooling.settled;

    const initPrice = new BigNumber(crowdPooling.i).div(
      new BigNumber(10).pow(
        new BigNumber(18)
          .minus(crowdPooling.baseToken.decimals)
          .plus(crowdPooling.quoteToken.decimals),
      ),
    );
    const k = new BigNumber(crowdPooling.k).div(1e18);
    const isEscalation = !k.eq(0);

    const status = getStatusWithTimes(
      bidStartTime,
      bidEndTime,
      calmEndTime,
      settled,
    );

    const progress = Number(
      new BigNumber(crowdPooling.poolQuote)
        .div(poolQuoteCap)
        .multipliedBy(100)
        .toFixed(2),
    );

    let price = initPrice;
    let hardcapPrice;
    let salesBase = new BigNumber(crowdPooling.poolQuoteCap).div(initPrice);
    const salesRatio = isEscalation
      ? new BigNumber(100)
      : poolQuoteCap.multipliedBy(100).div(initPrice).div(totalBase);
    const sessionSupplyAmount = totalBase.multipliedBy(salesRatio).div(100);
    const targetTakerTokenAmount = poolQuoteCap;

    if (isEscalation) {
      price = getRealTimePrice({
        totalBase: crowdPooling.totalBase,
        i: initPrice,
        k,
        poolQuote: crowdPooling.poolQuote,
        poolQuoteCap: crowdPooling.poolQuoteCap,
      });
      hardcapPrice = getCPHardcapPrice({
        totalBase: crowdPooling.totalBase,
        i: initPrice,
        k,
        poolQuoteCap: crowdPooling.poolQuoteCap,
      });
      salesBase = new BigNumber(crowdPooling.poolQuoteCap)
        .div(hardcapPrice)
        .dp(0);
    }

    const cpDetail: CPDetail = {
      ...crowdPooling,
      baseToken: convertFetchTokenToTokenInfo(crowdPooling.baseToken, chainId)!,
      quoteToken: convertFetchTokenToTokenInfo(
        crowdPooling.quoteToken,
        chainId,
      )!,
      createTime: Number(crowdPooling.createTime) * 1000,
      freezeDuration,
      bidStartTime,
      bidEndTime,
      calmEndTime,
      utilProtectionTime,
      protectionDays: freezeDuration ? secondsToDays(freezeDuration) : '--',
      progress,
      salesRatio,
      targetTakerTokenAmount,
      status,
      settled,
      salesBase: new BigNumber(crowdPooling.poolQuoteCap).div(initPrice),
      price: initPrice,
      initPrice,
      i: initPrice,
      k,
      isEscalation,
      totalBase: Number(crowdPooling.totalBase),
      sessionSupplyAmount,
      investorsCount: Number(crowdPooling.investorsCount),
      chainId,
    };

    if (isEscalation) {
      cpDetail.price = getRealTimePrice(cpDetail);
      cpDetail.hardcapPrice = getCPHardcapPrice(cpDetail);
      cpDetail.salesBase = new BigNumber(crowdPooling.poolQuoteCap)
        .div(cpDetail.hardcapPrice)
        .dp(0);
    }

    return cpDetail;
  }, [query.data, chainId, fetchIsSettled.data]);

  const refetch = useCallback(() => {
    query.refetch();
    fetchIsSettled.refetch();
  }, [query.refetch, fetchIsSettled.refetch]);

  return {
    detail,
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch,
  };
}
