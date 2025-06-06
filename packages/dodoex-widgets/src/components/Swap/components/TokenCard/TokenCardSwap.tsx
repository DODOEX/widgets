import {
  Box,
  BoxProps,
  Button,
  TooltipToast,
  useTheme,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { tokenApi } from '../../../../constants/api';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import {
  BalanceData,
  useBalanceUpdateLoading,
} from '../../../../hooks/Submission/useBalanceUpdateLoading';
import { TokenInfo } from '../../../../hooks/Token';
import { useFetchTokens } from '../../../../hooks/contract';
import { TokenPickerProps } from '../../../TokenPicker';
import { useUserOptions } from '../../../UserOptionsProvider';
import { transitionTime } from '../Dialog';
import { BalanceText } from './BalanceText';
import { NumberInput } from './NumberInput';
import { TokenLogoCollapse } from './TokenLogoCollapse';
import { TokenPickerDialog } from './TokenPickerDialog';
import { WalletConnectBtn } from './WalletConnectBtn';

export interface TokenCardProps {
  amt: string;
  fiatPriceTxt?: string | React.ReactNode;
  sx?: BoxProps['sx'];
  readOnly?: boolean;
  showMaxBtn?: boolean;
  canClickBalance?: boolean;
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
  showChainName?: boolean;
  defaultLoadBalance?: boolean;
  overrideBalance?: BigNumber | null;
  overrideBalanceLoading?: boolean;
  balanceText?: React.ReactNode;
  showPercentage?: boolean;
  inputReadonlyTooltip?: React.ReactNode;
  inputTypography?: string;
  hideToken?: boolean;
  checkLogBalance?: BalanceData;
  notTokenPickerModal?: boolean;
  enterAddressEnabled?: boolean;
  inputToAddress: string | null;
  setInputToAddress: Dispatch<SetStateAction<string | null>>;
  account: ReturnType<
    ReturnType<typeof useWalletInfo>['getAppKitAccountByChainId']
  >;
}

export function TokenCardSwap({
  sx,
  amt,
  token,
  readOnly,
  showMaxBtn,
  canClickBalance,
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
  overrideBalance,
  overrideBalanceLoading,
  balanceText,
  showPercentage,
  inputReadonlyTooltip,
  inputTypography,
  hideToken,
  checkLogBalance,
  notTokenPickerModal,
  enterAddressEnabled,
  inputToAddress,
  setInputToAddress,
  account,
}: TokenCardProps) {
  const theme = useTheme();

  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);

  const tokenQuery = useQuery(
    tokenApi.getFetchTokenQuery(
      token?.chainId,
      token?.address,
      account?.appKitAccount?.address,
    ),
  );
  const balance = overrideBalance ?? tokenQuery.data?.balance ?? null;

  const { isTokenLoading } = useBalanceUpdateLoading();
  let balanceLoading = overrideBalanceLoading ?? tokenQuery.isLoading;
  if (!balanceLoading && balance) {
    if (checkLogBalance) {
      balanceLoading = Object.entries(checkLogBalance).some(([key, value]) => {
        return isTokenLoading(key, value);
      });
    } else if (token) {
      balanceLoading = isTokenLoading(token.address, balance);
    }
  }

  useFetchTokens({
    tokenList: token ? [token] : [],
  });

  const [percentage, setPercentage] = useState(0);
  const percentageSetValue = useRef('');

  /** After amt is changed, the percentage no matches, so clear it. */
  useEffect(() => {
    if (amt !== percentageSetValue.current) {
      setPercentage(0);
    }
  }, [amt]);

  const { gotoBuyToken } = useUserOptions();
  let showBuyTokenBtn = gotoBuyToken && balance && amt && balance.lt(amt);

  const showInputNumber = !!onInputChange || !!inputReadonlyTooltip;

  const inputSx = {
    '& input': {
      typography: 'h2',
      height: '44px',
      border: 'none',
      outline: 'none',
      padding: 0,
      color: 'text.primary',
      '&::placeholder': {
        typography: 'h2',
        height: '44px',
        color: 'text.disabled',
      },
    },
    backgroundColor: 'background.paper',
  };

  return (
    <Box
      sx={{
        minHeight: showInputNumber ? 133 : 'auto',
        padding: theme.spacing(20, 20, 24),
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 12,
        backgroundColor: theme.palette.background.paper,
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
        {hideToken ? (
          <Box />
        ) : (
          <TokenLogoCollapse
            token={token}
            showChainLogo={showChainLogo}
            showChainName={showChainName}
            onClick={() => setTokenPickerVisible(true)}
            readonly={!onTokenChange}
          />
        )}

        {token && (
          <WalletConnectBtn
            token={token}
            enterAddressEnabled={enterAddressEnabled}
            inputToAddress={inputToAddress}
            setInputToAddress={setInputToAddress}
            account={account}
          />
        )}
      </Box>

      {showInputNumber &&
        (readOnly && inputReadonlyTooltip ? (
          <TooltipToast title={inputReadonlyTooltip} arrow={false}>
            <Box>
              <NumberInput
                value={amt}
                readOnly
                withClear
                sx={{
                  mt: 16,
                  ...inputSx,
                }}
              />
            </Box>
          </TooltipToast>
        ) : (
          <NumberInput
            value={amt}
            onFocus={onInputFocus}
            onChange={
              onInputChange
                ? (v) => {
                    onInputChange(v);
                    setPercentage(0);
                  }
                : undefined
            }
            readOnly={readOnly}
            withClear
            suffix={
              showBuyTokenBtn ? (
                <Button
                  variant={Button.Variant.tag}
                  backgroundColor={theme.palette.background.paperDarkContrast}
                  sx={{
                    fontSize: 12,
                  }}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    if (!account?.appKitAccount?.address) {
                      return;
                    }
                    gotoBuyToken?.({
                      token: token as TokenInfo,
                      account: account.appKitAccount.address,
                    });
                  }}
                >
                  <Trans>Buy</Trans>
                </Button>
              ) : undefined
            }
            typography={inputTypography}
            sx={{
              mt: 16,
              ...inputSx,
            }}
          />
        ))}

      <Box
        sx={{
          mt: showPercentage ? 9 : 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            typography: 'h6',
            color: theme.palette.text.secondary,
          }}
        >
          {fiatPriceTxt}
        </Box>
        <BalanceText
          balance={balance}
          balanceText={balanceText}
          onClick={
            readOnly || (!onMaxClick && !onInputChange)
              ? undefined
              : (v) => {
                  if (onMaxClick) {
                    onMaxClick(v);
                  } else if (onInputChange) {
                    onInputChange(v);
                  }
                  if (percentage !== 0 && percentage !== 1) {
                    setPercentage(1);
                    percentageSetValue.current = v;
                  }
                }
          }
          showMaxBtn={showMaxBtn}
          canClickBalance={canClickBalance}
          address={token?.address}
          decimals={token?.decimals}
          loading={balanceLoading}
        />
      </Box>

      {/* Token Picker */}
      <TokenPickerDialog
        value={token}
        open={tokenPickerVisible}
        side={side}
        chainId={undefined}
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
        modal={!notTokenPickerModal}
      />
    </Box>
  );
}
