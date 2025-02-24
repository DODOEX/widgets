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

mint 参数
```ts
const mint1 = {
  address: '5FLzARYothWbBDeiJAqwzusz4hM2ah4QrGxXW6X4RRWZ',
  programId: TOKEN_PROGRAM_ID,
  decimals: 9,
}
// USDT
const mint2 = {
  address: '4wnJ7T4w92YM3Taet7DtTUMquDv8HDkktQbpbAH5itHz',
  programId: TOKEN_PROGRAM_ID,
  decimals: 9,
}
```

调用 返回 
```json
clmm pool infos: {
  '6tvyKAe7gF2Qtm2ur94nZa7QsYSATFyZSdm7Be53Fbf1': {
    bump: 254,
    ammConfig: PublicKey [PublicKey(9vUeSD34ggBLRbqdyUALxwuMqbVCioMp4wQRriQ7ydPw)] {
      _bn: <BN: 8490897d99bd31459b1114d3080a1d378de11da0dbfa4664b8ec08c79ff4c782>
    },
    creator: PublicKey [PublicKey(CVVQYs9Pi3t4it4KFpm3hxk97uDA6AVzNVJvGQTPH17n)] {
      _bn: <BN: aabcf009056ce8756315fdfa8e2ae55bae2395d4b7089b9a68fc2d6e68ced9e9>
    },
    mintA: PublicKey [PublicKey(4wnJ7T4w92YM3Taet7DtTUMquDv8HDkktQbpbAH5itHz)] {
      _bn: <BN: 3a9ba3c42e39e10d3e9c02d0eaf74a06be0825b7d111fc9061f7ca37005ac4ed>
    },
    mintB: PublicKey [PublicKey(5FLzARYothWbBDeiJAqwzusz4hM2ah4QrGxXW6X4RRWZ)] {
      _bn: <BN: 3f1b7a0e0ea5c063fa05ee0f81a6953e75c110b9972e01ebf8c2141782803d82>
    },
    vaultA: PublicKey [PublicKey(5jAU7EvY2Xc1LcSuGr3faTbYUeUp9MvkjXzpPEA7PbkK)] {
      _bn: <BN: 463bd8b2cf6260ade12e99c20c83a1354c15b38dca140045d27781e3545f2248>
    },
    vaultB: PublicKey [PublicKey(GGB8JGHmDRMeSgdTzPs7weGKPXNAau6GTU9RFRwEHUft)] {
      _bn: <BN: e2c27720263408918c54ded6803e1d0769d4444f577be18abe78fb97e88be4ab>
    },
    observationId: PublicKey [PublicKey(A3EggYDZB89omHL1ezSVk9eBrqFK95eQS2m9AGxoyJ4n)] {
      _bn: <BN: 864bd112c1219fa093e1e70fdec19c7a5136632e7ac685aa5e22814006838f7f>
    },
    mintDecimalsA: 9,
    mintDecimalsB: 9,
    tickSpacing: 20,
    liquidity: <BN: 0>,
    sqrtPriceX64: <BN: 10000000000000000>,
    tickCurrent: 0,
    feeGrowthGlobalX64A: <BN: 0>,
    feeGrowthGlobalX64B: <BN: 0>,
    protocolFeesTokenA: <BN: 0>,
    protocolFeesTokenB: <BN: 0>,
    swapInAmountTokenA: <BN: 0>,
    swapOutAmountTokenB: <BN: 0>,
    swapInAmountTokenB: <BN: 0>,
    swapOutAmountTokenA: <BN: 0>,
    status: 0,
    '': [
      0, 0, 0, 0,
      0, 0, 0
    ],
    rewardInfos: [ [Object], [Object], [Object] ],
    tickArrayBitmap: [
      <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>
    ],
    totalFeesTokenA: <BN: 0>,
    totalFeesClaimedTokenA: <BN: 0>,
    totalFeesTokenB: <BN: 0>,
    totalFeesClaimedTokenB: <BN: 0>,
    fundFeesTokenA: <BN: 0>,
    fundFeesTokenB: <BN: 0>,
    startTime: <BN: 0>,
    padding: [
      <BN: 3>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>, <BN: 0>,
      <BN: 0>, <BN: 0>
    ],
    currentPrice: 1,
    programId: PublicKey [PublicKey(2cjsT5HYL1qM8KmhdCjjJrXSrnMpbDbDruAT7UYTH8af)] {
      _bn: <BN: 18037d017a19cdc21ec7fec45428585871996d8b9e8c2c987b8b00674a8ebbdc>
    }
  }
}
```