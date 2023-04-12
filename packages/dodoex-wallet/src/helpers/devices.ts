export const isSupportWebHid = () => {
  return !!(window.navigator as any)?.hid;
};

export const isAndroid =
  window.navigator?.userAgent && /(Android)/i.test(navigator.userAgent);

export const isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);

export const isMobile = isAndroid || isIOS;
