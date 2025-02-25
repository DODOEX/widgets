/**
 * SVM_AMMV2 -> CPMM
 * @see https://github.com/raydium-io/raydium-cp-swap
 * @see [univ2]( https://explorer.testnet.soo.network/address/7edX7tQeA2wFLPAJGMXaAMgQCFsCucfh8U13uwy5SEfG/security) 使用 [raydium 源码](https://github.com/raydium-io/raydium-cp-swap) 在 soon 链上进行部署, 在 radium 官方称为 cpmm. 在 [radium 官网](https://raydium.io/liquidity/create-pool/) 选择 **Standard AMM** 模式创建
 */
export const CPMM = 'SVM_AMMV2';

/**
 * SVM_AMMV3 -> CLMM
 * @see https://github.com/raydium-io/raydium-clmm
 * @see [univ3](https://explorer.testnet.soo.network/address/2cjsT5HYL1qM8KmhdCjjJrXSrnMpbDbDruAT7UYTH8af) 使用 [raydium 源码](https://github.com/raydium-io/raydium-clmm) 在 soon 链上部署，在 raydium 官方被称为 clmm. 在 [raydium 官网](https://raydium.io/clmm/create-pool/)选择 **Concentrated Liquidity** 模式创建
 */
export const CLMM = 'SVM_AMMV3';

export type PoolType = typeof CPMM | typeof CLMM;
