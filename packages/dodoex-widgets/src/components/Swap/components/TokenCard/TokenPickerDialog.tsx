import { Trans } from '@lingui/macro';
import Dialog from '../Dialog';
import TokenPicker, { TokenPickerProps } from '../../../TokenPicker';
import { tokenPickerWrapper } from '../../../../constants/testId';
import { DialogProps } from '../Dialog';
import { useUserOptions } from '../../../UserOptionsProvider';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { TokenInfo } from '../../../../hooks/Token';

export interface TokenPickerDialogProps {
  open: boolean;
  title?: React.ReactNode | string;
  occupiedAddrs?: string[];
  hiddenAddrs?: string[];
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
  tokenList?: Array<TokenInfo>;
}
export function TokenPickerDialog(props: TokenPickerDialogProps) {
  const { height, TokenPickerDialog } = useUserOptions();
  const { isMobile } = useWidgetDevice();
  if (TokenPickerDialog) return <TokenPickerDialog {...props} />;
  const {
    open,
    title,
    value,
    onClose,
    occupiedAddrs,
    hiddenAddrs,
    occupiedChainId,
    onTokenChange,
    side,
    defaultLoadBalance,
    multiple,
    searchPlaceholder,
    searchOtherAddress,
    chainId,
    modal,
    tokenList,
  } = props;

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
        hiddenAddrs={hiddenAddrs}
        side={side}
        defaultLoadBalance={defaultLoadBalance}
        multiple={multiple}
        searchPlaceholder={searchPlaceholder}
        searchOtherAddress={searchOtherAddress}
        chainId={chainId}
        tokenList={tokenList}
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
