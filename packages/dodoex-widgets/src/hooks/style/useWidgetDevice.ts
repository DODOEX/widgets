import { useTheme } from '@dodoex/components';
import React from 'react';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../store/selectors/globals';

export function useWidgetDevice() {
  const theme = useTheme();
  const globalProps = useSelector(getGlobalProps);
  const width = React.useMemo(
    () => globalProps.width || 375,
    [globalProps.width],
  );

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
