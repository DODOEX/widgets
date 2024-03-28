import { Trans } from '@lingui/macro';
import Dialog from '../Dialog';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../../../store/selectors/globals';
import TokenPicker, { TokenPickerProps } from '../../../TokenPicker';
import { tokenPickerWrapper } from '../../../../constants/testId';
import { DialogProps } from '../Dialog';

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
  const { height } = useSelector(getGlobalProps);
  return (
    <Dialog
      height={height}
      open={open}
      onClose={onClose}
      title={title ?? <Trans>Select a token</Trans>}
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
