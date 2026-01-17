import BigNumber from 'bignumber.js';
import {
  CP_OP_RANK,
  CP_STATUS,
  Crowdpooling,
  CrowdpoolingDetail,
  FetchCPItem,
} from './types';
import { convertFetchTokenToTokenInfo } from '../../utils';
import { PMMHelper, PMMState } from '@dodoex/api';

export const formatCP = ({
  crowdpoolings,
  bidPositions,
  iopCPList,
  chainId,
}: {
  crowdpoolings: FetchCPItem[];
  bidPositions?: any;
  iopCPList?: any;
  chainId: number;
}) => {
  const cpWhiteList = iopCPList || [];
  const formatedCpList = crowdpoolings.map((cp) => {
    const bidPosition =
      bidPositions && bidPositions.find((bp) => bp.cp.id === cp.id);
    const freezeDuration = Number(cp.freezeDuration) * 1000;
    const bidStartTime = Number(cp.bidStartTime) * 1000;
    const bidEndTime = Number(cp.bidEndTime) * 1000;
    const calmEndTime = Number(cp.calmEndTime) * 1000;
    const cpInWhiteList = cpWhiteList?.find(
      (iopCp: any) => iopCp?.address === cp.id,
    );
    const k = new BigNumber(cp.k).div(1e18);
    const isEscalation = !k.eq(0);
    const initPrice = new BigNumber(cp.i).div(
      new BigNumber(10).pow(
        new BigNumber(18)
          .minus(cp.baseToken.decimals)
          .plus(cp.quoteToken.decimals),
      ),
    );
    const formatedCP: Crowdpooling = {
      ...cp,
      chainId,
      initPrice,
      i: initPrice,
      price: initPrice,
      baseToken: convertFetchTokenToTokenInfo(cp.baseToken, chainId)!,
      k,
      isEscalation,
      salesBase: new BigNumber(cp.poolQuoteCap).div(initPrice),
      quoteToken: convertFetchTokenToTokenInfo(cp.quoteToken, chainId)!,
      status: getStatusWithTimes(
        bidStartTime,
        bidEndTime,
        calmEndTime,
        cp.settled,
      ),
      progress: Number(
        new BigNumber(cp.poolQuote)
          .div(cp.poolQuoteCap)
          .multipliedBy(100)
          .toFixed(2),
      ),
      bidPosition,
      bidStartTime,
      bidEndTime,
      calmEndTime,
      freezeDuration,
      weight: cpInWhiteList?.weight || 0,
      opRank: cpInWhiteList?.opRank || CP_OP_RANK.Wild,
      personalPercentage: Number(
        new BigNumber(bidPosition?.investedQuote ?? 0)
          .div(cp.poolQuoteCap)
          .multipliedBy(100)
          .toFixed(2),
      ),
    };
    if (formatedCP.isEscalation) {
      formatedCP.price = getRealTimePrice(formatedCP);
      formatedCP.hardcapPrice = getCPHardcapPrice(formatedCP);
      formatedCP.salesBase = new BigNumber(cp.poolQuoteCap)
        .div(formatedCP.hardcapPrice)
        .dp(0);
    }
    return formatedCP;
  });
  return sortCPList(formatedCpList);
};

export function getStatusWithTimes(
  bidStartTime: number,
  bidEndTime: number,
  clamEndTime: number,
  settled?: boolean | null,
): Crowdpooling['status'] {
  const now = Date.now();
  if (settled) {
    return CP_STATUS.ENDED;
  }
  if (now > bidEndTime && now < clamEndTime) {
    return CP_STATUS.CALMING;
  }
  if (now >= bidEndTime) {
    return CP_STATUS.SETTLING;
  }
  if (now >= bidStartTime && now < bidEndTime) {
    return CP_STATUS.PROCESSING;
  }
  return CP_STATUS.WAITING;
}

export const RStatusOne = 0;
export const RStatusAboveOne = 1;
export const RStatusBelowOne = 2;

