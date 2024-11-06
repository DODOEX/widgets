import { Modal as ModalUnstyled } from '@mui/base/Modal';
import { Box, styled } from '@mui/system';
import type { ModalProps } from '@mui/base/Modal';
import { forwardRef } from 'react';
import clsx from 'clsx';
import { useMediaDevices } from '../hooks';
import { useTheme } from '../theme';

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
  position: fixed;
  z-index: 1300;
  inset: 0px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  overflow: hidden;
  ${({ theme }) => theme.breakpoints.up('tablet')} {
    justify-content: center;
    align-items: center;
  }
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0px;
  background-color: ${({ theme }) => theme.palette.background.backdrop};
  -webkit-tap-highlight-color: transparent;
`;

export const WIDGET_MODAL_FIXED_CLASS = 'dodo-widget-modal-fixed';

export default function Modal({ slots, children, ...props }: ModalProps) {
  const { isMobile } = useMediaDevices();
  const theme = useTheme();
  return (
    <StyledModal
      className={WIDGET_MODAL_FIXED_CLASS}
      slots={{ backdrop: StyledBackdrop, ...slots }}
      {...props}
    >
      <Box
        sx={{
          maxHeight: '80vh',
          backgroundColor: 'background.paper',
          overflowY: 'auto',
          borderRadius: isMobile ? theme.spacing(16, 16, 0, 0) : 16,
        }}
      >
        {children}
      </Box>
    </StyledModal>
  );
}
