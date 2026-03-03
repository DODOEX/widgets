# Crowdpooling Pool Detail 重构完成总结

## 已完成的工作

### 1. 创建了新的 CrowdpoolingPoolDetail Widget

**目录结构：**
```
packages/dodoex-widgets/src/widgets/CrowdpoolingWidget/CrowdpoolingPoolDetail/
├── index.tsx                           # 主入口文件（集成所有组件）
├── README.md                           # 文档说明
├── components/
│   ├── EmptyChart.tsx                  # 空图表占位组件
│   ├── DepthAndLiquidityChart.tsx      # 深度和流动性图表（含 Depth/Liquidity 切换）
│   ├── CrowdpoolingAmountChart.tsx     # 众筹金额统计图表
│   ├── CreatorsTable.tsx               # 创建者列表表格
│   ├── ParametersTable.tsx             # 众筹池参数表格
│   └── SwapsTable.tsx                  # 交易记录表格
└── hooks/                              # hooks 目录（预留）
```

### 2. 创建的组件说明

#### 主页面 (index.tsx)
- 集成了所有子组件
- 实现了按照 Figma 设计稿的布局：
  - 顶部：返回按钮 + 地址 + 状态标签
  - 左侧：图表区域（3个tabs）
  - 右侧：统计卡片
  - 底部：表格区域（3个tabs）
- 响应式设计（支持移动端和桌面端）

#### DepthAndLiquidityChart.tsx
- 深度图和流动性图的切换展示
- 使用项目中已有的图表组件（React.lazy 加载）
  - `components/chart/depth-chart`
  - `components/chart/liquidity-chart`
- 支持移动端和桌面端不同尺寸

#### CrowdpoolingAmountChart.tsx
- 展示 Taker Token 和 Creators 的统计数据
- 使用项目中已有的 `PoolWidget/PoolDetail/components/StatBarChart` 组件
- 支持日数据和小时数据的展示
- 使用 GraphQL 查询获取数据

#### CreatorsTable.tsx
- 显示参与者列表
- 支持分页加载
- 显示参与金额、美元价值、份额等信息

#### ParametersTable.tsx
- 显示众筹池的各项参数
- 双列布局（桌面端）/ 单列布局（移动端）
- 包含时间、代币信息、保护期等

#### SwapsTable.tsx
- 显示交易记录
- 支持分页加载
- 显示时间、交易者、类型、金额、手续费等
- 使用 GraphQL 查询获取数据

### 3. 使用的内部组件

**图表组件：**
- `components/chart/depth-chart/DepthChartKonva.tsx` - 深度图表
- `components/chart/liquidity-chart/LiquidityChartKonva.tsx` - 流动性图表
- `widgets/PoolWidget/PoolDetail/components/StatBarChart.tsx` - 统计柱状图

**其他组件：**
- `components/AddressWithLinkAndCopy` - 地址显示和复制
- `components/DataTable` - 数据表格
- `hooks/useWidgetDevice` - 响应式设备检测

### 4. 集成到主 Widget

更新了 `packages/dodoex-widgets/src/widgets/CrowdpoolingWidget/index.tsx`：
- 添加了 CrowdpoolingPoolDetail 的导入
- 添加了路由处理逻辑

### 5. 路由配置

路由类型已存在于 `packages/dodoex-widgets/src/router/types.ts`：
```typescript
[PageType.CrowdpoolingPoolDetail]: {
  address: string;
  chainId: ChainId;
}
```

## 主要改进

1. **架构优化**
   - 使用 widgets 架构，提高代码复用性
   - 组件化设计，便于维护和测试
   - 使用项目内部组件，避免外部依赖

2. **样式统一**
   - 使用统一的主题系统
   - 支持暗黑模式
   - 响应式设计

3. **类型安全**
   - 完整的 TypeScript 类型定义
   - 类型推导和检查

4. **性能优化**
   - React.lazy 懒加载图表组件
   - 分页加载数据
   - React Query 查询缓存

5. **用户体验**
   - 清晰的 Tab 切换
   - 统一的加载状态
   - 友好的空状态展示

## 设计参考

基于 Figma 设计稿实现：
https://www.figma.com/design/26FZbJodgP3eXVFtxQl4zP/FaroSwap（Pharos新链部署）?node-id=2171-31345

## 迁移说明

此实现从以下位置迁移而来：
- `~/dodo/dodo-young/packages/lite/src/pages-legacy/developers/Crowdpooling/Detail`

主要迁移的功能：
- ✅ 图表展示（Taker Token, Creators, Depth Chart）
- ✅ 参数表格
- ✅ 交易记录表格
- ✅ 创建者列表表格
- ✅ 统计卡片
- ✅ 响应式布局
- ✅ 使用项目内部组件（无外部依赖）

## 技术细节

### 图表组件使用

```typescript
// DepthAndLiquidityChart.tsx
const DepthChart = React.lazy(
  () => import('../../../../components/chart/depth-chart'),
);

const LiquidityChart = React.lazy(
  () => import('../../../../components/chart/liquidity-chart'),
);
```

### 统计图表使用

```typescript
// CrowdpoolingAmountChart.tsx
import StatBarChart from '../../../PoolWidget/PoolDetail/components/StatBarChart';
```

### GraphQL 数据获取

使用 `@tanstack/react-query` 和 `@dodoex/api` 的 `graphqlClient`：

```typescript
const { data: cpDayDataList = [] } = useQuery({
  enabled: !!detail?.id,
  queryKey: ['cpDayData', detail?.chainId, detail?.id],
  queryFn: async () => {
    const result = await graphqlClient.request<{
      crowdPoolingDayDatas: CPDayData[];
    }>(
      gql`query getCPDayData($crowdPooling: String!) { ... }`,
      { crowdPooling: detail.id.toLowerCase() },
      { chainId: detail.chainId }
    );
    return result.crowdPoolingDayDatas || [];
  },
});
```

## 待完善项

1. 右侧操作卡片的详细功能（可复用 CrowdpoolingDetail 的 ActionCard）
2. 添加更多的交互功能（如果需要）
3. 完善错误处理和边界情况
4. 添加单元测试

## 测试建议

1. 验证所有 tabs 的切换功能
2. 测试响应式布局（移动端 + 桌面端）
3. 验证数据加载和显示
4. 测试暗黑模式下的显示效果
5. 验证地址复制和跳转功能
6. 测试图表组件的懒加载
7. 验证 GraphQL 查询和数据显示

## 使用方法

```typescript
import { useRouterStore } from '@dodoex/widgets';
import { PageType } from '@dodoex/widgets/router/types';

// 跳转到 CrowdpoolingPoolDetail 页面
router.push({
  type: PageType.CrowdpoolingPoolDetail,
  params: {
    address: '0x...',
    chainId: 1,
  },
});
```

## 依赖关系

### 内部依赖
- `@dodoex/components` - UI 组件库
- `@dodoex/api` - API 和 GraphQL 客户端
- `@lingui/macro` - 国际化
- `@tanstack/react-query` - 数据获取和缓存
- `bignumber.js` - 大数计算
- `dayjs` - 时间处理
- `recharts` - 图表库（用于 StatBarChart）
- `react-konva` / `konva` - Canvas 图表（用于深度图/流动性图）

### 无外部依赖
所有图表组件均使用项目内部实现，不依赖 `@dodoex/chart` 包。