export const getRealTimePrice = (
  cp: Crowdpooling | CrowdpoolingDetail,
  poolQuoteInput?: BigNumber,
) => {
  const totalBase = new BigNumber(cp.totalBase);
  const { i } = cp;
  const pmmState = new PMMState({
    Q: new BigNumber(0),
    B: totalBase,
    K: new BigNumber(cp.k),
    i,
    B0: totalBase,
    Q0: new BigNumber(0),
    R: RStatusOne,
    mtFeeRate: new BigNumber(0),
    lpFeeRate: new BigNumber(0),
  });
  const pmm = new PMMHelper();
  const poolQuote = BigNumber.min(
    new BigNumber(cp.poolQuote).plus(poolQuoteInput ?? 0),
    new BigNumber(cp.poolQuoteCap),
  );
  const soldBase = pmm.QuerySellQuote(poolQuote, pmmState);
  const poolBase = totalBase.minus(soldBase);
  const unUsedBase = new BigNumber(totalBase).minus(poolBase);
  const avgPrice = unUsedBase.eq(0) ? i : poolQuote.div(unUsedBase);
  return avgPrice;
};

export const getCPHardcapPrice = ({
  totalBase,
  i,
  k,
  poolQuoteCap,
}:
  | Crowdpooling
  | CrowdpoolingDetail
  | {
      totalBase: string | number | BigNumber;
      i: string | number | BigNumber;
      k: string | number | BigNumber;
      poolQuoteCap: string | number | BigNumber;
    }) => {
  totalBase = new BigNumber(totalBase);
  const pmmState = new PMMState({
    Q: new BigNumber(0),
    B: totalBase,
    K: new BigNumber(k),
    i,
    B0: totalBase,
    Q0: new BigNumber(0),
    R: RStatusAboveOne,
    mtFeeRate: new BigNumber(0),
    lpFeeRate: new BigNumber(0),
  });
  const pmm = new PMMHelper();
  const poolQuote = new BigNumber(poolQuoteCap);
  const soldBase = pmm.QuerySellQuote(poolQuote, pmmState);
  return poolQuote.div(soldBase);
};

const StatusIndex = {
  [CP_STATUS.PROCESSING]: 0,
  [CP_STATUS.WAITING]: 1,
  [CP_STATUS.SETTLING]: 2,
  [CP_STATUS.ENDED]: 3,
};
export const sortCPList = (cpList: Crowdpooling[]) => {
  return cpList
    .sort((a, b) => (b.bidStartTime < a.bidStartTime ? -1 : 1)) // 时间倒序
    .sort((a, b) => (StatusIndex[a.status] > StatusIndex[b.status] ? 1 : -1)); // 状态排序
};

export function isCPV2(version: string) {
  return version === '2' || version === 'CP 2.0.0';
}

interface ReceiveFromCPInterface {
  investedQuote: string | number | BigNumber;
  price: string | number | BigNumber;
  poolQuote: string | number;
  poolQuoteCap: string | number;
}
export const getExpectedReceiveFromCP = ({
  investedQuote,
  price,
  poolQuote,
  poolQuoteCap,
}: ReceiveFromCPInterface) => {
  const investedQuoteAmount = BigNumber.isBigNumber(investedQuote)
    ? investedQuote
    : new BigNumber(investedQuote);
  if (investedQuoteAmount.lte(0)) {
    return [new BigNumber('0'), new BigNumber('0')];
  }

  const exactProgress = new BigNumber(poolQuote).div(poolQuoteCap);
  const willReceiveBaseTokenAmount = new BigNumber(investedQuoteAmount).div(
    price,
  );
  if (exactProgress.lte(1)) {
    return [willReceiveBaseTokenAmount.dp(6), new BigNumber('0')];
  }

  const realInvestedQuote = new BigNumber(investedQuoteAmount)
    .div(poolQuote)
    .multipliedBy(poolQuoteCap);
  const realWillReceiveBaseTokenAmount = realInvestedQuote.div(price);
  const willRepayQuoteTokenAmount = willReceiveBaseTokenAmount
    .minus(realWillReceiveBaseTokenAmount)
    .multipliedBy(price);
  return [
    realWillReceiveBaseTokenAmount.dp(6),
    willRepayQuoteTokenAmount.dp(6),
  ];
};
