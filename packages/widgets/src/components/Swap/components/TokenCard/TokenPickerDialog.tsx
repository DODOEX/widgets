import { Trans } from '@lingui/macro';
import Dialog from '../Dialog';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../../../store/selectors/globals';
import TokenPicker, { TokenPickerProps } from '../../../TokenPicker';
import { tokenPickerWrapper } from '../../../../constants/testId';
import { DialogProps } from '../Dialog';

export function TokenPickerDialog({
  open,
  value,
  onClose,
  occupiedAddrs,
  onTokenChange,
}: {
  open: boolean;
  occupiedAddrs?: string[];
  onClose: DialogProps['onClose'];
  value?: TokenPickerProps['value'];
  onTokenChange: TokenPickerProps['onChange'];
}) {
  const { height } = useSelector(getGlobalProps);
  return (
    <Dialog
      height={height}
      open={open}
      onClose={onClose}
      title={<Trans>Select a token</Trans>}
      testId={tokenPickerWrapper}
    >
      <TokenPicker
        value={value}
        visible={open}
        onChange={onTokenChange}
        occupiedAddrs={occupiedAddrs}
      />
    </Dialog>
  );
}
