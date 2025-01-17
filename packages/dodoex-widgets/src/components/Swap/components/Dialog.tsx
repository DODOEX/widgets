import { Box, BoxProps, Modal } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { createPortal } from 'react-dom';
import { useUserOptions } from '../../UserOptionsProvider';

export const transitionTime = 300;
export interface DialogProps {
  open: boolean;
  id?:
    | 'connect-wallet'
    | 'submission'
    | 'error-message'
    | 'select-chain'
    | 'select-token'
    | 'swap-summary'
    | 'swap-settings'
    | 'cross-chain-summary'
    | 'select-cross-chain'
    | 'pool-operate';
  onClose?: () => void;
  afterClose?: () => void;
  // Do not render on widget root node
  scope?: boolean;
  title?: string | React.ReactNode;
  rightSlot?: React.ReactNode;
  canBack?: boolean;
  children: React.ReactNode;
  height?: number | string;
  testId?: string;
}

function DialogBase({
  open,
  onClose,
  afterClose,
  title,
  rightSlot,
  canBack = true,
  children,
  height,
  testId,
}: DialogProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: open ? 0 : '100%',
        transition: `all ${transitionTime}ms`,
        zIndex: 20,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        borderRadius: 16,
        height,
      }}
      data-testid={testId}
      data-active={open ? '1' : '0'}
    >
      {title ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 20,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              typography: 'caption',
            }}
          >
            {title}
          </Box>
          {rightSlot}
          {!rightSlot && canBack && (
            <Box
              component={Error}
              sx={{ color: 'text.secondary', cursor: 'pointer' }}
              onClick={() => {
                onClose && onClose();
                setTimeout(() => afterClose && afterClose(), transitionTime);
              }}
            />
          )}
        </Box>
      ) : (
        ''
      )}
      {/* When not turned on, the element is not rendered. This prevents the tab from focusing on the hidden dialog. It also prevents the svg from pointing to a hidden element with the same id. */}
      {open ? children : ''}
    </Box>
  );
}

function ModalDialog({
  open,
  onClose,
  afterClose,
  title,
  rightSlot,
  canBack = true,
  children,
  height,
  testId,
  modalContainerSx,
}: DialogProps & {
  modalContainerSx?: BoxProps['sx'];
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      data-testid={testId}
      data-active={open ? '1' : '0'}
      containerSx={modalContainerSx}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height,
        }}
      >
        {title ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 20,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                typography: 'caption',
              }}
            >
              {title}
            </Box>
            {rightSlot}
            {!rightSlot && canBack && (
              <Box
                component={Error}
                sx={{ color: 'text.secondary', cursor: 'pointer' }}
                onClick={() => {
                  onClose && onClose();
                  setTimeout(() => afterClose && afterClose(), transitionTime);
                }}
              />
            )}
          </Box>
        ) : (
          ''
        )}
        {/* When not turned on, the element is not rendered. This prevents the tab from focusing on the hidden dialog. It also prevents the svg from pointing to a hidden element with the same id. */}
        {open ? children : ''}
      </Box>
    </Modal>
  );
}

export default function Dialog({
  scope,
  modal,
  ...props
}: DialogProps & {
  modal?: boolean;
  modalContainerSx?: BoxProps['sx'];
}) {
  const { widgetRef, DialogComponent } = useUserOptions();

  if (DialogComponent) {
    return <DialogComponent scope={scope} {...props} />;
  }

  const DialogComponentResult = modal ? ModalDialog : DialogBase;

  if (widgetRef?.current && !scope) {
    return createPortal(
      <DialogComponentResult {...props} />,
      widgetRef.current,
    );
  }
  return <DialogComponentResult {...props} />;
}
