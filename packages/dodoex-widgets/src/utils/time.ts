import { getIntegerNumber } from './formatter';
import { t } from '@lingui/macro';

function getSecondUnit(seconds: number, short?: boolean) {
  let unit = t`s`;
  if (!short) {
    unit = seconds >= 2 ? t`Seconds` : t`Second`;
  }
  return unit;
}

function getMinuteUnit(minutes: number, short?: boolean) {
  let unit = '';
  if (minutes >= 2) {
    unit = short ? t`Mins` : t`Minutes`;
  } else {
    unit = short ? t`Min` : t`Minute`;
  }
  return unit;
}

function getHourUnit(hours: number) {
  return hours >= 2 ? t`Hours` : t`Hour`;
}

function getDayUnit(days: number) {
  return days >= 2 ? t`Days` : t`Day`;
}

/**
 * time formatter
 * output => 17mins54s or 17 Minutes
 */
export function formatReadableTimeDuration({
  start,
  end,
  showSecondUnit,
}: {
  start?: number;
  end?: number;
  showSecondUnit?: boolean;
}): string | null {
  if (!start || !end) {
    return null;
  }
  const diff = end - start;
  const second = 1000;
  const minute = 60 * second;
  const hour = minute * 60;
  const day = hour * 24;

  let unit1 = '';
  let unit2 = '';
  if (diff < minute) {
    const seconds = diff / second;
    unit1 = `${getIntegerNumber(seconds)} ${getSecondUnit(
      seconds,
      showSecondUnit,
    )}`;
  } else if (diff < hour) {
    const minutes = diff / minute;
    unit1 = `${getIntegerNumber(minutes)} ${getMinuteUnit(
      minutes,
      showSecondUnit,
    )}`;
    const seconds = (diff % minute) / second;
    unit2 = `${getIntegerNumber(seconds)} ${getSecondUnit(
      seconds,
      showSecondUnit,
    )}`;
  } else if (diff < day) {
    const hours = diff / hour;
    unit1 = `${getIntegerNumber(hours)} ${getHourUnit(hours)}`;
    const minutes = (diff % hour) / minute;
    unit2 = `${getIntegerNumber(minutes)} ${getMinuteUnit(minutes)}`;
  } else {
    const days = diff / day;
    unit1 = `${getIntegerNumber(days)} ${getDayUnit(days)}`;
    const hours = (diff % day) / hour;
    unit2 = `${getIntegerNumber(hours)} ${getHourUnit(hours)}`;
  }

  if (showSecondUnit) {
    return `${unit1}${unit2}`.replaceAll(' ', '').toLowerCase();
  }
  return unit1;
}

function getTimePrefix(num: number): string {
  const numText = String(num);
  if (numText.length === 1) {
    return `0${numText}`;
  }
  return numText;
}
export function getTimeText(
  time: Date,
  split = '/',
  {
    noYear,
  }: {
    noYear?: boolean;
  } = {},
) {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const hour = time.getHours();
  const minute = time.getMinutes();

  let result = `${getTimePrefix(month)}${split}${getTimePrefix(
    date,
  )} ${getTimePrefix(hour)}:${getTimePrefix(minute)}`;
  if (!noYear) {
    result = `${year}${split}${result}`;
  }

  return result;
}
