import { Button } from '@dodoex/components';
import ConnectWalletDialog from './ConnectWalletDialog';
import { ChainId } from '../../../../constants/chains';
import { useWeb3React } from '@web3-react/core';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { connectWalletBtn } from '../../../../constants/testId';
import { useSwitchChain } from '../../../../hooks/ConnectWallet/useSwitchChain';
import { chainListMap } from '../../../../constants/chainList';

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
  const switchChain = useSwitchChain(needSwitchChain);
  const showSwitchChain =
    !!chainId && !!needSwitchChain && chainId !== needSwitchChain;
  return (
    <>
      <Button
        size={Button.Size.middle}
        fullWidth
        onClick={async () => {
          // switch chain
          if (showSwitchChain) {
            setLoading(true);
            const res = await switchChain?.();
            setLoading(false);
            return res;
          }
          if (onConnectWalletClick) {
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
        ) : showSwitchChain ? (
          <Trans>
            Switch to {chainListMap.get(needSwitchChain)?.name ?? 'unknown'}
          </Trans>
        ) : (
          <Trans>Connect to a wallet</Trans>
        )}
      </Button>
      <ConnectWalletDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
