# 背景知识
我们创建的[合约](https://www.notion.so/dodotopia/soon-testnet-16f080d974e780bc96ffcf5017749dfa) 其中 [univ2]( https://explorer.testnet.soo.network/address/7edX7tQeA2wFLPAJGMXaAMgQCFsCucfh8U13uwy5SEfG/security) 使用 raydium [源码](https://github.com/raydium-io/raydium-cp-swap) 在 soon 链上进行部署, 在 radium 官方称为 cpmm.  在 [radium 官网](https://raydium.io/liquidity/create-pool/) 选择 **Standard AMM** 模式创建

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