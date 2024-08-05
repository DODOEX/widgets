import { Swap } from './components/Swap';
import { createRoot } from 'react-dom/client';
import { Widget, WidgetProps } from './components/Widget';

export type SwapWidgetProps = WidgetProps;
export type { TokenInfo } from './hooks/Token/type';

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <Swap
        getAutoSlippage={props.getAutoSlippage}
        onConnectWalletClick={props.onConnectWalletClick}
        onPayTokenChange={props.onPayTokenChange}
        onReceiveTokenChange={props.onReceiveTokenChange}
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
        onPayTokenChange={props.onPayTokenChange}
        onReceiveTokenChange={props.onReceiveTokenChange}
      />
    </Widget>,
  );
}
