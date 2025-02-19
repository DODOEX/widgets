# 背景知识
我们创建的[合约](https://www.notion.so/dodotopia/soon-testnet-16f080d974e780bc96ffcf5017749dfa) 
  > [univ2]( https://explorer.testnet.soo.network/address/7edX7tQeA2wFLPAJGMXaAMgQCFsCucfh8U13uwy5SEfG/security) 使用 [raydium 源码](https://github.com/raydium-io/raydium-cp-swap) 在 soon 链上进行部署, 在 radium 官方称为 cpmm. 在 [radium 官网](https://raydium.io/liquidity/create-pool/) 选择 **Standard AMM** 模式创建

  > [univ3](https://explorer.testnet.soo.network/address/2cjsT5HYL1qM8KmhdCjjJrXSrnMpbDbDruAT7UYTH8af) 使用 [raydium 源码](https://github.com/raydium-io/raydium-clmm) 在 soon 链上部署，在 raydium 官方被称为 clmm. 在 [raydium 官网](https://raydium.io/clmm/create-pool/)选择 **Concentrated Liquidity** 模式创建 

# raydium 提供的工具

1. [raydium-sdk-v2](https://github.com/raydium-io/raydium-sdk-V2) 其中提供一些方法用于计算询价路径，或许可以复用。结合 raydium-cp-swap 合约源码梳理出来询价实现方式，放置在 widgets 中
2. [raydium-sdk-V2-demo](https://github.com/raydium-io/raydium-sdk-V2-demo/blob/master/src/cpmm/swap.ts) 中提供了 swap demo 可以参考

# 实现

> 将 soon 上面部署的 cpmm 合约接入到 raydium-sdk-V2-demo 中，测试 swap 能否运行
> testnet 上进行测试

1. clone sdk demo, 直接使用 @raydium-io/raydium-sdk-v2 包
2. 修改 config.ts，启动 demo
3. 运行 demo 中 raydium 提供的池子
4. 修改默认池子为 soon 上面部署的 cpmm 池子
5. 再次运行，查看运行结果
6. 通过，则将修改接入到 widgets 中

# 创建 cpmm 资金池

> 参考 raydium-sdk-V2-demo

soon 上面创建资金池的 [tx](https://explorer.testnet.soo.network/tx/2Ym4Rsqi3EQyvqm2gK95cTjMzFnKUXh86U2en3bcrgtcaEZV9g5Rngo5AqrfwwJQyRGkqgL12ETE9YZVwT9qxpiE)

[创建成功](https://explorer.testnet.soo.network/tx/62LayoVAuDeqDBpDry5DuHE9Hp9PfCPZo5uBFgQRUkr6C8vFzQQ6EE3vKzSc6td4JsdrosqjvHS5YEBjZBn1wdyt)
使用如下参数调用`raydium.cpmm.createPool(params)`
```json
{
  programId: PublicKey [PublicKey(7edX7tQeA2wFLPAJGMXaAMgQCFsCucfh8U13uwy5SEfG)] {
    _bn: <BN: 62c9e76b8f4a11425e3c77ced775947fe0990636e3747e6cba2ae923e431ea27>
  },
  poolFeeAccount: PublicKey [PublicKey(H2aUP7F3sby7cGrZoKDn1GiPRsw5TjPoPc6kYYasfLYE)] {
    _bn: <BN: ee226b2c27525e2db7482670b8fed30b628c50fd88ffdbeb6856f169bca989af>
  },
  mintA: {
    chainId: 101,
    address: '5FLzARYothWbBDeiJAqwzusz4hM2ah4QrGxXW6X4RRWZ',
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    logoURI: '',
    symbol: '5FLzAR',
    name: '5FLzAR',
    decimals: 9,
    tags: [],
    extensions: {},
    priority: 0,
    type: 'unknown'
  },
  mintB: {
    chainId: 101,
    address: '4wnJ7T4w92YM3Taet7DtTUMquDv8HDkktQbpbAH5itHz',
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    logoURI: '',
    symbol: '4wnJ7T',
    name: '4wnJ7T',
    decimals: 9,
    tags: [],
    extensions: {},
    priority: 0,
    type: 'unknown'
  },
  mintAAmount: <BN: 3b9aca00>,
  mintBAmount: <BN: 3b9aca00>,
  startTime: <BN: 0>,
  feeConfig: {
    id: 'CH6Hqtxeo2vdyn5BvXB952sy4e2hiWEPLZFn74wGDMVz',
    index: 0,
    protocolFeeRate: 200,
    tradeFeeRate: 1000,
    fundFeeRate: 100,
    createPoolFee: '10000000'
  },
  associatedOnly: false,
  ownerInfo: { useSOLBalance: true },
  txVersion: 1
}
```
返回如下参数
```json
{
  txId: '62LayoVAuDeqDBpDry5DuHE9Hp9PfCPZo5uBFgQRUkr6C8vFzQQ6EE3vKzSc6td4JsdrosqjvHS5YEBjZBn1wdyt',
  poolKeys: {
    poolId: '4EEQHCu1x1nQBgAbMQ9nNfpHSFUcWzT7H2Mjap3Tm2Uh',
    configId: 'CH6Hqtxeo2vdyn5BvXB952sy4e2hiWEPLZFn74wGDMVz',
    authority: 'CCNshEd9DrBDuxxDscq6A9q8TN8dhVvLE3rXdA2jjoFn',
    lpMint: 'HJdGEWtrYaJWcxqygDvDdNy4wiB2hqeHcGV6CFtNjtKZ',
    vaultA: '7DZukWpYwbmn5RGxbM81NCQEbAWm4J7KhHePCFjr2B14',
    vaultB: 'BEuNwTYPaKdFMQmw3znmfyU2ezyD7fLwbzzLbR7Grsoi',
    observationId: '6hmXs7cQN9enR3iofMDWXJVTrMbxcPSEdyMKc3YwXNaf',
    mintA: '[object Object]',
    mintB: '[object Object]',
    programId: '7edX7tQeA2wFLPAJGMXaAMgQCFsCucfh8U13uwy5SEfG',
    poolFeeAccount: 'H2aUP7F3sby7cGrZoKDn1GiPRsw5TjPoPc6kYYasfLYE',
    feeConfig: '[object Object]'
  }
}
```

# 创建 clmm 资金池

[创建成功](https://explorer.testnet.soo.network/tx/4PDiA79uryojV4Jabn7ZU5VH2h1g8MpnoXkyvvUYaEDZLoyy61XuiVuwhXcJSToR9eScGGjhuHuxK2sZCWhAfEuk) [clmm 池子](https://explorer.testnet.soo.network/address/6tvyKAe7gF2Qtm2ur94nZa7QsYSATFyZSdm7Be53Fbf1)