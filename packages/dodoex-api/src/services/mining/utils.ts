import BigNumber from 'bignumber.js';

export enum MiningStatusE {
  upcoming,
  active,
  ended,
}

export const miningUtils = {
  /**
   * Get mining activity status by timestamp
   * @param param0
   * @returns
   */
  getMiningStatusByTimestamp: ({
    startTime: startTimeRoot,
    endTime: endTimeRoot,
    rewardTokenInfoList,
  }: {
    startTime: string | undefined | null;
    endTime: string | undefined | null;
    rewardTokenInfoList: Array<{
      startTime: string | BigNumber | undefined | null;
      endTime: string | BigNumber | undefined | null;
    }>;
  }) => {
    /** The earliest timestamp of multiple reward tokens that start to be released */
    let firstStartTime: BigNumber | undefined;
    /** The latest timestamp of the release of multiple reward tokens */
    let lastEndTime: BigNumber | undefined;

    for (const item of rewardTokenInfoList) {
      const startTime = item.startTime || startTimeRoot;
      const endTime = item.endTime || endTimeRoot;
      if (startTime) {
        if (firstStartTime) {
          firstStartTime = BigNumber.min(startTime, firstStartTime);
        } else {
          firstStartTime = BigNumber.isBigNumber(startTime)
            ? startTime
            : new BigNumber(startTime);
        }
      }
      if (endTime) {
        if (lastEndTime) {
          lastEndTime = BigNumber.max(endTime, lastEndTime);
        } else {
          lastEndTime = BigNumber.isBigNumber(endTime)
            ? endTime
            : new BigNumber(endTime);
        }
      }
    }

    const currentTime = new BigNumber(Math.floor(Date.now() / 1000));

    let status: MiningStatusE = MiningStatusE.ended;
    if (firstStartTime && currentTime.lt(firstStartTime)) {
      status = MiningStatusE.upcoming;
    }
    if (
      firstStartTime &&
      lastEndTime &&
      currentTime.gte(firstStartTime) &&
      currentTime.lte(lastEndTime)
    ) {
      status = MiningStatusE.active;
    }

    return {
      status,
      firstStartTime,
      lastEndTime,
      currentTime,
    };
  },
};
