import { Box, BoxProps, useTheme } from '@dodoex/components';
import { TokenLogoCollapse } from './TokenLogoCollapse';
import { BalanceText } from './BalanceText';
import { NumberInput } from './NumberInput';
import { TokenPickerDialog } from './TokenPickerDialog';
import { useState, useEffect } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { TokenPickerProps } from '../../../TokenPicker';
import useGetBalance from '../../../../hooks/Token/useGetBalance';
import { transitionTime } from '../Dialog';
import { useFetchTokens } from '../../../../hooks/contract';

export interface TokenCardProps {
  amt: string;
  fiatPriceTxt?: string | React.ReactNode;
  sx?: BoxProps['sx'];
  readOnly?: boolean;
  showMaxBtn?: boolean;
  occupiedAddrs?: string[];
  occupiedChainId?: TokenPickerProps['occupiedChainId'];
  onMaxClick?: (max: string) => void;
  token?: TokenPickerProps['value'];
  onInputChange?: (v: string) => void;
  onInputFocus?: () => void;
  onTokenClick?: () => void;
  onTokenChange: TokenPickerProps['onChange'];
  side?: TokenPickerProps['side'];
  showChainLogo?: boolean;
  showChainName?: boolean;
  defaultLoadBalance?: boolean;
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
  occupiedChainId,
  onInputFocus,
  onTokenClick,
  onInputChange,
  onTokenChange,
  side,
  showChainLogo,
  showChainName,
  defaultLoadBalance,
}: TokenCardProps) {
  const theme = useTheme();
  const getBalance = useGetBalance();
  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);
  const balance = token ? getBalance(token) : null;
  useFetchTokens({
    addresses: token ? [token.address] : [],
    chainId: token?.chainId,
  });

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 133,
        padding: theme.spacing(20, 20, 24),
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
          gap: 4,
        }}
      >
        <TokenLogoCollapse
          token={token}
          showChainLogo={showChainLogo}
          showChainName={showChainName}
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
          typography: 'h6',
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
        occupiedChainId={occupiedChainId}
        defaultLoadBalance={defaultLoadBalance}
        onClose={() => {
          setTokenPickerVisible(false);
          onTokenClick && onTokenClick();
        }}
        onTokenChange={(token: TokenInfo, isOccupied: boolean) => {
          setTokenPickerVisible(false);
          // change token list order after closing the dialog
          setTimeout(() => {
            onTokenChange(token, isOccupied);
          }, transitionTime);
        }}
      />
    </Box>
  );
}
