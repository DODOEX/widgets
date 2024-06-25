import { BigNumber } from 'bignumber.js';

/**
 * format to readable number, like: 0.00 -> 0, 1.00 -> 1, 1.235 -> 1.23, 1.230 -> 1.23
 * @param input
 */
export function formatReadableNumber({
  input,
  showDecimals = 4,
  showPrecisionDecimals = 2,
  showIntegerOnly = false,
  showDecimalsOnly = false,
  noGroupSeparator = false,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  input: BigNumber | number | string;
  showDecimals?: number;
  showIntegerOnly?: boolean;
  showDecimalsOnly?: boolean;
  showPrecisionDecimals?: number;
  noGroupSeparator?: boolean;
  roundingMode?: BigNumber.RoundingMode;
}): string {
  const source = new BigNumber(input);
  if (source.isNaN()) {
    return '-';
  }
  let amount = source.dp(showDecimals, roundingMode);
  if (amount.eq(0) && (source.gt(0) || source.lt(0))) {
    amount = source.sd(
      showPrecisionDecimals ?? showDecimals,
      BigNumber.ROUND_DOWN,
    );
  }
  if (showIntegerOnly) {
    amount = amount.integerValue(BigNumber.ROUND_DOWN);
  }
  if (showDecimalsOnly) {
    amount = amount.minus(amount.integerValue(BigNumber.ROUND_DOWN));
  }

  if (noGroupSeparator) {
    return amount.toFormat({
      decimalSeparator: '.',
      groupSeparator: '',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: '',
      fractionGroupSize: 0,
    });
  }
  return amount.toFormat();
}

export function formatTokenAmountNumber({
  input,
  decimals,
  showPrecisionDecimals = 2,
  noGroupSeparator,
}: {
  input?: BigNumber | number | string | null;
  decimals?: number;
  showPrecisionDecimals?: number;
  noGroupSeparator?: boolean;
}): string {
  if (input === undefined || input === null) {
    return '-';
  }
  const source = new BigNumber(input);
  if (source.isNaN()) {
    return '-';
  }
  const showDecimals =
    // eslint-disable-next-line no-nested-ternary
    decimals === undefined ? 0 : decimals > 6 ? 6 : decimals > 4 ? 4 : decimals;
  return formatReadableNumber({
    input: source,
    showDecimals,
    showPrecisionDecimals,
    noGroupSeparator,
  });
}

const isZero = (obj: string | number | BigNumber): boolean => {
  return new BigNumber(obj).isZero();
};

function toFixed(num: BigNumber | number): string {
  if (typeof num === 'number') return toFixed(new BigNumber(num));

  if (num.isNaN()) return 'NaN';
  if (num.isNegative()) return `-${toFixed(num.negated())}`;
  if (num.isZero()) return '0';

  let int = num.integerValue(BigNumber.ROUND_FLOOR);
  let dec = num.minus(int);

  // Int part
  let str = '';
  while (!int.isZero()) {
    const last = int.modulo(10).toString();
    str = last.toString() + str;
    int = int.idiv(10);
  }

  if (str === '') str = '0';

  // decimal part
  if (dec.isZero()) return str;
  str += '.';

  let cnt = 0;
  // Meow: magic number 100 here for avoiding infinite loop
  // On certain BigNumber impls which uses non 10-based repr, 10-based decimal string may not terminate finitely
  // Hence we are dropping everything > 100 digits after the decimal point, regardless of rounding mode (effectively rounding to -Infinity)
  while (!dec.isZero() && cnt < 100) {
    const expanded = dec.times(10);
    const intval = expanded.integerValue(BigNumber.ROUND_FLOOR);
    str += intval.toString();
    dec = expanded.minus(intval);
    cnt += 1;
  }

  return str;
}

export const fixedString = (
  raw: string | number | BigNumber,
  showDecimals?: number,
): string => {
  if (typeof raw === 'string' && !raw.match(/[-+]?\d+(.+d+)?/)) return raw;
  // console.log('Fixing', raw);
  const bn = new BigNumber(raw);
  if (showDecimals) {
    let result = bn.toFixed(showDecimals, BigNumber.ROUND_DOWN);
    if (isZero(result)) {
      result = toFixed(bn.precision(showDecimals, BigNumber.ROUND_DOWN));
    }
    return result;
  }
  return toFixed(bn);
};

