import { Button } from '@dodoex/components';
import ConnectWalletDialog from './ConnectWalletDialog';
import { ChainId } from '../../../../constants/chains';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { connectWalletBtn } from '../../../../constants/testId';
import SwitchChainDialog from '../../../SwitchChainDialog';
import { useWalletState } from '../../../../hooks/ConnectWallet/useWalletState';
import useTonConnectStore from '../../../../hooks/ConnectWallet/TonConnect';
import { useWeb3React } from '@web3-react/core';

export interface ConnectWalletProps {
  needSwitchChain?: ChainId;
  needEvmChainId?: ChainId;
  /** If true is returned, the default wallet connection logic will not be executed */
  onConnectWalletClick?: () => boolean | Promise<boolean>;
}

export default function ConnectWallet({
  needSwitchChain,
  needEvmChainId,
  onConnectWalletClick,
}: ConnectWalletProps) {
  const { chainId } = useWalletState();
  const tonChainId = useTonConnectStore((state) => state.connected?.chainId);
  const { chainId: evmChainId } = useWeb3React();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSwitchChainDialog, setOpenSwitchChainDialog] = useState(false);

  let needConnectChainId = undefined as undefined | ChainId;
  if (needEvmChainId) {
    if (!tonChainId) {
      needConnectChainId = ChainId.TON;
    } else if (!evmChainId || needEvmChainId !== evmChainId) {
      needConnectChainId = needEvmChainId;
    }
  } else if (needSwitchChain !== chainId) {
    needConnectChainId = needSwitchChain;
  }
  return (
    <>
      <Button
        size={Button.Size.middle}
        fullWidth
        onClick={async () => {
          if (onConnectWalletClick && needConnectChainId !== ChainId.TON) {
            // switch chain
            if (
              !needEvmChainId &&
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
          if (needConnectChainId !== ChainId.TON) {
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
        ) : needConnectChainId ? (
          <Trans>
            Connect to a {needConnectChainId === ChainId.TON ? 'Ton' : 'EVM'}{' '}
            wallet
          </Trans>
        ) : (
          <Trans>Connect to a wallet</Trans>
        )}
      </Button>
      <ConnectWalletDialog
        open={open}
        onClose={() => setOpen(false)}
        chainId={needConnectChainId}
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
