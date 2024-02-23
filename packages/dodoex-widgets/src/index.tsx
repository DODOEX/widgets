import { Swap } from './components/Swap';
import { createRoot } from 'react-dom/client';
import { Widget, WidgetProps } from './components/Widget';
import { Pool } from './widgets/PoolWidget';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './providers/queryClient';

export type SwapWidgetProps = WidgetProps;
export type { TokenInfo } from './hooks/Token/type';

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <QueryClientProvider client={queryClient}>
        <Swap getAutoSlippage={props.getAutoSlippage} />
      </QueryClientProvider>
    </Widget>
  );
}

export function PoolWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <QueryClientProvider client={queryClient}>
        <Pool />
      </QueryClientProvider>
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
