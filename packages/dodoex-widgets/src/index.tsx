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
export { ReviewDialog } from './components/Swap/components/ReviewDialog';
export { useInflights } from './hooks/Submission';
export { default as ConnectWallet } from './components/Swap/components/ConnectWallet';
export { TokenPairPriceWithToggle } from './components/Swap/components/TokenPairPriceWithToggle';
export { useSlippageLimit, getMaxSlippageWarning } from './hooks/Swap/useSlippageLimit';
export { useFetchETHBalance } from './hooks/contract';
export { useSetAutoSlippage } from './hooks/setting/useSetAutoSlippage';
export { useMarginAmount, useFetchFiatPrice } from './hooks/Swap';
export { useSwapSlippage } from './hooks/Swap/useSwapSlippage';
export { SwapSettingsDialog } from './components/Swap/components/SwapSettingsDialog';
export { AddressWithLinkAndCopy } from './components/AddressWithLinkAndCopy';
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
export { default as AMMV3Create } from './widgets/PoolWidget/AMMV3/AddLiquidityV3';
export { default as AddLiquidityList } from './widgets/PoolWidget/PoolList/AddLiquidity';
export { default as MyLiquidityList } from './widgets/PoolWidget/PoolList/MyLiquidity';
export { default as MyCreatedList } from './widgets/PoolWidget/PoolList/MyCreated';
export { usePoolListTabs, PoolTab } from './widgets/PoolWidget/PoolList/hooks/usePoolListTabs';
export { usePoolListFilterChainId } from './widgets/PoolWidget/PoolList/hooks/usePoolListFilterChainId';
export { CreatePoolBtn } from './widgets/PoolWidget/PoolList/components/CreatePoolBtn'; 
export { usePoolListFilterTokenAndPool } from './widgets/PoolWidget/PoolList/hooks/usePoolListFilterTokenAndPool';
export { default as TokenAndPoolFilter } from './widgets/PoolWidget/PoolList/components/TokenAndPoolFilter';
export { default as TokenListPoolItem } from './widgets/PoolWidget/PoolList/components/TokenListPoolItem';

export { useTokenStatus } from './hooks/Token/useTokenStatus';
export { useFetchRoutePrice, RoutePriceStatus } from './hooks/Swap';
export { default as TokenStatusButton } from './components/TokenStatusButton';
export { default as TokenPairStatusButton } from './components/TokenPairStatusButton';
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
        slippageQuickInput={props.slippageQuickInput}
        showPreviewInfoCard={props.showPreviewInfoCard}
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
