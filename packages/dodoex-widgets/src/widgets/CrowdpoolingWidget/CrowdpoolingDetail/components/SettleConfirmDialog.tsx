import { Trans } from '@lingui/macro';
import { Box, Button, useTheme } from '@dodoex/components';
import Dialog from '../../../../components/Dialog';
import { basicTokenMap, ChainId } from '@dodoex/api';

export default function SettleConfirmDialog({
  chainId,
  open,
  loading,
  onClose,
  onConfirm,
}: {
  chainId: ChainId | undefined;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const theme = useTheme();
  const basicToken = chainId ? basicTokenMap[chainId] : null;

  return (
    <Dialog
      modal
      open={open}
      onClose={onClose}
      title={<Trans>Crowdpooling Settlement</Trans>}
    >
      <Box
        sx={{
          p: theme.spacing(16, 20, 20),
          width: {
            mobile: '100%',
            tablet: 420,
          },
        }}
      >
        <Box
          sx={{
            borderWidth: 1,
            borderRadius: 10,
            p: 20,
            typography: 'h6',
            backgroundColor: theme.palette.background.input,
          }}
        >
          <Trans>
            If you spend gas help settle a Crowdpooling campaign, you could
            receive 0.2{basicToken?.symbol} in rewards. Liquidity pools and spot
            trading will be created/enabled after settlement.
          </Trans>
        </Box>
        <Box
          sx={{
            mt: 20,
            typography: 'body2',
          }}
        >
          <Trans>
            If someone else's settlement transaction is processed before yours,
            you will NOT receive the 0.2ETH, but your gas cost for that
            transaction will be a lot lower.
          </Trans>
        </Box>
        <Box
          sx={{
            mt: 36,
          }}
        >
          <Button fullWidth isLoading={loading} onClick={onConfirm}>
            <Trans>Settle</Trans>
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
