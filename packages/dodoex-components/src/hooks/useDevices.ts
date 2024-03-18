export const isBrowser = typeof document !== 'undefined';

export const isAndroid =
  isBrowser &&
  window.navigator?.userAgent &&
  /(Android)/i.test(navigator.userAgent);

export const isIOS = isBrowser
  ? /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
  : false;

export function useDevices() {
  const isMobile = isIOS || isAndroid;
  return {
    isMobile,
  };
}
