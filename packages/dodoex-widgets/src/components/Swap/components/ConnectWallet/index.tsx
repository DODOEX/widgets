import { Button } from '@dodoex/components';
import ConnectWalletDialog from './ConnectWalletDialog';
import { ChainId } from '../../../../constants/chains';
import { useWeb3React } from '@web3-react/core';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { connectWalletBtn } from '../../../../constants/testId';
import SwitchChainDialog from '../../../SwitchChainDialog';

export interface ConnectWalletProps {
  needSwitchChain?: ChainId;
  /** If true is returned, the default wallet connection logic will not be executed */
  onConnectWalletClick?: () => boolean | Promise<boolean>;
}

export default function ConnectWallet({
  needSwitchChain,
  onConnectWalletClick,
}: ConnectWalletProps) {
  const { connector, chainId } = useWeb3React();
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
            if (chainId && needSwitchChain && chainId !== needSwitchChain) {
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
          connector.deactivate
            ? connector.deactivate()
            : connector.resetState();
          setOpen(true);
        }}
        data-testid={connectWalletBtn}
        isLoading={loading}
      >
        {loading ? (
          <Trans>Connecting...</Trans>
        ) : (
          <Trans>Connect to a wallet</Trans>
        )}
      </Button>
      <ConnectWalletDialog open={open} onClose={() => setOpen(false)} />
      {/* switch chain */}
      <SwitchChainDialog
        chainId={needSwitchChain}
        open={openSwitchChainDialog}
        onClose={() => setOpenSwitchChainDialog(false)}
      />
    </>
  );
}
