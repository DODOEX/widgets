import { formatReadableTimeDuration } from './time';

describe('formatReadableTimeDuration', () => {
  it('second', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 3000,
    });
    expect(res).toBe('1 Second');
  });
  it('second-showSecondUnit', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 3000,
      showSecondUnit: true,
    });
    expect(res).toBe('1s');
  });
  it('seconds', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 5000,
    });
    expect(res).toBe('3 Seconds');
  });
  it('minute', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 65000,
    });
    expect(res).toBe('1 Minute');
  });
  it('minute-showSecondUnit', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 65000,
      showSecondUnit: true,
    });
    expect(res).toBe('1min3s');
  });
  it('minutes', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 125000,
    });
    expect(res).toBe('2 Minutes');
  });
  it('minutes-showSecondUnit', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 125000,
      showSecondUnit: true,
    });
    expect(res).toBe('2mins3s');
  });
  it('hover', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 4803000,
    });
    expect(res).toBe('1 Hour');
  });
  it('hover-showSecondUnit', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 4803000,
      showSecondUnit: true,
    });
    expect(res).toBe('1hour20minutes');
  });
  it('hovers', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 7203000,
    });
    expect(res).toBe('2 Hours');
  });
  it('day', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 93600000,
    });
    expect(res).toBe('1 Day');
  });
  it('day-showSecondUnit', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 93723000,
      showSecondUnit: true,
    });
    expect(res).toBe('1day2hours');
  });
  it('days', () => {
    const res = formatReadableTimeDuration({
      start: 2000,
      end: 180000000,
    });
    expect(res).toBe('2 Days');
  });
});
