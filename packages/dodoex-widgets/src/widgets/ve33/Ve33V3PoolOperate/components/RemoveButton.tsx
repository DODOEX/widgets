import { ChainId } from '@dodoex/api';
import { Button } from '@dodoex/components';
import { t } from '@lingui/macro';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';

export interface ButtonsProps {
  chainId: ChainId;
  disabled: boolean;
  removed: boolean | undefined;
  isLoading: boolean;
  error?: React.ReactNode;
  onConfirm: () => void;
  border?: boolean;
}

export const RemoveButton = ({
  chainId,
  disabled,
  removed,
  isLoading,
  error,
  onConfirm,
  border,
}: ButtonsProps) => {
  return (
    <NeedConnectButton
      includeButton
      fullWidth
      chainId={chainId}
      sx={
        border
          ? {
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: 'text.primary',
            }
          : undefined
      }
    >
      <Button
        fullWidth
        size={Button.Size.big}
        onClick={onConfirm}
        disabled={disabled}
        isLoading={isLoading}
        sx={
          border && !disabled
            ? {
                borderWidth: 3,
                borderStyle: 'solid',
                borderColor: 'text.primary',
              }
            : undefined
        }
      >
        {removed ? t`Closed` : (error ?? t`Remove`)}
      </Button>
    </NeedConnectButton>
  );
};
