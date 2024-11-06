import { useEffect } from 'react';

type Props = {
  id: string;
};

/**
 * 防止鼠标在图上滚动滚轮时页面上下滑动
 * @param param0
 */
export const usePreventWheel = ({ id }: Props) => {
  useEffect(() => {
    function handleWheelEvt(event: HTMLElementEventMap['wheel']) {
      event.preventDefault();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
    let passiveSupported = false;

    try {
      const options = {
        get passive() {
          // This function will be called when the browser
          //   attempts to access the passive property.
          passiveSupported = true;
          return false;
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      window.addEventListener('test', () => {}, options);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      window.removeEventListener('test', () => {});
    } catch (err) {
      passiveSupported = false;
    }
    const container = document.getElementById(id);
    // https://github.com/inuyaksa/jquery.nicescroll/issues/799
    const options = passiveSupported ? { passive: false } : false;
    container?.addEventListener('wheel', handleWheelEvt, options);
    return () => {
      container?.removeEventListener('wheel', handleWheelEvt);
    };
  }, [id]);
};
