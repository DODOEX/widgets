import { Button } from '@dodoex/components';
import { ChainId } from '../../../../constants/chains';
import { connectWalletBtn } from '../../../../constants/testId';
import NeedConnectButton from '../../../ConnectWallet/NeedConnectButton';

export interface ConnectWalletProps {
  needSwitchChain?: ChainId;
}

export default function ConnectWallet({ needSwitchChain }: ConnectWalletProps) {
  return (
    <>
      <NeedConnectButton
        size={Button.Size.middle}
        fullWidth
        data-testid={connectWalletBtn}
        chainId={needSwitchChain}
      />
    </>
  );
}
