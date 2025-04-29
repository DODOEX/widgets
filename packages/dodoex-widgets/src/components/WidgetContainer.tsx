import { Box, BoxProps } from '@dodoex/components';
import React from 'react';
import { useWidgetDevice } from '../hooks/style/useWidgetDevice';

export const WIDGET_MODULE_CLASS_NAME = 'widget-module-container';

const WidgetContainer = React.forwardRef(function WidgetContainer(
  { sx, ...props }: BoxProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { isMobile } = useWidgetDevice();
  return (
    <Box
      className={WIDGET_MODULE_CLASS_NAME}
      ref={ref}
      sx={{
        flex: 1,
        backgroundColor: 'transparent',
        ...(isMobile
          ? {
              padding: 0,
              height: '100%',
              width: '100%',
              overflowX: 'hidden',
            }
          : {
              padding: 0,
              height: 'auto',
            }),
        ...sx,
      }}
      {...props}
    />
  );
});

export default WidgetContainer;
