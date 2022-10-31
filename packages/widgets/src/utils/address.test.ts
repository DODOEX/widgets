import isZero, { isSameAddress } from './address';

describe('isSameAddress', () => {
  it('can not be an empty string', () => {
    const res = isSameAddress('', '');
    expect(res).toBeFalsy();
  });

  it('the same string', () => {
    const res = isSameAddress('0x352F', '0x352F');
    expect(res).toBeTruthy();
  });

  it('ignore case', () => {
    const res = isSameAddress('0x352F3', '0x352f3');
    expect(res).toBeTruthy();
  });

  it('when the length is different, the ends must be the same', () => {
    const res = isSameAddress('0Ax2352f3', '0x2352f3');
    expect(res).toBeTruthy();
  });
});

describe('isZero', () => {
  it('returns true when the argument is an empty address', () => {
    const res = isZero('0x0');
    expect(res).toBeTruthy();
  });
});
