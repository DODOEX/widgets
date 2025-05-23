import { createRoot } from 'react-dom/client';

import { Swap, SwapProps } from './components/Swap';
import { Widget, WidgetProps } from './components/Widget';
import { Pool } from './widgets/PoolWidget';

export { EmptyList } from './components/List/EmptyList';
export { FailedList } from './components/List/FailedList';
export { Swap } from './components/Swap';
export { TokenCard } from './components/Swap/components/TokenCard';
export { default as SwapOrderHistory } from './components/Swap/SwapOrderHistory';
export { default as TokenLogo } from './components/TokenLogo';
export {
  Message,
  UnstyleWidget,
  Widget,
  WIDGET_CLASS_NAME,
} from './components/Widget';
export type { WidgetProps } from './components/Widget';
export { WIDGET_MODULE_CLASS_NAME } from './components/WidgetContainer';

export { chainListMap } from './constants/chainList';
export { rpcServerMap, scanUrlDomainMap } from './constants/chains';
export { default as defaultTokenList } from './constants/tokenList';

export { MetadataFlag } from './hooks/Submission/types';
export { useTradeSwapOrderList } from './hooks/Swap/useTradeSwapOrderList';
export type { TokenInfo } from './hooks/Token/type';
export { useMessageState } from './hooks/useMessageState';

export { PageType, useRouterStore } from './router';
export type { Page } from './router';

export { getEtherscanPage } from './utils/address';
export {
  formatPercentageNumber,
  formatReadableNumber,
  formatShortNumber,
  formatTokenAmountNumber,
} from './utils/formatter';

export { MiningCreate } from './widgets/MiningWidget/MiningCreate';
export { MiningDetail } from './widgets/MiningWidget/MiningDetail';
export { MiningList } from './widgets/MiningWidget/MiningList';
export { Pool } from './widgets/PoolWidget';
export { default as AMMV2Create } from './widgets/PoolWidget/AMMV2Create';
export { default as AddLiquidityV3 } from './widgets/PoolWidget/AMMV3/AddLiquidityV3';
export { AMMV3PositionManage } from './widgets/PoolWidget/AMMV3/AMMV3PositionManage';
export { AMMV3PositionsView } from './widgets/PoolWidget/AMMV3/AMMV3PositionsView';
export { usePoolBalanceInfo } from './widgets/PoolWidget/hooks/usePoolBalanceInfo';
export { default as PoolCreate } from './widgets/PoolWidget/PoolCreate';
export { default as PoolDetail } from './widgets/PoolWidget/PoolDetail';
export { default as PoolList } from './widgets/PoolWidget/PoolList';
export { default as PoolModify } from './widgets/PoolWidget/PoolModify';
export {
  PoolOperate,
  default as PoolOperateDialog,
} from './widgets/PoolWidget/PoolOperate';
export type { PoolOperateProps } from './widgets/PoolWidget/PoolOperate';

export type SwapWidgetProps = WidgetProps & SwapProps;

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <Swap
        getAutoSlippage={props.getAutoSlippage}
        onPayTokenChange={props.onPayTokenChange}
        onReceiveTokenChange={props.onReceiveTokenChange}
      />
    </Widget>
  );
}

export function PoolWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <Pool />
    </Widget>
  );
}

// For none-react project!
export function InitSwapWidget(props: SwapWidgetProps) {
  const rootEl = document.getElementById('dodo-swap-widget');
  const root = createRoot(rootEl!);
  root.render(
    <Widget {...props}>
      <Swap
        getAutoSlippage={props.getAutoSlippage}
        onPayTokenChange={props.onPayTokenChange}
        onReceiveTokenChange={props.onReceiveTokenChange}
      />
    </Widget>,
  );
}
