import { Box, Button, Checkbox, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import WidgetDialog from './WidgetDialog';

export default function RiskDialog({
  open,
  onClose,
  alertContent,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  alertContent?: React.ReactNode;
  onConfirm?: () => void;
}) {
  const theme = useTheme();
  const [userReadAndChecked, setUserReadAndChecked] = React.useState(false);
  const title = t`Risk Disclaimer`;
  return (
    <WidgetDialog
      open={open}
      onClose={onClose}
      title={title}
      canBack={false}
      titleCenter
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            mb: 20,
            mx: 20,
            maxHeight: 275,
            overflowY: 'auto',
            borderWidth: 1,
            borderRadius: 10,
            borderStyle: 'solid',
            borderColor: 'border.main',
            p: theme.spacing(20),
            typography: 'body2',
            backgroundColor: theme.palette.background.input,
            color: theme.palette.text.primary,
            textAlign: 'left',
          }}
        >
          {alertContent}
        </Box>
        <Box
          sx={{
            padding: 20,
            pt: 12,
            backgroundColor: theme.palette.background.paperContrast,
          }}
        >
          <Box
            component="label"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              typography: 'body2',
              cursor: 'pointer',
              color: 'text.secondary',
              textAlign: 'left',
              '& a': {
                fontWeight: 600,
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            <Checkbox
              sx={{
                top: -1,
              }}
              checked={userReadAndChecked}
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                const { checked } = evt.target;
                setUserReadAndChecked(checked);
              }}
            />
            <Box>
              <Trans>
                I have read, understand, and agree to the{' '}
                <a
                  href="https://docs.dodoex.io/home/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
                .
              </Trans>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 12,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              sx={{}}
              disabled={!userReadAndChecked}
              fullWidth
              onClick={() => {
                setUserReadAndChecked(false);
                onConfirm?.();
              }}
            >
              <Trans>Confirm</Trans>
            </Button>
          </Box>
        </Box>
      </Box>
    </WidgetDialog>
  );
}
