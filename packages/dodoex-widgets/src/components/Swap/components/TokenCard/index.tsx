import { Box, BoxProps, useTheme } from '@dodoex/components';
import { TokenLogoCollapse } from './TokenLogoCollapse';
import { BalanceText } from './BalanceText';
import { NumberInput } from './NumberInput';
import { TokenPickerDialog } from './TokenPickerDialog';
import { useState, useMemo, useCallback } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import TokenPicker, { TokenPickerProps } from '../../../TokenPicker';
import useGetBalance from '../../../../hooks/Token/useGetBalance';

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
}: TokenCardProps) {
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
        occupiedAddrs={occupiedAddrs}
        onClose={() => {
          onTokenClick && onTokenClick();
          setTokenPickerVisible(false);
        }}
        onTokenChange={(token: TokenInfo, isOccupied: boolean) => {
          onTokenChange(token, isOccupied);
          setTokenPickerVisible(false);
        }}
      />
    </Box>
  );
}
