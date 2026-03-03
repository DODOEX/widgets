# CrowdpoolingPoolDetail Widget

这是一个新的 Crowdpooling Pool Detail 页面 widget，用于显示众筹池的详细信息。

## 文件结构

```
CrowdpoolingPoolDetail/
├── index.tsx                           # 主入口文件
├── components/
│   ├── EmptyChart.tsx                  # 空图表组件
│   ├── DepthAndLiquidityChart.tsx      # 深度和流动性图表
│   ├── CrowdpoolingAmountChart.tsx     # 众筹金额图表
│   ├── CreatorsTable.tsx               # 创建者表格
│   ├── ParametersTable.tsx             # 参数表格
│   └── SwapsTable.tsx                  # 交易表格
└── hooks/                              # hooks目录（待添加）
```

## 功能模块

### 1. 顶部区域
- 返回按钮
- 地址显示（可复制）
- 状态标签

### 2. 图表区域（左侧）
包含三个 tabs：
- **Taker Token**: 显示投资代币的统计图表
- **Creators**: 显示参与者数量的统计图表
- **Depth Chart**: 显示深度和流动性图表

### 3. 统计卡片（右侧）
显示：
- 进度条（非escalation模式）
- 参与人数
- 已筹集金额

### 4. 表格区域（底部）
包含三个 tabs：
- **Parameters**: 显示众筹池参数
- **Swaps**: 显示交易记录
- **Creators**: 显示创建者列表

## 数据来源

- `useCPDetail`: 获取众筹池详细信息
- `useCPDynamicStatus`: 获取动态状态
- GraphQL queries: 获取图表数据和交易记录

## 依赖的共享组件

- GoBack
- AddressWithLinkAndCopy
- WidgetContainer
- DataTable
- TokenLogo

## 路由配置

页面类型：`PageType.CrowdpoolingPoolDetail`

参数：
```typescript
{
  address: string;  // 众筹池地址
  chainId: ChainId; // 链ID
}
```

## 设计参考

基于 Figma 设计稿：
https://www.figma.com/design/26FZbJodgP3eXVFtxQl4zP/FaroSwap（Pharos新链部署）?node-id=2171-31345

## 迁移说明

此 widget 从以下位置重构而来：
- `~/dodo/dodo-young/packages/lite/src/pages-legacy/developers/Crowdpooling/Detail`

主要改进：
1. 使用 widgets 架构，更好的代码复用
2. 统一的样式系统和主题
3. 更好的类型支持
4. 响应式设计
