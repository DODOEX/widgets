import { Box, Button } from '@dodoex/components';
import { ErrorWarn } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import Dialog from './Swap/components/Dialog';

export default function ErrorMessageDialog({
  message,
  onClose,
}: {
  message?: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!message} onClose={onClose}>
      <>
        <Box
          sx={{
            flex: 1,
            textAlign: 'center',
          }}
        >
          <Box
            component={ErrorWarn}
            sx={{
              mt: 60,
              width: 64,
              height: 64,
              color: 'error.main',
            }}
          />
          {message ? (
            <Box
              sx={{
                textAlign: 'center',
                mt: 60,
              }}
            >
              <Box>
                <Trans>Something went wrong.</Trans>
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  mt: 12,
                  typography: 'body2',
                  wordBreak: 'break-all',
                }}
              >
                {message}
              </Box>
            </Box>
          ) : (
            ''
          )}
        </Box>
        <Box
          sx={{
            px: 16,
            py: 20,
          }}
        >
          <Button onClick={onClose} fullWidth>
            <Trans>Dismiss</Trans>
          </Button>
        </Box>
      </>
    </Dialog>
  );
}
