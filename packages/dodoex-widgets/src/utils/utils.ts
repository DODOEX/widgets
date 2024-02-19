export const increaseArray = (len: number) => {
  return Object.keys(new Array(len + 1).join(','));
};
