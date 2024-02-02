import { PoolWidget } from '@dodoex/widgets';
import React from 'react';

export default {
  title: 'Widgets/Pool',
  component: 'div',
};

export const Primary = (props: any) => {
  return <PoolWidget {...props} />;
};

Primary.args = {
  apiKey: 'ee53d6b75b12aceed4',
  width: 375,
  height: 494,
};
