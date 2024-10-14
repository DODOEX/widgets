import {
  fixedInputStringToFormattedNumber,
  fixedString,
  formatReadableNumber,
  formatTokenAmountNumber,
  getDecimalLimit,
  toWei,
} from './formatter';

describe('formatReadableNumber', () => {
  it('abnormal input', () => {
    expect(
      formatReadableNumber({
        input: '',
      }),
    ).toBe('-');
    expect(
      formatReadableNumber({
        input: 'abc',
      }),
    ).toBe('-');
  });
  it('normal input', () => {
    expect(
      formatReadableNumber({
        input: 123,
      }),
    ).toBe('123');
    expect(
      formatReadableNumber({
        input: 123.8888,
        showDecimals: 2,
      }),
    ).toBe('123.88');
    expect(
      formatReadableNumber({
        input: 123.8888,
        showIntegerOnly: true,
      }),
    ).toBe('123');
    expect(
      formatReadableNumber({
        input: 123.8888,
        showDecimalsOnly: true,
      }),
    ).toBe('0.8888');
    expect(
      formatReadableNumber({
        input: 0.00000000000000000123,
      }),
    ).toBe('1.2e-18');
    expect(
      formatReadableNumber({
        input: 0.00000000000000000123,
        showPrecisionDecimals: 20,
        exponentialDecimalsAmount: 20,
      }),
    ).toBe('0.00000000000000000123');
    expect(
      formatReadableNumber({
        input: '132231123123.888',
      }),
    ).toBe('132,231,123,123.888');
    expect(
      formatReadableNumber({
        input: '132231123123.888',
        noGroupSeparator: true,
      }),
    ).toBe('132231123123.888');
  });
});

describe('formatTokenAmountNumber', () => {
  it('abnormal input', () => {
    expect(
      formatTokenAmountNumber({
        input: '',
      }),
    ).toBe('-');
    expect(
      formatTokenAmountNumber({
        input: undefined,
      }),
    ).toBe('-');
    expect(
      formatTokenAmountNumber({
        input: 'abc',
      }),
    ).toBe('-');
  });
  it('normal input', () => {
    expect(
      formatTokenAmountNumber({
        input: 123,
      }),
    ).toBe('123');
    expect(
      formatTokenAmountNumber({
        input: 123.8888,
        decimals: 2,
      }),
    ).toBe('123.88');
    expect(
      formatTokenAmountNumber({
        input: 0.00000000000000000123,
      }),
    ).toBe('1.2e-18');
    expect(
      formatTokenAmountNumber({
        input: 0.00000000000000000123,
        showPrecisionDecimals: 20,
      }),
    ).toBe('1.23e-18');
    expect(
      formatTokenAmountNumber({
        input: '132231123123.888',
      }),
    ).toBe('132,231,123,123');
    expect(
      formatTokenAmountNumber({
        input: '132231123123',
        noGroupSeparator: true,
      }),
    ).toBe('132231123123');
  });
});

describe('fixedString', () => {
  it('abnormal input', () => {
    expect(fixedString('')).toBe('');
    expect(fixedString('aa')).toBe('aa');
  });

  it('normal input', () => {
    expect(fixedString(1.3567)).toBe('1.3567');
    expect(fixedString(1.3567, 2)).toBe('1.35');
    expect(fixedString('1.3567', 2)).toBe('1.35');
  });
});

describe('fixedInputStringToFormattedNumber', () => {
  it('abnormal input', () => {
    expect(fixedInputStringToFormattedNumber('', 2)).toBe('');
    expect(fixedInputStringToFormattedNumber('aa', 2)).toBe('');
  });
  it('normal input', () => {
    expect(fixedInputStringToFormattedNumber('1.3567', 2)).toBe('1.35');
    expect(fixedInputStringToFormattedNumber('1。3567', 2)).toBe('1.35');
  });
});

describe('toWei', () => {
  it('abnormal input', () => {
    expect(toWei('', 8).isNaN()).toBeTruthy();
    expect(toWei('aa', 8).isNaN()).toBeTruthy();
    expect(toWei('0。00000001', 8).isNaN()).toBeTruthy();
  });
  it('normal input', () => {
    expect(toWei('0.00000001', 8).toNumber()).toBe(1);
  });
});

describe('getDecimalLimit', () => {
  it('can not more than 6', () => {
    expect(getDecimalLimit(8)).toBe(6);
    expect(getDecimalLimit(3)).toBe(3);
  });
});
