import { Box, BoxProps, useTheme } from '@dodoex/components';
import { useWidgetDevice } from '../hooks/style/useWidgetDevice';

export const WIDGET_MODULE_CLASS_NAME = 'widget-module-container';

export default function WidgetContainer({ sx, ...props }: BoxProps) {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();
  return (
    <Box
      className={WIDGET_MODULE_CLASS_NAME}
      sx={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'background.default',
        ...(isMobile
          ? {
              padding: 0,
              height: '100%',
              width: '100%',
              overflowX: 'hidden',
            }
          : {
              padding: theme.spacing(28, 20, 40, 40),
              height: 'auto',
            }),
        ...sx,
      }}
      {...props}
    />
  );
}
