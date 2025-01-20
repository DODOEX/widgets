export function formatAmountWithAlphabetSymbol(
  amount: string | undefined,
  decimals = 3,
): string {
  if (amount === undefined) return '';
  const amountNum = Number(amount);
  const minAmount = 1 / 10 ** decimals;

  if (amountNum === 0 || amountNum < 0.0000001) return '0';
  if (amountNum < minAmount) return `< ${minAmount}`;
  if (amountNum < 1)
    return (Math.floor(amountNum / minAmount) * minAmount).toFixed(decimals);
  if (amountNum < 100) return (Math.floor(amountNum * 100) / 100).toString();
  if (amountNum < 10000) return Math.floor(amountNum).toString();

  if (amountNum < 1000000000000000)
    return String(Math.floor(amountNum * 100) / 100);

  return '∞';
}
