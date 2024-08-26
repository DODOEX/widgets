import { Button } from '@dodoex/components';
import ConnectWalletDialog from './ConnectWalletDialog';
import { ChainId } from '../../../../constants/chains';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { connectWalletBtn } from '../../../../constants/testId';
import SwitchChainDialog from '../../../SwitchChainDialog';
import { useWalletState } from '../../../../hooks/ConnectWallet/useWalletState';
import useTonConnectStore from '../../../../hooks/ConnectWallet/TonConnect';

export interface ConnectWalletProps {
  needSwitchChain?: ChainId;
  /** If true is returned, the default wallet connection logic will not be executed */
  onConnectWalletClick?: () => boolean | Promise<boolean>;
  needConnectTwoWallet?: boolean;
}

export default function ConnectWallet({
  needSwitchChain,
  onConnectWalletClick,
  needConnectTwoWallet,
}: ConnectWalletProps) {
  const { chainId } = useWalletState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSwitchChainDialog, setOpenSwitchChainDialog] = useState(false);
  return (
    <>
      <Button
        size={Button.Size.middle}
        fullWidth
        onClick={async () => {
          if (onConnectWalletClick) {
            // switch chain
            if (
              !needConnectTwoWallet &&
              chainId &&
              needSwitchChain &&
              chainId !== needSwitchChain
            ) {
              setOpenSwitchChainDialog(true);
              return;
            }

            setLoading(true);
            const isConnected = await onConnectWalletClick();
            setLoading(false);
            if (isConnected) {
              return;
            }
          }
          if (needSwitchChain !== ChainId.TON) {
            setOpen(true);
          } else {
            setLoading(true);
            await useTonConnectStore.getState().connect();
            setLoading(false);
          }
        }}
        data-testid={connectWalletBtn}
        isLoading={loading}
      >
        {loading ? (
          <Trans>Connecting...</Trans>
        ) : needConnectTwoWallet ? (
          <Trans>
            Connect to a {needSwitchChain === ChainId.TON ? 'Ton' : 'EVM'}{' '}
            wallet
          </Trans>
        ) : (
          <Trans>Connect to a wallet</Trans>
        )}
      </Button>
      <ConnectWalletDialog
        open={open}
        onClose={() => setOpen(false)}
        chainId={needSwitchChain}
      />
      {/* switch chain */}
      <SwitchChainDialog
        chainId={needSwitchChain}
        open={openSwitchChainDialog}
        onClose={() => setOpenSwitchChainDialog(false)}
      />
    </>
  );
}
