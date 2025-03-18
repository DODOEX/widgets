import { ChainId } from '@dodoex/api';
import { Button } from '@dodoex/components';
import { t } from '@lingui/macro';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';

export interface ButtonsProps {
  chainId: ChainId;
  disabled: boolean;
  removed: boolean | undefined;
  isLoading: boolean;
  onConfirm: () => void;
}

export const RemoveButton = ({
  chainId,
  disabled,
  removed,
  isLoading,
  onConfirm,
}: ButtonsProps) => {
  return (
    <NeedConnectButton includeButton fullWidth chainId={chainId}>
      <Button
        fullWidth
        size={Button.Size.big}
        onClick={onConfirm}
        disabled={disabled}
        isLoading={isLoading}
      >
        {removed ? t`Closed` : t`Remove`}
      </Button>
    </NeedConnectButton>
  );
};
