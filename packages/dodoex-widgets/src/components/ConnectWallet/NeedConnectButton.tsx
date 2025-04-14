import { Button, ButtonProps } from '@dodoex/components';
import { Trans, t } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { ChainId } from '@dodoex/api';
import { chainListMap } from '../../constants/chainList';
import { useSwitchChain } from '../../hooks/ConnectWallet/useSwitchChain';
import { useUserOptions } from '../UserOptionsProvider';
import { useGlobalState } from '../../hooks/useGlobalState';

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
  const { onConnectWalletClick, onSwitchChain } = useUserOptions();
  const [loading, setLoading] = React.useState(false);
  const switchChain = useSwitchChain(chainId);
  const needSwitchNetwork =
    currentChainId !== undefined &&
    chainId !== undefined &&
    currentChainId !== chainId;
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
          // switch chain
          if (needSwitchNetwork) {
            if (onSwitchChain) {
              setLoading(true);
              await onSwitchChain();
              setLoading(false);
              return;
            }
            if (switchChain) {
              setLoading(true);
              await switchChain();
              setLoading(false);
              return;
            }
            useGlobalState.setState({
              openConnectWalletInfo: {
                chainId,
              },
            });
            return;
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
          useGlobalState.setState({
            openConnectWalletInfo: true,
          });
        }}
      >
        {loading ? (
          <Trans>Connecting...</Trans>
        ) : needSwitchNetwork && chainId ? (
          t`Switch to ${chainListMap.get(chainId)?.name ?? 'unknown'}`
        ) : (
          <Trans>Connect to a wallet</Trans>
        )}
      </Button>
    </>
  );
}
