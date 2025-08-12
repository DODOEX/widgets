import React from 'react';
import Dialog from './Dialog';
import { Box, ButtonBase } from '@dodoex/components';
import { ArrowSubmit, Error } from '@dodoex/icons';
import { t } from '@lingui/macro';

export default function SubmittedDialog({
  brief,
  open,
  executionDialogExtra,
  onClose,
}: {
  brief?: string;
  open: boolean;
  executionDialogExtra: any;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} modal>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pt: 14,
          pr: 12,
          height: 40,
        }}
      >
        <ButtonBase
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
          onClick={onClose}
        >
          <Box
            component={Error}
            sx={{
              width: 28,
              height: 28,
            }}
          />
        </ButtonBase>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 20,
          pb: 40,
          width: 340,
          fontWeight: 600,
        }}
      >
        <Box
          component={ArrowSubmit}
          sx={{
            width: 64,
            height: 64,
            color: 'success.main',
          }}
        />
        <Box>{t`${brief} submitted`}</Box>
        {executionDialogExtra}
      </Box>
    </Dialog>
  );
}
