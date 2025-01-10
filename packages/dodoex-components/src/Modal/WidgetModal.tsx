import { Modal as ModalUnstyled } from '@mui/base/Modal';
import { styled } from '@mui/system';
import type { ModalProps } from '@mui/base/Modal';
import { forwardRef } from 'react';
import clsx from 'clsx';

const Backdrop = forwardRef<
  HTMLDivElement,
  { open?: boolean; className: string }
>((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ 'MuiBackdrop-open': open }, className)}
      ref={ref}
      {...other}
    />
  );
});

const StyledModal = styled(ModalUnstyled)`
  position: absolute;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.palette.background.backdrop};
  -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(5px);
`;

export const WIDGET_MODAL_CLASS = 'dodo-widget-modal';

export default function WidgetModal({ slots, ...props }: ModalProps) {
  return (
    <StyledModal
      className={WIDGET_MODAL_CLASS}
      slots={{ backdrop: StyledBackdrop, ...slots }}
      {...props}
    />
  );
}
