import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';

export const iMAXTIME = 1 * 365 * 86400;
export const WEEK = 604800;

export function getLockDurationRemainder(nowTime: number) {
  const remainder = nowTime % WEEK;
  return WEEK - remainder;
}

/**
 * @see https://github.com/velodrome-finance/contracts/blob/main/contracts/VotingEscrow.sol#L589
 */
export function getCreateLockNftPower(amount: string, lockDuration: number) {
  const slope = new BigNumber(amount).div(iMAXTIME);
  const bias = slope.times(lockDuration);
  return bias;
}

export function getLockDurationByPointHistory(
  bias: string | BigNumber | bigint,
  slope: string | BigNumber | bigint,
) {
  const biasBg = BigNumber.isBigNumber(bias)
    ? bias
    : new BigNumber(bias.toString());
  return biasBg.div(slope.toString()).dp(0, BigNumber.ROUND_DOWN);
}

export function getAmountByPointHistory(slope: string | BigNumber | bigint) {
  const slopeBg = BigNumber.isBigNumber(slope)
    ? slope
    : new BigNumber(slope.toString());
  return slopeBg.div(iMAXTIME).dp(0);
}

/**
 * @see https://github.com/velodrome-finance/contracts/blob/main/contracts/libraries/BalanceLogicLibrary.sol#L90
 */
export function getVotingPowerByPointHistory(
  point: {
    bias: bigint;
    slope: bigint;
    ts: bigint;
    permanent: bigint;
  },
  nowTime: number,
) {
  if (point.permanent) {
    return new BigNumber(point.permanent.toString());
  }
  const biasBg = new BigNumber(point.bias.toString());
  const slopeBg = new BigNumber(point.slope.toString());
  return biasBg.minus(slopeBg.times(nowTime - Number(point.ts)));
}

export function getUnlockTimeTextShort(unlockTime: number) {
  return dayjs(unlockTime).format('YYYY-MM-DD');
}

export function getUnlockTimeText(unlockTime: number) {
  const date = dayjs(unlockTime);
  const formatText = date.format('YYYY-MM-DD HH:mm:ss');
  let utc = -(date.toDate().getTimezoneOffset() / 60);
  let utcText = String(utc);
  if (utc && Math.abs(utc) < 10) {
    utcText = '0' + utcText;
  }
  return `${formatText} UTC+${utcText}`;
}
