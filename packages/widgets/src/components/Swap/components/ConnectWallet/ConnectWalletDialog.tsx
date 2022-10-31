import { Box } from '@dodoex-io/components';
import { Trans } from '@lingui/macro';
import { useSelector } from 'react-redux';
import { WalletMap } from '../../../../constants/wallet';
import { connectToWallet } from '../../../../hooks/ConnectWallet';
import { getDefaultChainId } from '../../../../store/selectors/wallet';
import Dialog from '../Dialog';

export default function ConnectWalletDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const chainId = useSelector(getDefaultChainId);
  return (
    <Dialog
      title={<Trans>Connect to your wallet</Trans>}
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          mx: 20,
          pb: 20,
          border: '1px solid transparent',
          borderTopColor: 'border.main',
        }}
      >
        {Object.values(WalletMap).map((wallet) => (
          <Box
            key={wallet.type}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              mt: 20,
              p: 20,
              backgroundColor: 'background.tag',
              borderRadius: 12,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'hover.default',
              },
            }}
            onClick={() => {
              connectToWallet(wallet.type, chainId, (error) => {
                console.error(error);
              });
            }}
          >
            <Box
              component={wallet.icon}
              sx={{
                width: 32,
                height: 32,
              }}
            />
            <Box
              sx={{
                mt: 8,
                typography: 'caption',
              }}
            >
              {wallet.name}
            </Box>
            <Box
              sx={{
                mt: 4,
                typography: 'body2',
                color: 'text.secondary',
              }}
            >
              <Trans>Connect to your {wallet.name} Wallet</Trans>
            </Box>
          </Box>
        ))}
      </Box>
    </Dialog>
  );
}
