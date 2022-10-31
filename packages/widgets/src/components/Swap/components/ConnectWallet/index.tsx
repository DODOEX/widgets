import { Button } from '@dodoex-io/components';
import ConnectWalletDialog from './ConnectWalletDialog';
import { ChainId } from '../../../../constants/chains';
import { useWeb3React } from '@web3-react/core';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { connectWalletBtn } from '../../../../constants/testId';

export interface ConnectWalletProps {
  defaultChainId?: ChainId;
  hideConnectionUI?: boolean;
  onConnectWalletClick?: () => void | Promise<boolean>;
  onError: (error: Error) => void;
}

export default function ConnectWallet() {
  const { connector } = useWeb3React();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size={Button.Size.big}
        fullWidth
        onClick={() => {
          connector.deactivate
            ? connector.deactivate()
            : connector.resetState();
          setOpen(true);
        }}
        data-testid={connectWalletBtn}
      >
        <Trans>Connect to a wallet</Trans>
      </Button>
      <ConnectWalletDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
