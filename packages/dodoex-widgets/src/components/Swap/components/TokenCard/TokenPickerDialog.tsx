import { Trans } from '@lingui/macro';
import Dialog from '../Dialog';
import TokenPicker, { TokenPickerProps } from '../../../TokenPicker';
import { tokenPickerWrapper } from '../../../../constants/testId';
import { DialogProps } from '../Dialog';
import { useUserOptions } from '../../../UserOptionsProvider';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';

export function TokenPickerDialog({
  open,
  title,
  value,
  onClose,
  occupiedAddrs,
  occupiedChainId,
  onTokenChange,
  side,
  defaultLoadBalance,
  multiple,
  searchPlaceholder,
  searchOtherAddress,
  chainId,
  modal,
}: {
  open: boolean;
  title?: React.ReactNode | string;
  occupiedAddrs?: string[];
  occupiedChainId?: TokenPickerProps['occupiedChainId'];
  onClose: DialogProps['onClose'];
  value?: TokenPickerProps['value'];
  onTokenChange: TokenPickerProps['onChange'];
  side?: TokenPickerProps['side'];
  defaultLoadBalance?: boolean;
  multiple?: TokenPickerProps['multiple'];
  searchPlaceholder?: TokenPickerProps['searchPlaceholder'];
  searchOtherAddress?: TokenPickerProps['searchOtherAddress'];
  chainId?: TokenPickerProps['chainId'];
  modal?: boolean;
}) {
  const { height } = useUserOptions();
  const { isMobile } = useWidgetDevice();
  return (
    <Dialog
      height={modal ? '80vh' : height}
      open={open}
      onClose={onClose}
      title={title ?? <Trans>Select a token</Trans>}
      id="select-token"
      testId={tokenPickerWrapper}
      modal={modal}
    >
      <TokenPicker
        value={value}
        visible={open}
        onChange={onTokenChange}
        occupiedAddrs={occupiedAddrs}
        occupiedChainId={occupiedChainId}
        side={side}
        defaultLoadBalance={defaultLoadBalance}
        multiple={multiple}
        searchPlaceholder={searchPlaceholder}
        searchOtherAddress={searchOtherAddress}
        chainId={chainId}
        sx={
          modal
            ? {
                width: isMobile ? '100%' : 420,
                borderRadius: 16,
              }
            : undefined
        }
      />
    </Dialog>
  );
}
