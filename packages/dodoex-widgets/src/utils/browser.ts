/**
 * Wait for a certain css selector to be loaded. Make sure that the selector can be loaded before calling it. Otherwise, retryCount should be passed in.
 * @param selector css selector
 */
export const waitElement = (
  selector: string,
  {
    time = 100,
    wrapper = document,
    retryCount = 50,
  }: {
    time?: number;
    wrapper?: Document | Element;
    retryCount?: number;
  } = {},
) => {
  return new Promise((resolve) => {
    if (wrapper.querySelector(selector)) {
      resolve(true);
    } else {
      setTimeout(async () => {
        if (wrapper.querySelector(selector)) {
          resolve(true);
        } else if (!retryCount) {
          resolve(false);
        } else {
          const result = await waitElement(selector, {
            time,
            wrapper,
            retryCount: retryCount - 1,
          });
          resolve(result);
        }
      }, time);
    }
  });
};
