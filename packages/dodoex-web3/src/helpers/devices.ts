export const isSupportWebHid = () => {
  return !!(window.navigator as any)?.hid;
};

export const getIsAndroid = () => {
  return (
    (window.navigator as any)?.userAgent &&
    /(Android)/i.test(navigator.userAgent)
  );
};

export const getIsIOS = () => {
  return /(iPhone|iPad|iPod|iOS)/i.test((window.navigator as any)?.userAgent);
};

export const getIsMobile = () => {
  return getIsAndroid() || getIsIOS();
};

export const getWindow = () => {
  if (typeof window === 'undefined') return undefined;
  return window;
};
