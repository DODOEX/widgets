import { ChainId } from '@dodoex/api';
import { Button } from '@dodoex/components';
import { t } from '@lingui/macro';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';

export interface ClaimButtonProps {
  chainId: ChainId;
  disabled: boolean;
  isLoading: boolean;
  border?: boolean;
  onConfirm: () => void;
}

export const ClaimButton = ({
  chainId,
  disabled,
  isLoading,
  border,
  onConfirm,
}: ClaimButtonProps) => {
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
        {t`Collect fees`}
      </Button>
    </NeedConnectButton>
  );
};
