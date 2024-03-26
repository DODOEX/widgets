import { t } from '@lingui/macro';

// \{\{([A-Za-z]+)\}\} to ${params.$1}
export function chartT(key: string, params: any) {
  switch (key) {
    case 'depth-chart.tips.buy':
      return t`Users pay ${params.amountText} ${params.baseTokenSymbol} and receive ${params.oppositeAmountText} ${params.quoteTokenSymbol}\nPrice ${params.priceText} (${params.slippageText}%)`;
    case 'depth-chart.tips.mid-price':
      return t`Initial Price ${params.amountText} ${params.baseTokenSymbol} = ${params.oppositeAmountText} ${params.quoteTokenSymbol}`;
    case 'depth-chart.tips.sell':
      return t`Users pay ${params.oppositeAmountText} ${params.quoteTokenSymbol} and receive ${params.amountText} ${params.baseTokenSymbol}\nPrice ${params.priceText} (${params.slippageText}%)`;
    case 'pool.chart.buy-amount':
      return t`Users sell ${params.symbol} amount: `;
    case 'pool.chart.price-impact':
      return t`Price Impact: ${params.amount}`;
    case 'pool.chart.sell-amount':
      return t`Users buy ${params.symbol} amount: `;
    case 'pool.create.disabled-token-amount':
      return t`The token amount is calculated by initial price.`;
    case 'pool.create.set-pool.emulator.title':
      return t`Emulator`;
    case 'pool.create.set-pool.emulator.title.question':
      return t`The liquidity of DODO is continuous, which is different from the discrete liquidity of UniV3. The ticks shown in the illustration are for demonstration purposes only.`;

    // liquidity-chart
    case 'pool.chart.liquidity-chart-tip':
      return t`The area of the chart indicates the buy/sell volume of ${params.baseTokenSymbol} that can be carried by the market when the current price changes to the hover price. `;
    case 'pool.chart.liquidity-chart-buy':
      return t`Bought ${params.amount} ${params.symbol}, price in the pool decreased to ${params.price}`;
    case 'pool.chart.liquidity-chart-sell':
      return t`Traders sold ‪${params.amount}‬ ${params.symbol}, price in the pool increased to ${params.price}`;
    default:
      throw new Error(`Unknown key ${key}`);
  }
}
