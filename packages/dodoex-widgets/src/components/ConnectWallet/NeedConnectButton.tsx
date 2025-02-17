import { ChainId } from '@dodoex/api';
import { Button, ButtonProps } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import { useWalletInfo } from '../../hooks/ConnectWallet/useWalletInfo';
import { useUserOptions } from '../UserOptionsProvider';

export default function NeedConnectButton({
  chainId,
  includeButton,
  ...props
}: ButtonProps & {
  /** chainId that needs to be connected */
  chainId?: ChainId;
  includeButton?: boolean;
}) {
  const { account, chainId: currentChainId } = useWalletInfo();
  const { onConnectWalletClick } = useUserOptions();
  const [loading, setLoading] = React.useState(false);
  const { setVisible } = useWalletModal();

  if (
    account &&
    !loading &&
    currentChainId !== undefined &&
    (!chainId || chainId === currentChainId)
  ) {
    if (includeButton) return <>{props.children ?? null}</>;
    return <Button {...props} />;
  }

  return (
    <>
      <Button
        {...props}
        isLoading={loading}
        onClick={async () => {
          if (onConnectWalletClick) {
            setLoading(true);
            const isConnected = await onConnectWalletClick();
            setLoading(false);
            if (isConnected) {
              return;
            }
          }
          setVisible(true);
        }}
      >
        {loading ? (
          <Trans>Connecting...</Trans>
        ) : (
          <Trans>Connect to a wallet</Trans>
        )}
      </Button>
    </>
  );
}
