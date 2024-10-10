import { useTheme } from '@dodoex/components';
import React from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';

export function useWidgetDevice() {
  const theme = useTheme();
  const width = useUserOptions((state) => state.width || 375);

  const isMobile = React.useMemo(() => {
    return width < theme.breakpoints.values.tablet;
  }, [width, theme.breakpoints.values]);

  const isTablet = React.useMemo(() => {
    return width < theme.breakpoints.values.tablet;
  }, [width, theme.breakpoints.values]);

  const minDevice = React.useCallback(
    (minWidth: number) => {
      return width > minWidth;
    },
    [width],
  );

  const maxDevice = React.useCallback(
    (maxWidth: number) => {
      return width < maxWidth;
    },
    [width],
  );

  return {
    isMobile,
    isTablet,
    minDevice,
    maxDevice,
  };
}
