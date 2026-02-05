import { alpha } from '@mui/system';
import { BoxProps } from '../Box';
import { merge } from 'lodash';
import { useDevices } from '../hooks';
import { useTheme } from '../theme';
import Tooltip, { TooltipProps } from './Tooltip';
import React from 'react';

export interface TooltipToastProps {
  title: TooltipProps['title'];
  arrow?: TooltipProps['arrow'];
  placement?: TooltipProps['placement'];
  leaveDelay?: TooltipProps['leaveDelay'];
  children: React.ReactElement;
  tooltipSx?: BoxProps['sx'];
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  duration?: number;
}

export default function TooltipToast({
  title,
  children,
  /** This prop won't impact the enter click delay  */
  leaveDelay = 0,
  duration = 1500,
  arrow,
  placement,
  tooltipSx,
  open: openProps,
  onOpen,
  onClose,
  ...attrs
}: TooltipToastProps) {
  const theme = useTheme();
  const { isMobile } = useDevices();
  const PopperProps = React.useMemo(() => {
    if (!isMobile) return undefined;
    return {
      anchorEl: {
        getBoundingClientRect: () => {
          return new DOMRect(0, 0, 16, 0);
        },
      },
      popperOptions: {
        strategy: 'fixed',
      },
      sx: {
        left: '50% !important',
        transform: 'translateX(-50%) !important',
      },
    } as TooltipProps['PopperProps'];
  }, [isMobile]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = React.useCallback(() => {
    setOpen(true);
    if (onOpen) {
      onOpen();
    }
  }, [onOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  React.useEffect(() => {
    let time: NodeJS.Timeout;
    if (open) {
      time = setTimeout(() => {
        handleClose();
      }, duration);
    }
    return () => {
      clearTimeout(time);
    };
  }, [open]);

  return (
    <>
      <Tooltip
        title={title}
        arrow={arrow}
        placement={placement}
        PopperProps={PopperProps}
        enterDelay={350}
        leaveDelay={leaveDelay}
        open={openProps ?? open}
        onClose={handleClose}
        onOpen={handleOpen}
        onlyClick
        sx={merge(
          {
            maxWidth: 217,
            p: 12,
            width: 'max-content',
            typography: 'h6',
            backgroundColor: '#41454F',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: 8,
            color: alpha('#fff', 0.5),
            [theme.breakpoints.down('tablet')]: {
              borderRadius: 16,
              px: 28,
              py: 20,
              color: '#fff',
              typography: 'body1',
            },
            [theme.breakpoints.down('tablet')]: {
              maxWidth: 'calc(100vw - 40px)',
            },
          },
          tooltipSx,
        )}
        {...attrs}
      >
        {children}
      </Tooltip>
    </>
  );
}
