import { useTheme } from '@dodoex/components';
import React from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';

export function useWidgetDevice() {
  const theme = useTheme();
  const widthProps = useUserOptions((state) => state.width);
  const [width, setWidth] = React.useState(
    widthProps ??
      (typeof window === 'undefined' ? 375 : document.body.clientWidth),
  );

  React.useEffect(() => {
    const listener = () => {
      setWidth(typeof window === 'undefined' ? 375 : document.body.clientWidth);
    };
    if (typeof widthProps !== 'number') {
      listener();
      window.addEventListener('resize', listener);
    } else {
      setWidth(widthProps);
    }

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [widthProps]);

  const isMobile = React.useMemo(() => {
    return typeof width === 'number' && width < theme.breakpoints.values.tablet;
  }, [width, theme.breakpoints.values]);

  const isTablet = React.useMemo(() => {
    return typeof width === 'number' && width < theme.breakpoints.values.tablet;
  }, [width, theme.breakpoints.values]);

  const isLaptop = React.useMemo(() => {
    return typeof width === 'number' && width > theme.breakpoints.values.laptop;
  }, [width, theme.breakpoints.values]);

  const isDesktop = React.useMemo(() => {
    return (
      typeof width === 'number' && width > theme.breakpoints.values.desktop
    );
  }, [width, theme.breakpoints.values]);

  const minDevice = React.useCallback(
    (minWidth: number) => {
      return typeof width === 'number' && width > minWidth;
    },
    [width],
  );

  const maxDevice = React.useCallback(
    (maxWidth: number) => {
      return typeof width === 'number' && width < maxWidth;
    },
    [width],
  );

  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    minDevice,
    maxDevice,
  };
}
