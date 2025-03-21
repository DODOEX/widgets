import React from 'react';
import SwitchChainDialog from '../SwitchChainDialog';
import ConnectWalletDialog from './ConnectWalletDialog';
import { useGlobalState } from '../../hooks/useGlobalState';

export default function OpenConnectWalletInfo() {
  const { openConnectWalletInfo: openConnectInfo } = useGlobalState();
  const switchChainId =
    typeof openConnectInfo === 'object' ? openConnectInfo?.chainId : undefined;
  const openSwitchChainDialog = !!switchChainId;
  const open = openConnectInfo === true;
  const handleClose = () => {
    useGlobalState.setState({
      openConnectWalletInfo: false,
    });
  };

  return (
    <>
      <ConnectWalletDialog open={open} onClose={handleClose} />
      {/* switch chain */}
      <SwitchChainDialog
        chainId={switchChainId}
        open={openSwitchChainDialog}
        onClose={handleClose}
      />
    </>
  );
}
