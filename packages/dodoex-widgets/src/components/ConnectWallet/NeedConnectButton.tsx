import { ChainId } from '@dodoex/api';
import { Button, ButtonProps } from '@dodoex/components';
import { Trans, t } from '@lingui/macro';
import React from 'react';
import { chainListMap } from '../../constants/chainList';
import { useSwitchChain } from '../../hooks/ConnectWallet/useSwitchChain';
import { useWalletInfo } from '../../hooks/ConnectWallet/useWalletInfo';

export default function NeedConnectButton({
  chainId,
  includeButton,
  ...props
}: ButtonProps & {
  /** chainId that needs to be connected */
  chainId?: ChainId;
  includeButton?: boolean;
}) {
  const {
    chainId: currentChainId,
    getAppKitAccountByChainId,
    open,
  } = useWalletInfo();
  const [loading, setLoading] = React.useState(false);
  const switchChain = useSwitchChain(chainId);

  const needSwitchNetwork =
    currentChainId !== undefined &&
    chainId !== undefined &&
    currentChainId !== chainId;

  const accountByChainId = getAppKitAccountByChainId(chainId);

  if (
    accountByChainId?.appKitAccount.address &&
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
            if (switchChain) {
              setLoading(true);
              await switchChain();
              setLoading(false);
              return;
            }

            return;
          }

          setLoading(true);
          open({
            namespace: accountByChainId?.namespace,
          });
          setLoading(false);
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
