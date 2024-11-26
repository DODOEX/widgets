import { Swap, SwapProps } from './components/Swap';
import { createRoot } from 'react-dom/client';
import { Widget, WidgetProps } from './components/Widget';
export { useRouterStore, PageType } from './router';
export type { Page } from './router';

export { WIDGET_CLASS_NAME } from './components/Widget';

export { MetadataFlag } from './hooks/Submission/types';

export { rpcServerMap, scanUrlDomainMap } from './constants/chains';
export { chainListMap } from './constants/chainList';
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
export { default as PoolList } from './widgets/PoolWidget/PoolList';
export { default as PoolCreate } from './widgets/PoolWidget/PoolCreate';
export { default as AMMV2Create } from './widgets/PoolWidget/AMMV2Create';
export { default as PoolModify } from './widgets/PoolWidget/PoolModify';
export { default as PoolDetail } from './widgets/PoolWidget/PoolDetail';
export {
  default as PoolOperateDialog,
  PoolOperate,
} from './widgets/PoolWidget/PoolOperate';
export type { PoolOperateProps } from './widgets/PoolWidget/PoolOperate';
export { usePoolBalanceInfo } from './widgets/PoolWidget/hooks/usePoolBalanceInfo';
export { MiningList } from './widgets/MiningWidget/MiningList';
export { MiningDetail } from './widgets/MiningWidget/MiningDetail';
export { MiningCreate } from './widgets/MiningWidget/MiningCreate';
export { default as AddLiquidityV3 } from './widgets/PoolWidget/AMMV3/AddLiquidityV3';
export { AMMV3PositionsView } from './widgets/PoolWidget/AMMV3/AMMV3PositionsView';
export { AMMV3PositionManage } from './widgets/PoolWidget/AMMV3/AMMV3PositionManage';

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
