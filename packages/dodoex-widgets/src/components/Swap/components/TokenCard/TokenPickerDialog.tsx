import { Trans } from '@lingui/macro';
import Dialog from '../Dialog';
import TokenPicker, { TokenPickerProps } from '../../../TokenPicker';
import { tokenPickerWrapper } from '../../../../constants/testId';
import { DialogProps } from '../Dialog';
import { useUserOptions } from '../../../UserOptionsProvider';

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
}) {
  const { height } = useUserOptions();
  return (
    <Dialog
      height={height}
      open={open}
      onClose={onClose}
      title={title ?? <Trans>Select a token</Trans>}
      id="select-token"
      testId={tokenPickerWrapper}
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
      />
    </Dialog>
  );
}
