import { ChainId, MiningStatusE } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { BaseMiningI, MiningRewardTokenI } from '../types';
import { blockTimeMap } from '../../../constants/chains';

export const MINING_POOL_REFETCH_INTERVAL = 60000;
// export const MINING_POOL_REFETCH_INTERVAL = 600000;

export const VALID_MINING_TYPE: Array<BaseMiningI['type']> = [
  'dvm',
  'single',
  'classical',
  'vdodo',
  'lptoken',
];
export const VALID_MINING_VERSION: Array<BaseMiningI['version']> = ['2', '3'];

export function getMiningRewardStatus({
  startTime,
  endTime,
}: {
  startTime: BigNumber | undefined;
  endTime: BigNumber | undefined;
}) {
  const currentTime = new BigNumber(Math.floor(Date.now() / 1000));

  let status: MiningStatusE = MiningStatusE.ended;
  if (startTime && currentTime.lt(startTime)) {
    status = MiningStatusE.upcoming;
  }
  if (
    startTime &&
    endTime &&
    currentTime.gte(startTime) &&
    currentTime.lte(endTime)
  ) {
    status = MiningStatusE.active;
  }

  return { status, currentTime };
}

export function getMiningStatusByTimestamp({
  rewardTokenInfoList,
}: {
  rewardTokenInfoList: Pick<MiningRewardTokenI, 'startTime' | 'endTime'>[];
}) {
  let firstStartTime: BigNumber | undefined;
  let lastEndTime: BigNumber | undefined;

  for (const { startTime, endTime } of rewardTokenInfoList) {
    if (startTime) {
      if (firstStartTime) {
        firstStartTime = BigNumber.min(startTime, firstStartTime);
      } else {
        firstStartTime = startTime;
      }
    }
    if (endTime) {
      if (lastEndTime) {
        lastEndTime = BigNumber.max(endTime, lastEndTime);
      } else {
        lastEndTime = endTime;
      }
    }
  }

  const { status, currentTime } = getMiningRewardStatus({
    startTime: firstStartTime,
    endTime: lastEndTime,
  });

  return {
    status,
    firstStartTime,
    lastEndTime,
    currentTime,
  };
}

export function computeDailyRewardByPerBlock(
  blockTime: number,
  rewardPerBlock: BigNumber | undefined,
) {
  if (!rewardPerBlock) {
    return null;
  }
  const totalBlocksForOneDay = new BigNumber(24)
    .times(60)
    .times(60)
    .times(1000)
    .div(blockTime);
  return totalBlocksForOneDay.multipliedBy(rewardPerBlock);
}

export const getPreBlock = (
  blockTime: number,
  blockNumber: BigNumber,
  time: number | Date,
) => {
  const blockTimeSecond = new BigNumber(blockTime).div(1000);
  const diffSecond = dayjs(time).diff(dayjs(), 'seconds');
  const diffBlock = new BigNumber(diffSecond).div(blockTimeSecond);
  return diffBlock.plus(blockNumber).decimalPlaces(0, 1);
};

export const getTimeByPreBlock = (
  blockTime: number,
  blockNumber: BigNumber,
  preBlockNumber: string | number | BigNumber,
) => {
  const blockTimeSecond = new BigNumber(blockTime).div(1000);
  const now = dayjs();
  const diffBlock = new BigNumber(preBlockNumber).minus(blockNumber);
  const diffSecond = diffBlock.times(blockTimeSecond);
  return now.add(diffSecond.toNumber(), 's');
};

/**
 * 一天预估产生多少区块
 */
export function getBlocksCountPerDay(chainId: ChainId) {
  const blockTime = blockTimeMap[chainId];
  return (24 * 60 * 60 * 1000) / blockTime;
}

export function getBlocksCountPerYear(chainId: number) {
  return getBlocksCountPerDay(chainId) * 365;
}
