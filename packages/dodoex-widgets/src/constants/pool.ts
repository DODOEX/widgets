export const AUTO_SWAP_SLIPPAGE_PROTECTION = 'auto';
export const AUTO_LIQUIDITY_SLIPPAGE_PROTECTION = '0.1';
export const AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION = '0.5';
export const AUTO_AMM_V3_LIQUIDITY_SLIPPAGE_PROTECTION = '0.5';

/**
 * slippage protection
 * First read out the reserve of the pool base and quote. If the slippage is 1%, then it is reserve * 0.99 and pass in func.
 */
export const SLIPPAGE_PROTECTION = 0.01;
