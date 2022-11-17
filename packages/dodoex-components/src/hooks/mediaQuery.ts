import useMediaQuery from './useMediaQuery';

/**
 * tablet: 768
 * Minimum width of the middle section in the navigation bar: 236px+450px
 * @see https://mui.com/customization/breakpoints/#default-breakpoints
 */
export function useDevices() {
  const isMobile = useMediaQuery((theme) =>
    theme.breakpoints.down('tablet'),
  );
  return {
    isMobile,
  };
}
