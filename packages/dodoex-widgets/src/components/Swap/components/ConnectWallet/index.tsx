import { ChainId } from '@dodoex/api';
import { Button, ButtonProps } from '@dodoex/components';
import { CaipNetworksUtil } from '@reown/appkit-utils';
import { useAppKit } from '@reown/appkit/react';
import React from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useUserOptions } from '../../../UserOptionsProvider';
import { useSwitchChain } from '../../../../hooks/ConnectWallet/useSwitchChain';

export default function NeedConnectButton({
  chainId,
  includeButton,
  ...props
}: ButtonProps & {
  /** chainId that needs to be connected */
  chainId?: ChainId;
  includeButton?: boolean;
}) {
  const { open } = useAppKit();
  const { account, chainId: currentChainId } = useWalletInfo();

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

          if (!chainId) {
            return;
          }
          const caipNetwork = chainListMap.get(chainId)?.caipNetwork;
          if (!caipNetwork) {
            return;
          }
          const namespace = CaipNetworksUtil.getChainNamespace(caipNetwork);
          open({
            namespace,
          });
        }}
      >
        {loading
          ? 'Connecting...'
          : needSwitchNetwork && chainId
            ? `Switch to ${chainListMap.get(chainId)?.name ?? 'unknown'}`
            : 'Connect to a wallet'}
      </Button>
    </>
  );
}
