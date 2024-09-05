import { Swap } from './components/Swap';
import { createRoot } from 'react-dom/client';
import { Widget, WidgetProps } from './components/Widget';

export type SwapWidgetProps = WidgetProps;
export type { TokenInfo } from './hooks/Token/type';

export { default as BridgeTonSummaryDialog } from './components/Widget/BridgeTonSummaryDialog';
export { Widget } from './components/Widget';

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <Swap
        getAutoSlippage={props.getAutoSlippage}
        onConnectWalletClick={props.onConnectWalletClick}
        bridgeToTonUrl={props.bridgeToTonUrl}
      />
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
        onConnectWalletClick={props.onConnectWalletClick}
        bridgeToTonUrl={props.bridgeToTonUrl}
      />
    </Widget>,
  );
}
