export const getShowDateTime = (
  value: number | null,
  minDate?: number,
  maxDate?: number,
) => {
  const nowTime = new Date().valueOf();
  if (!value) {
    if (!minDate || minDate < nowTime) {
      return nowTime;
    }
    return minDate;
  }
  if (minDate && value < minDate) {
    return minDate;
  }
  if (maxDate && value > maxDate) {
    return maxDate;
  }
  return value;
};
