import { ChainId } from '@dodoex/api';
import { Button } from '@dodoex/components';
import { t } from '@lingui/macro';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';

export interface ButtonsProps {
  chainId: ChainId;
  isValid: boolean;
  errorMessage: React.ReactNode;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Buttons = ({
  chainId,
  isValid,
  errorMessage,
  setShowConfirm,
}: ButtonsProps) => {
  return (
    <NeedConnectButton includeButton fullWidth chainId={chainId}>
      <Button
        fullWidth
        size={Button.Size.big}
        onClick={() => {
          setShowConfirm(true);
        }}
        disabled={!isValid}
        danger={!isValid}
      >
        {errorMessage ? errorMessage : t`Preview`}
      </Button>
    </NeedConnectButton>
  );
};