export const fixedInputStringToFormattedNumber = (
  inputValue: string,
  inputTokenShowDecimals: number,
): string | null => {
  let inputString = inputValue;
  const regexFixedStrings = inputString.match('[0-9。.]+');
  if (regexFixedStrings && regexFixedStrings.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    inputString = regexFixedStrings[0];
  } else {
    inputString = '';
  }

  inputString = inputString.replace('。', '.');
  let decimalsCount = 0;
  if (inputString) {
    const inputSplits = inputString.split('.');
    const fixedInputSplits =
      inputSplits[0].length === 0 ? ['0'] : [inputSplits[0]];
    if (inputSplits.length > 1) {
      fixedInputSplits[1] = inputSplits.slice(1, inputSplits.length).join('');
    } else if (
      fixedInputSplits[0].length > 1 &&
      fixedInputSplits[0][0] === '0'
    ) {
      fixedInputSplits[0] = fixedInputSplits[0].slice(
        1,
        fixedInputSplits[0].length,
      );
    }
    if (fixedInputSplits.length > 1) {
      decimalsCount = fixedInputSplits[1].length;
    }
    inputString = fixedInputSplits.join('.');
  }

  if (inputTokenShowDecimals >= 0 && decimalsCount > inputTokenShowDecimals) {
    return fixedString(inputString, inputTokenShowDecimals);
  }
  return inputString;
};

export const toWei = (
  amount: BigNumber | string | number,
  decimals: number,
  notDp?: boolean,
) => {
  const result = new BigNumber(amount).times(new BigNumber(10).pow(decimals));
  if (notDp) {
    return result;
  }
  return result.dp(0);
};

export const byWei = (
  amount: BigNumber | string | number,
  decimals: number,
) => {
  return new BigNumber(amount).div(new BigNumber(10).pow(decimals));
};

export const getDecimalLimit = (decimals: number | undefined | null) =>
  Math.min(decimals ?? 6, 6);

export function getIntegerNumber(v: number) {
  return Number(v.toString().split('.')[0]);
}

const kilo = 1000;
const million = 1000000;
const billion = 1000000000;
function getNegative(num: number) {
  return new BigNumber(num).negated();
}

/**
 * format to short number, like: -0.12 -> 0, 0.0000123->0.000012, 123.234 -> 123.23, 1234.12 -> 1.23K, 1000000.123->1.00M
 * @param n
 */
export function formatShortNumber(n?: BigNumber, showDecimals = 4): string {
  if (!n || n.isNaN()) {
    return '-';
  }
  if (n.eq(0)) {
    return '0';
  }
  if (n.lte(0.000001) && n.gte(-0.000001)) {
    return n.toExponential(2);
  }
  if (n.lt(1) && n.gt(-1)) {
    return formatReadableNumber({ input: n, showDecimals });
  }
  if (n.lt(kilo) && n.gt(getNegative(kilo))) {
    return formatReadableNumber({ input: n, showDecimals });
  }
  if (n.lt(million) && n.gt(getNegative(million))) {
    return `${formatReadableNumber({ input: n.div(kilo), showDecimals: 2 })}K`;
  }
  return `${formatReadableNumber({
    input: n.div(million),
    showDecimals: 2,
  })}M`;
}

export function formatExponentialNotation(n?: BigNumber) {
  if (!n || n.isNaN()) {
    return '-';
  }
  if (n.isZero()) {
    return '0';
  }
  if (n.lte(billion) && n.gt(getNegative(billion))) {
    return formatShortNumber(n);
  }

  const n1 = n.toExponential(2);
  if (n1.includes('e+')) {
    const [a1, b1] = n1.split('e+');
    if (a1 && b1) {
      return `${a1}x10^${b1}`;
    }
  }
  return n1;
}

/**
 * format to percentage number
 * @param param0 input number
 */
export function formatPercentageNumber({
  input,
  showDecimals = 2,
  /** The percentage is rounded by default. */
  roundingMode = BigNumber.ROUND_HALF_UP,
}: {
  input?: BigNumber | string | number | null;
  showDecimals?: number;
  roundingMode?: BigNumber.RoundingMode;
}): string {
  if (input === null || input === undefined) {
    return '-';
  }
  return `${formatReadableNumber({
    input: new BigNumber(input || 0).multipliedBy(100),
    showDecimals,
    roundingMode,
  })}%`;
}

export const formatApy = (amount: BigNumber, showDecimals = 2): string => {
  return formatPercentageNumber({
    input: amount,
    showDecimals,
  });
};

export function formatUnknownTokenSymbol(
  token?: {
    symbol: string;
    name: string;
  } | null,
) {
  if (!token) {
    return '';
  }
  return token.symbol === 'unknown' ? token.name : token.symbol;
}
