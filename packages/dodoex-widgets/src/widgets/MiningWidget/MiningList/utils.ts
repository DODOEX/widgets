import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { useSubmission } from '../../../hooks/Submission';
import { formatPercentageNumber } from '../../../utils/formatter';
import {
  CompositeMiningContractDataI,
  MiningWithContractDataI,
  TabMiningI,
} from '../types';

export const EARN_MINING_DETAIL_ID = 'earn-mining-detail';
export const EARN_MINING_CREATE_AREA = 'earn-mining-create-area';
export const EARN_MINING_OPERATE_AREA = 'earn-mining-operate-area';

export const MINING_OPERATE_EXPIRED_TIME = 180;

export function isUnexpiredTx(submitTime: number) {
  return (
    Math.ceil(Date.now() / 1000) - submitTime < MINING_OPERATE_EXPIRED_TIME
  );
}

function isMyStakedLoadingInner({
  id,
  requests,
  lpTokenAccountStakedBalance,
  quoteLpTokenAccountStakedBalance,
}: {
  id: string;
  requests: ReturnType<typeof useSubmission>['requests'];
  lpTokenAccountStakedBalance?: BigNumber;
  quoteLpTokenAccountStakedBalance?: BigNumber;
}) {
  const latestTx = requests
    ? Array.from(requests.values()).findLast(([r, state]) => {
        return r.metadata?.id === id && r.metadata?.depositOrWithdrawMining;
      })
    : undefined;
  const metadata = latestTx ? latestTx[0].metadata : undefined;
  if (metadata && metadata?.submitTime) {
    const {
      submitTime,
      lpTokenAccountStakedBalance: lastLpTokenAccountStakedBalance,
      selectedStakeTokenIndex,
    } = metadata;
    if (isUnexpiredTx(submitTime)) {
      if (selectedStakeTokenIndex === 1) {
        return (
          quoteLpTokenAccountStakedBalance?.eq(
            lastLpTokenAccountStakedBalance ?? 0,
          ) ?? false
        );
      }
      return (
        lpTokenAccountStakedBalance?.eq(lastLpTokenAccountStakedBalance ?? 0) ??
        false
      );
    }
  }
  return false;
}

export function isJoinedMining({
  contractData,
  miningMinings,
}: {
  miningMinings: TabMiningI['miningMinings'];
  contractData: CompositeMiningContractDataI | undefined;
}) {
  if (!contractData) {
    return false;
  }
  const { balanceDataMap } = contractData;
  return (
    miningMinings.findIndex((m) => {
      const { id } = m;
      const balanceData = balanceDataMap.get(id);
      if (!balanceData) {
        return false;
      }
      const { lpTokenAccountStakedBalance, rewardTokenWithBalanceMap } =
        balanceData;

      if (lpTokenAccountStakedBalance?.gt(0)) {
        return true;
      }
      let hasReward = false;
      rewardTokenWithBalanceMap.forEach((balance) => {
        if (balance?.gt(0)) {
          hasReward = true;
        }
      });
      return hasReward;
    }) >= 0
  );
}

export function isMyStakedLoading({
  id,
  miningMinings,
  requests,
  balanceDataMap,
}: {
  id: TabMiningI['id'];
  miningMinings: TabMiningI['miningMinings'];
  requests: ReturnType<typeof useSubmission>['requests'];
  balanceDataMap: Map<string, MiningWithContractDataI>;
}) {
  if (miningMinings.length === 1) {
    const [miningMining] = miningMinings;
    const balanceData = balanceDataMap.get(miningMining.id);
    if (balanceData) {
      const { lpTokenAccountStakedBalance } = balanceData;
      return isMyStakedLoadingInner({
        id,
        requests,
        lpTokenAccountStakedBalance,
      });
    }
  }

  if (miningMinings.length === 2) {
    const [miningMining0, miningMining1] = miningMinings;
    const balanceData0 = balanceDataMap.get(miningMining0.id);
    const balanceData1 = balanceDataMap.get(miningMining1.id);
    if (balanceData0 && balanceData1) {
      return isMyStakedLoadingInner({
        id,
        requests,
        lpTokenAccountStakedBalance: balanceData0.lpTokenAccountStakedBalance,
        quoteLpTokenAccountStakedBalance:
          balanceData1.lpTokenAccountStakedBalance,
      });
    }
  }

  return false;
}

export function isJoinedOrStakedProcessing({
  miningItem,
  contractDataMap,
  othersChainContractDataMap,
  requests,
}: {
  miningItem: TabMiningI;
  contractDataMap: Map<string, CompositeMiningContractDataI>;
  othersChainContractDataMap: Map<string, CompositeMiningContractDataI>;
  requests: ReturnType<typeof useSubmission>['requests'];
}) {
  const { id, miningMinings } = miningItem;
  const contractData =
    contractDataMap.get(id) ?? othersChainContractDataMap.get(id);
  if (contractData) {
    if (
      isJoinedMining({
        contractData,
        miningMinings,
      })
    ) {
      return true;
    }

    const balanceDataMap = contractData.balanceDataMap;
    return isMyStakedLoading({
      id,
      miningMinings,
      balanceDataMap,
      requests,
    });
  }
  return false;
}

export function formatApr(apr?: BigNumber) {
  if (!apr) {
    return '-';
  }
  if (!apr.isFinite()) {
    return '- %';
  }
  if (apr.lt(0.00001) && apr.gt(0)) {
    return '0.00%';
  }
  return formatPercentageNumber({
    input: apr.toNumber(),
  });
}

export function formatDate(time: number | null) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}

export function getOperateAreaWrapperEle() {
  return document.getElementById(EARN_MINING_OPERATE_AREA) as HTMLElement;
}

export function getDetailWrapperEle() {
  return document.getElementById(EARN_MINING_DETAIL_ID) as HTMLElement;
}

export function hideExistedNode(ele: HTMLElement) {
  if (ele) {
    const firstChild = ele.getElementsByTagName('div')[0];
    if (firstChild) {
      firstChild.style.display = 'none';
    }
  }
}

export function showExistedNode(ele: HTMLElement) {
  if (ele) {
    const firstChild = ele.getElementsByTagName('div')[0];
    if (firstChild) {
      firstChild.style.display = 'block';
    }
  }
}

export function generateMiningDetailUrl({
  chainId,
  miningContractAddress,
  stakeTokenAddress,
}: {
  chainId?: number;
  miningContractAddress: string | undefined;
  stakeTokenAddress: string | undefined;
}) {
  if (!miningContractAddress) {
    return `${
      window.location.origin
    }${`/earn/mining?address=${stakeTokenAddress}`}`;
  }

  if (!stakeTokenAddress) {
    return `${
      window.location.origin
    }${`/earn/mining?mining=${miningContractAddress}`}`;
  }

  return `${
    window.location.origin
  }${`/earn/mining/${miningContractAddress}/${stakeTokenAddress}`}`;
}

export function computeEndTimestampByEndBlock({
  endTime,
  endBlock,
  targetEndBlock,
  blockTime,
}: {
  endTime: BigNumber;
  endBlock: BigNumber;
  targetEndBlock: BigNumber;
  blockTime: number;
}) {
  return endTime
    .multipliedBy(1000)
    .minus(endBlock.minus(targetEndBlock).multipliedBy(blockTime))
    .toNumber();
}
