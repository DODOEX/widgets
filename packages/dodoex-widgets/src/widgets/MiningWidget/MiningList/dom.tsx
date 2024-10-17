import { Box } from '@dodoex/components';
import { createPortal } from 'react-dom';
import Dialog from '../../../components/Swap/components/Dialog';

export const SlideDurationTime = 300;

export function createPortalOrDialog(
  children: React.ReactNode,
  container: Element | DocumentFragment | null,
  isMobile: boolean,
  visible: boolean,
  openOther: boolean,
) {
  if (isMobile) {
    return (
      <Dialog open={visible} height="70vh">
        {children}
      </Dialog>
    );
  }

  if (!container || !visible) {
    return null;
  }
  return createPortal(<Box>{visible ? children : null}</Box>, container);
}
