import { ChainId } from '@dodoex/api';
import { createRoot } from 'react-dom/client';
import { Swap, SwapProps } from './components/Swap';
import { Widget, WidgetProps } from './components/Widget';
import { Pool } from './widgets/PoolWidget';
import { Ve33PoolDetail } from './widgets/ve33/Ve33PoolDetail';
import { Ve33PoolList } from './widgets/ve33/Ve33PoolList';
import { VotePoolList } from './widgets/ve33/VotePoolList';
export { PageType, useRouterStore } from './router';
export type { Page } from './router';

export { WIDGET_CLASS_NAME } from './components/Widget';

export { MetadataFlag } from './hooks/Submission/types';

export { Swap } from './components/Swap';
export { default as SwapOrderHistory } from './components/Swap/SwapOrderHistory';
export { Message, UnstyleWidget, Widget } from './components/Widget';
export type { WidgetProps } from './components/Widget';
export { WIDGET_MODULE_CLASS_NAME } from './components/WidgetContainer';
export { chainListMap } from './constants/chainList';
export { rpcServerMap, scanUrlDomainMap } from './constants/chains';
export { useTradeSwapOrderList } from './hooks/Swap/useTradeSwapOrderList';
export type { TokenInfo } from './hooks/Token/type';
export { useMessageState } from './hooks/useMessageState';
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

export { Ve33PoolDetail } from './widgets/ve33/Ve33PoolDetail';
export { Ve33PoolList } from './widgets/ve33/Ve33PoolList';

export type SwapWidgetProps = WidgetProps & SwapProps;

export { EmptyList } from './components/List/EmptyList';
export { FailedList } from './components/List/FailedList';
export { TokenCard } from './components/Swap/components/TokenCard';
export { default as TokenLogo } from './components/TokenLogo';
export { getEtherscanPage } from './utils/address';
export {
  formatPercentageNumber,
  formatReadableNumber,
  formatShortNumber,
  formatTokenAmountNumber,
} from './utils/formatter';

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <Swap
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

export function Ve33PoolListWidget(
  props: WidgetProps & {
    onClickPoolListRow: (id: string, chainId: ChainId) => void;
  },
) {
  const { onClickPoolListRow, ...rest } = props;
  return (
    <Widget {...rest}>
      <Ve33PoolList onClickPoolListRow={onClickPoolListRow} />
    </Widget>
  );
}

export function VotePoolListWidget(props: WidgetProps) {
  const { ...rest } = props;
  return (
    <Widget {...rest}>
      <VotePoolList />
    </Widget>
  );
}

export function Ve33PoolDetailWidget(
  props: WidgetProps & {
    id: string;
    chainId: ChainId;
    onClickGoBack: () => void;
  },
) {
  const { id, chainId, onClickGoBack, ...rest } = props;
  return (
    <Widget {...rest}>
      <Ve33PoolDetail id={id} chainId={chainId} onClickGoBack={onClickGoBack} />
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
        onPayTokenChange={props.onPayTokenChange}
        onReceiveTokenChange={props.onReceiveTokenChange}
      />
    </Widget>,
  );
}
