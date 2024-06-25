import { Box } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { createPortal } from 'react-dom';
import { useGlobalConfig } from '../../../providers/GlobalConfigContext';

export const transitionTime = 300;
export interface DialogProps {
  open: boolean;
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
        transition: `top ${transitionTime}ms`,
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
      {children}
    </Box>
  );
}

export default function Dialog({ scope, ...props }: DialogProps) {
  const { widgetRef } = useGlobalConfig();
  if (widgetRef?.current && !scope) {
    return createPortal(<DialogBase {...props} />, widgetRef.current);
  }
  return <DialogBase {...props} />;
}
