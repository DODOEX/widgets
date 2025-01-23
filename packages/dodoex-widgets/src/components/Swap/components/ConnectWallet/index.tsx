import { Button } from '@dodoex/components';
import { ChainId } from '@dodoex/api';
import { connectWalletBtn } from '../../../../constants/testId';
import NeedConnectButton from '../../../ConnectWallet/NeedConnectButton';

export interface ConnectWalletProps {
  needSwitchChain?: ChainId;
  border?: boolean;
}

export default function ConnectWallet({
  needSwitchChain,
  border,
}: ConnectWalletProps) {
  return (
    <>
      <NeedConnectButton
        size={Button.Size.middle}
        fullWidth
        data-testid={connectWalletBtn}
        chainId={needSwitchChain}
        sx={
          border
            ? {
                borderWidth: 3,
                borderStyle: 'solid',
                borderColor: 'text.primary',
              }
            : undefined
        }
      />
    </>
  );
}
