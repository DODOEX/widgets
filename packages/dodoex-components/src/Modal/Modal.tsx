import { Modal as ModalUnstyled } from '@mui/base/Modal';
import { Box, BoxProps, styled } from '@mui/system';
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
  background-color: ${({ theme }) => {
    return theme.palette.background.backdrop;
  }};
  -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(5px);
`;

export const WIDGET_MODAL_FIXED_CLASS = 'dodo-widget-modal-fixed';

export default function Modal({
  slots,
  containerSx,
  children,
  ...props
}: ModalProps & {
  containerSx?: BoxProps['sx'];
}) {
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
          maxHeight: '85vh',
          backgroundColor: 'background.paper',
          overflowY: 'auto',
          borderRadius: isMobile ? theme.spacing(20, 20, 0, 0) : 20,
          boxShadow: '0px 2px 12px 0px rgba(0, 0, 0, 0.15)',
          ...containerSx,
        }}
      >
        {children}
      </Box>
    </StyledModal>
  );
}
