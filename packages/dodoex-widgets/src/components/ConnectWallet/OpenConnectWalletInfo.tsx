import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import { setOpenConnectWalletInfo } from '../../store/actions/wallet';
import { getOpenConnectWalletInfo } from '../../store/selectors/wallet';
import SwitchChainDialog from '../SwitchChainDialog';
import ConnectWalletDialog from './ConnectWalletDialog';

export default function OpenConnectWalletInfo() {
  const openConnectInfo = useSelector(getOpenConnectWalletInfo);
  const dispatch = useDispatch<AppThunkDispatch>();
  const switchChainId =
    typeof openConnectInfo === 'object' ? openConnectInfo?.chainId : undefined;
  const openSwitchChainDialog = !!switchChainId;
  const open = openConnectInfo === true;
  const handleClose = () => {
    dispatch(setOpenConnectWalletInfo(false));
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
