import { Box, useTheme, WidgetModal } from '@dodoex/components';
import { WIDGET_CLASS_NAME } from './Widget';
import { Error } from '@dodoex/icons';
import { useWidgetDevice } from '../hooks/style/useWidgetDevice';

export interface WidgetDialogProps {
  open: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  title?: string | React.ReactNode;
  titleCenter?: boolean;
  rightSlot?: React.ReactNode;
  canBack?: boolean;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  testId?: string;
}
export default function WidgetDialog({
  open,
  onClose,
  afterClose,
  title,
  titleCenter,
  rightSlot,
  canBack = true,
  children,
  width = 420,
  height,
  testId,
}: WidgetDialogProps) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  return (
    <WidgetModal
      open={open}
      onClose={onClose}
      container={
        isMobile ? document.querySelector(`.${WIDGET_CLASS_NAME}`) : undefined
      }
      disableEnforceFocus
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          height,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          outline: 0,
          overflow: 'hidden',
          '& > div': {
            width: '100%',
          },
          ...(isMobile
            ? {
                width: '100%',
                borderRadius: theme.spacing(16, 16, 0, 0),
              }
            : {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width,
                maxWidth: '95%',
                minHeight: 200,
                maxHeight: '80%',
                borderRadius: 16,
              }),
        }}
        data-testid={testId}
      >
        {title ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: titleCenter ? 'center' : 'space-between',
              p: 20,
              width: '100%',
              boxSizing: 'border-box',
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
                  afterClose?.();
                }}
              />
            )}
          </Box>
        ) : (
          ''
        )}

        {children}
      </Box>
    </WidgetModal>
  );
}
