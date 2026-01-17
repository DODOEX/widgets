import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';

interface VoteConfirmProps {
  open: boolean;
  onClose: () => void;
  cp: any;
}

export default function VoteConfirm({ open, onClose, cp }: VoteConfirmProps) {
  if (!cp) return null;

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: open ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          p: 40,
          borderRadius: 16,
          backgroundColor: 'background.paper',
          maxWidth: 400,
          width: '90%',
        }}
      >
        <Box sx={{ typography: 'h5', mb: 24, textAlign: 'center' }}>
          <Trans>Confirm Vote</Trans>
        </Box>
        <Box sx={{ typography: 'body1', mb: 16, textAlign: 'center' }}>
          <Trans>
            Vote for {cp.baseSymbol} / {cp.quoteSymbol}?
          </Trans>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
          }}
        >
          <Box
            component="button"
            onClick={onClose}
            sx={{
              flex: 1,
              py: 8,
              borderRadius: 8,
              cursor: 'pointer',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'text.secondary',
              typography: 'body1',
            }}
          >
            <Trans>Cancel</Trans>
          </Box>
          <Box
            component="button"
            onClick={onClose}
            sx={{
              flex: 1,
              py: 8,
              borderRadius: 8,
              cursor: 'pointer',
              backgroundColor: 'primary.main',
              border: 'none',
              color: 'background.paper',
              typography: 'body1',
              fontWeight: 600,
            }}
          >
            <Trans>Confirm</Trans>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
