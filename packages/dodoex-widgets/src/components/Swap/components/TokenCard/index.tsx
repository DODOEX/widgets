import {
  Box,
  BoxProps,
  useTheme,
  Button,
  TooltipToast,
} from '@dodoex/components';
import { Plus } from '@dodoex/icons';
import { TokenLogoCollapse } from './TokenLogoCollapse';
import { BalanceText } from './BalanceText';
import { NumberInput } from './NumberInput';
import { TokenPickerDialog } from './TokenPickerDialog';
import { useState, useEffect, useRef } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { TokenPickerProps } from '../../../TokenPicker';
import { transitionTime } from '../Dialog';
import { useQuery } from '@tanstack/react-query';
import { tokenApi } from '../../../../constants/api';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import BigNumber from 'bignumber.js';
import { PercentageSelectButtonGroup } from './PercentageSelectButtonGroup';
import { Trans } from '@lingui/macro';
import { ChainId } from '@dodoex/api';
import {
  BalanceData,
  useBalanceUpdateLoading,
} from '../../../../hooks/Submission/useBalanceUpdateLoading';
import { useFetchTokens } from '../../../../hooks/contract';
import { useUserOptions } from '../../../UserOptionsProvider';

export interface TokenCardProps {
  amt: string;
  fiatPriceTxt?: string | React.ReactNode;
  sx?: BoxProps['sx'];
  inputSx?: BoxProps['sx'];
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
  chainId?: ChainId;
  hideToken?: boolean;
  checkLogBalance?: BalanceData;
  notTokenPickerModal?: boolean;
}

export function CardPlus() {
  return (
    <Box
      sx={{
        height: 4,
        position: 'relative',
        color: 'text.secondary',
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          backgroundColor: '#050504',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 4,
          borderStyle: 'solid',
          borderColor: 'background.paper',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
        >
          <path
            d="M19.0142 13H13.0142V19H11.0142V13H5.01416V11H11.0142V5H13.0142V11H19.0142V13Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      </Box>
    </Box>
  );
}

export function CardPlusConnected() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 4,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: 'background.input',
          borderWidth: 4,
          borderColor: 'background.paper',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%) rotate(90deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}
      >
        <Box component={Plus} />
      </Box>
    </Box>
  );
}

export function TokenCard({
  sx,
  inputSx,
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
  chainId,
  hideToken,
  checkLogBalance,
  notTokenPickerModal,
}: TokenCardProps) {
  const { account } = useWalletInfo();
  const theme = useTheme();
  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);
  const tokenQuery = useQuery(
    tokenApi.getFetchTokenQuery(token?.chainId, token?.address, account),
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

  return (
    <Box
      sx={{
        minHeight: showInputNumber ? 133 : 'auto',
        padding: theme.spacing(20, 20, 24),
        borderRadius: 16,
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

      {showInputNumber &&
        (readOnly && inputReadonlyTooltip ? (
          <TooltipToast title={inputReadonlyTooltip} arrow={false}>
            <Box>
              <NumberInput
                value={amt}
                readOnly
                withClear
                sx={{
                  mt: 12,
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
                    gotoBuyToken?.({
                      token: token as TokenInfo,
                      account: account as string,
                    });
                  }}
                >
                  <Trans>Buy</Trans>
                </Button>
              ) : undefined
            }
            typography={inputTypography}
            sx={{
              mt: 12,
              ...inputSx,
            }}
          />
        ))}

      {!readOnly && showPercentage ? (
        <PercentageSelectButtonGroup
          sx={{
            mt: 16,
          }}
          value={percentage}
          onChange={
            balance && token?.decimals !== undefined
              ? (part) => {
                  if (balance && token?.decimals) {
                    setPercentage(part);
                    if (part === 1) {
                      const maxValue = balance.toString();
                      if (onMaxClick) {
                        onMaxClick(maxValue);
                      } else if (onInputChange) {
                        onInputChange(maxValue);
                      }
                      percentageSetValue.current = maxValue;
                    } else if (onInputChange) {
                      const newValue = balance
                        .multipliedBy(part)
                        .dp(token.decimals)
                        .toString();
                      onInputChange(newValue);
                      percentageSetValue.current = newValue;
                    }
                  }
                }
              : undefined
          }
        />
      ) : (
        ''
      )}

      {/* Current Price */}
      {fiatPriceTxt !== undefined ? (
        <Box
          sx={{
            mt: showPercentage ? 9 : 0,
            typography: 'h6',
            color: theme.palette.text.secondary,
          }}
        >
          {fiatPriceTxt}
        </Box>
      ) : (
        ''
      )}

      {/* Token Picker */}
      <TokenPickerDialog
        value={token}
        open={tokenPickerVisible}
        side={side}
        chainId={chainId}
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
