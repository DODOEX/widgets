import { Box, BoxProps, useTheme } from '@dodoex/components';
import { TokenLogoCollapse } from './TokenLogoCollapse';
import { BalanceText } from './BalanceText';
import { NumberInput } from './NumberInput';
import { TokenPickerDialog } from './TokenPickerDialog';
import { useState, useMemo, useCallback } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import TokenPicker, { TokenPickerProps } from '../../../TokenPicker';
import useGetBalance from '../../../../hooks/Token/useGetBalance';
import { transitionTime } from '../Dialog';
import SwitchChainDialog from '../../../SwitchChainDialog';

export interface TokenCardProps {
  amt: string;
  fiatPriceTxt?: string | React.ReactNode;
  sx?: BoxProps['sx'];
  readOnly?: boolean;
  showMaxBtn?: boolean;
  occupiedAddrs?: string[];
  onMaxClick?: (max: string) => void;
  token?: TokenPickerProps['value'];
  onInputChange?: (v: string) => void;
  onInputFocus?: () => void;
  onTokenClick?: () => void;
  onTokenChange: TokenPickerProps['onChange'];
  side?: TokenPickerProps['side'];
  showChainLogo?: boolean;
  onlyCurrentChain?: boolean;
}
export function TokenCard({
  sx,
  amt,
  token,
  readOnly,
  showMaxBtn,
  onMaxClick,
  fiatPriceTxt,
  occupiedAddrs,
  onInputFocus,
  onTokenClick,
  onInputChange,
  onTokenChange,
  side,
  showChainLogo,
  onlyCurrentChain,
}: TokenCardProps) {
  const [openSwitchChainDialog, setOpenSwitchChainDialog] = useState(false);
  const theme = useTheme();
  const getBalance = useGetBalance();
  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);
  const balance = token ? getBalance(token) : null;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 133,
        padding: 20,
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.background.input,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TokenLogoCollapse
          token={token}
          showChainLogo={showChainLogo}
          onClick={() => setTokenPickerVisible(true)}
        />

        <BalanceText
          balance={balance}
          onClick={onMaxClick}
          showMaxBtn={showMaxBtn}
          address={token?.address}
          decimals={token?.decimals}
        />
      </Box>

      <NumberInput
        value={amt}
        onFocus={onInputFocus}
        onChange={onInputChange}
        readOnly={readOnly}
        withClear
      />

      {/* Current Price */}
      <Box
        sx={{
          mt: 4,
          typography: 'body2',
          color: theme.palette.text.secondary,
        }}
      >
        {fiatPriceTxt}
      </Box>

      {/* Token Picker */}
      <TokenPickerDialog
        value={token}
        open={tokenPickerVisible}
        side={side}
        occupiedAddrs={occupiedAddrs}
        onClose={() => {
          setTokenPickerVisible(false);
          onTokenClick && onTokenClick();
        }}
        onTokenChange={(token: TokenInfo, isOccupied: boolean) => {
          setTokenPickerVisible(false);
          // change token list order after closing the dialog
          setTimeout(() => {
            onTokenChange(token, isOccupied);
            if (onlyCurrentChain) {
              setOpenSwitchChainDialog(true);
            }
          }, transitionTime);
        }}
      />
      {/* switch chain */}
      <SwitchChainDialog
        chainId={token?.chainId}
        open={openSwitchChainDialog}
        onClose={() => setOpenSwitchChainDialog(false)}
      />
    </Box>
  );
}
