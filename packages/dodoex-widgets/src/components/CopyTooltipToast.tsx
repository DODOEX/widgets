import { TooltipToast, Box, BoxProps, BaseButton } from '@dodoex/components';
import copy from 'copy-to-clipboard';
import { Copy } from '@dodoex/icons';
import { t } from '@lingui/macro';
import React from 'react';

export function CopyTooltipToast({
  copyText,
  size,
  sx,
  componentProps,
  onClick,
}: {
  copyText?: string;
  size: number;
  sx?: BoxProps['sx'];
  componentProps?: BoxProps;
  onClick?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipToast title={t`Copied`} open={open} onClose={() => setOpen(false)}>
      <Box
        component={BaseButton}
        onClick={(evt: any) => {
          evt.stopPropagation();
          if (copyText) {
            copy(copyText);
            setOpen(true);
          }
          if (onClick) {
            onClick();
          }
        }}
        {...componentProps}
      >
        <Box
          component={Copy}
          sx={{
            width: size || 'auto',
            height: size || 'auto',
            ...sx,
          }}
        />
      </Box>
    </TooltipToast>
  );
}
