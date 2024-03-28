import { Button, ButtonProps } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ChainId } from '../../constants/chains';
import { useGlobalConfig } from '../../providers/GlobalConfigContext';
import { AppThunkDispatch } from '../../store/actions';
import { setOpenConnectWalletInfo } from '../../store/actions/wallet';

export default function NeedConnectButton({
  chainId,
  includeButton,
  ...props
}: ButtonProps & {
  /** chainId that needs to be connected */
  chainId?: ChainId;
  includeButton?: boolean;
}) {
  const { account, chainId: currentChainId, connector } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const { onConnectWalletClick } = useGlobalConfig();
  const [loading, setLoading] = React.useState(false);
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
            // switch chain
            if (currentChainId && chainId && chainId !== currentChainId) {
              dispatch(
                setOpenConnectWalletInfo({
                  chainId,
                }),
              );
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
          dispatch(setOpenConnectWalletInfo(true));
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
