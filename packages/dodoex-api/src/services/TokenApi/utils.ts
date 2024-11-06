export const isSameAddress = (
  tokenAddress1: string,
  tokenAddress2: string,
): boolean => {
  const tokenAddress1Len = tokenAddress1.length;
  const tokenAddress2Len = tokenAddress2.length;
  if (tokenAddress1Len === 0 || tokenAddress2Len === 0) {
    return false;
  }
  if (tokenAddress1Len === tokenAddress2Len) {
    return tokenAddress1.toLowerCase() === tokenAddress2.toLowerCase();
  }
  const trimAddress1 = tokenAddress1
    .substring(2, tokenAddress1Len)
    .toLowerCase();
  const trimAddress2 = tokenAddress2
    .substring(2, tokenAddress1Len)
    .toLowerCase();
  if (trimAddress1.length > trimAddress2.length) {
    return trimAddress1.endsWith(trimAddress2);
  }
  return trimAddress2.endsWith(trimAddress1);
};
