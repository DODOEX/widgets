import { Box, Button } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';
import WidgetDialog from './WidgetDialog';

export default function WidgetConfirm({
  open,
  onClose,
  title,
  children,
  singleBtn,
  danger,
  singleBtnText,
  cancelText,
  confirmText,
  disabledConfirm,
  confirmLoading,
  isManualClose,
  onConfirm,
}: React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  singleBtn?: boolean;
  danger?: boolean;
  singleBtnText?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
  disabledConfirm?: boolean;
  confirmLoading?: boolean;
  isManualClose?: boolean;
  onConfirm?: () => void;
}>) {
  const Dialog = WidgetDialog;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          {title}
        </Box>
      }
      canBack={false}
      titleCenter
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          width: '100%',
        }}
      >
        <Box
          sx={{
            typography: 'body2',
            color: title ? 'text.secondary' : 'text.primary',
            textAlign: 'center',
            wordBreak: 'break-all',
            mt: 20,
            px: 36,
          }}
        >
          {children}
        </Box>
        {singleBtn ? (
          <Box
            sx={{
              px: 20,
            }}
          >
            <Button
              fullWidth
              variant={Button.Variant.outlined}
              danger={danger}
              sx={{
                mt: 32,
                mb: 20,
              }}
              onClick={() => {
                onClose();
              }}
            >
              {singleBtnText || <Trans>Done</Trans>}
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              mt: 24,
              mb: 20,
              mx: 20,
              display: 'flex',
              alignItems: 'center',
              '& > button': {
                flex: 1,
              },
            }}
          >
            <Button
              variant={Button.Variant.second}
              onClick={() => {
                onClose();
              }}
            >
              {cancelText || <Trans>Cancel</Trans>}
            </Button>
            <Button
              sx={{
                ml: 8,
              }}
              variant={Button.Variant.outlined}
              danger={danger}
              disabled={disabledConfirm}
              isLoading={confirmLoading}
              onClick={() => {
                if (onConfirm) {
                  onConfirm();
                }
                if (isManualClose) return;
                onClose();
              }}
            >
              {confirmText || <Trans>Confirm</Trans>}
            </Button>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
