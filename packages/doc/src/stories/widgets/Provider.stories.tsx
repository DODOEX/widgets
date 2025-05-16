import { SwapWidget, SwapWidgetProps } from '@dodoex/widgets';

export default {
  title: 'Widgets/Provider',
  component: 'div',
};

export const Primary = (args: SwapWidgetProps) => {
  return <SwapWidget {...args} />;
};

Primary.args = {
  apikey: 'ef9apopzq9qrgntjubojbxe7hy4z5eez',
  crossChain: true,
};
