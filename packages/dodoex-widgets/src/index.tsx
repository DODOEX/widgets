import { Swap } from './components/Swap';
import { createRoot } from 'react-dom/client';
import { Widget, WidgetProps } from './components/Widget';
export { useRouterStore, PageType } from './router';
export type { Page } from './router';

export { WIDGET_CLASS_NAME } from './components/Widget';

import { Pool } from './widgets/PoolWidget';
export { Widget } from './components/Widget';
export type SwapWidgetProps = WidgetProps;
export type { TokenInfo } from './hooks/Token/type';
export { Swap } from './components/Swap';
export { Pool } from './widgets/PoolWidget';
export {
  default as PoolOperateDialog,
  PoolOperate,
} from './widgets/PoolWidget/PoolOperate';
export type { PoolOperateProps } from './widgets/PoolWidget/PoolOperate';
export { usePoolBalanceInfo } from './widgets/PoolWidget/hooks/usePoolBalanceInfo';

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <Swap getAutoSlippage={props.getAutoSlippage} />
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
      <Swap getAutoSlippage={props.getAutoSlippage} />
    </Widget>,
  );
}
