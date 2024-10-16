import { Swap, SwapProps } from './components/Swap';
import { createRoot } from 'react-dom/client';
import { Widget, WidgetProps } from './components/Widget';
export { useRouterStore, PageType } from './router';
export type { Page } from './router';

export { WIDGET_CLASS_NAME } from './components/Widget';

export { MetadataFlag } from './hooks/Submission/types';

import { Pool } from './widgets/PoolWidget';
export { Widget, UnstyleWidget, Message } from './components/Widget';
export { WIDGET_MODULE_CLASS_NAME } from './components/WidgetContainer';
export type { WidgetProps } from './components/Widget';
export type SwapWidgetProps = WidgetProps & SwapProps;
export type { TokenInfo } from './hooks/Token/type';
export { useMessageState } from './hooks/useMessageState';
export { Swap } from './components/Swap';
export { default as SwapOrderHistory } from './components/Swap/SwapOrderHistory';
export { useTradeSwapOrderList } from './hooks/Swap/useTradeSwapOrderList';
export { Pool } from './widgets/PoolWidget';
export {
  default as PoolOperateDialog,
  PoolOperate,
} from './widgets/PoolWidget/PoolOperate';
export type { PoolOperateProps } from './widgets/PoolWidget/PoolOperate';
export { usePoolBalanceInfo } from './widgets/PoolWidget/hooks/usePoolBalanceInfo';
export { MiningList } from './widgets/MiningWidget/MiningList';

export { TokenCard } from './components/Swap/components/TokenCard';
export { default as TokenLogo } from './components/TokenLogo';
export { FailedList } from './components/List/FailedList';
export { EmptyList } from './components/List/EmptyList';
export { getEtherscanPage } from './utils/address';
export {
  formatReadableNumber,
  formatTokenAmountNumber,
  formatShortNumber,
  formatPercentageNumber,
} from './utils/formatter';

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
