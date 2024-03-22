import { Box, BoxProps, useTheme } from '@dodoex/components';
import { TokenLogoCollapse } from './TokenLogoCollapse';
import { BalanceText } from './BalanceText';
import { NumberInput } from './NumberInput';
import { TokenPickerDialog } from './TokenPickerDialog';
import { useState, useEffect } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { TokenPickerProps } from '../../../TokenPicker';
import { transitionTime } from '../Dialog';
import SwitchChainDialog from '../../../SwitchChainDialog';
import { useQuery } from '@tanstack/react-query';
import { tokenApi } from '../../../../constants/api';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import BigNumber from 'bignumber.js';

export interface TokenCardProps {
  amt: string;
  fiatPriceTxt?: string | React.ReactNode;
  sx?: BoxProps['sx'];
  readOnly?: boolean;
  showMaxBtn?: boolean;
  occupiedAddrs?: string[];
  occupiedChainId?: TokenPickerProps['occupiedChainId'];
  onMaxClick?: (max: string) => void;
  token?: TokenInfo | null;
  onInputChange?: (v: string) => void;
  onInputFocus?: () => void;
  onTokenClick?: () => void;
  onTokenChange?: (token: TokenInfo, isOccupied: boolean) => void;
  side?: TokenPickerProps['side'];
  showChainLogo?: boolean;
  onlyCurrentChain?: boolean;
  defaultLoadBalance?: boolean;
  overrideBalance?: BigNumber | null;
  overrideBalanceLoading?: boolean;
}

export function CardPlus() {
  return (
    <Box
      sx={{
        height: 30,
        textAlign: 'center',
        fontSize: 32,
        lineHeight: '30px',
      }}
    >
      +
    </Box>
  );
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
  onlyCurrentChain,
  defaultLoadBalance,
  overrideBalance,
  overrideBalanceLoading,
}: TokenCardProps) {
  const { account } = useWalletInfo();
  const [openSwitchChainDialog, setOpenSwitchChainDialog] = useState(false);
  const theme = useTheme();
  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);
  const tokenQuery = useQuery(
    tokenApi.getFetchTokenQuery(token?.chainId, token?.address, account),
  );
  const balance = overrideBalance ?? tokenQuery.data?.balance ?? null;

  useEffect(() => {
    if (token && onlyCurrentChain) {
      setOpenSwitchChainDialog(true);
    }
  }, [token, onlyCurrentChain]);

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
          readonly={!onTokenChange}
        />

        <BalanceText
          balance={balance}
          onClick={readOnly ? undefined : onMaxClick ?? onInputChange}
          showMaxBtn={showMaxBtn}
          address={token?.address}
          decimals={token?.decimals}
          loading={overrideBalanceLoading ?? tokenQuery.isLoading}
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
        occupiedChainId={occupiedChainId}
        defaultLoadBalance={defaultLoadBalance}
        onClose={() => {
          setTokenPickerVisible(false);
          onTokenClick && onTokenClick();
        }}
        onTokenChange={(token, isOccupied) => {
          setTokenPickerVisible(false);
          // change token list order after closing the dialog
          setTimeout(() => {
            if (!Array.isArray(token) && onTokenChange) {
              onTokenChange(token, isOccupied);
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
