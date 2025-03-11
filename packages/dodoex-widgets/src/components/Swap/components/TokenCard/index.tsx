import { ChainId } from '@dodoex/api';
import {
  Box,
  BoxProps,
  Button,
  TooltipToast,
  useTheme,
} from '@dodoex/components';
import { Plus } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useEffect, useRef, useState } from 'react';
import { BIG_ALLOWANCE } from '../../../../constants/token';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import {
  BalanceData,
  useBalanceUpdateLoading,
} from '../../../../hooks/Submission/useBalanceUpdateLoading';
import { TokenInfo } from '../../../../hooks/Token';
import { useFetchTokens } from '../../../../hooks/contract';
import { useSolanaConnection } from '../../../../hooks/solana/useSolanaConnection';
import { TokenPickerProps } from '../../../TokenPicker';
import { useUserOptions } from '../../../UserOptionsProvider';
import { transitionTime } from '../Dialog';
import { BalanceText } from './BalanceText';
import { NumberInput } from './NumberInput';
import { PercentageSelectButtonGroup } from './PercentageSelectButtonGroup';
import { TokenLogoCollapse } from './TokenLogoCollapse';
import { TokenPickerDialog } from './TokenPickerDialog';

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
  const { account, isSolana } = useWalletInfo();
  const theme = useTheme();
  const { gotoBuyToken } = useUserOptions();
  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);

  const { fetchTokenBalance } = useSolanaConnection();
  const svmTokenQuery = useQuery({
    queryKey: [
      'token',
      'getFetchTokenQuery',
      chainId,
      account?.toLocaleLowerCase(),
      undefined,
      token?.address,
    ],
    queryFn: async () => {
      if (!token) return;
      const result = await fetchTokenBalance(token.address);
      return {
        ...token,
        balance: result.amount,
        allowance: BIG_ALLOWANCE,
      };
    },
    enabled: !!account && isSolana && !!token,
  });
  const tokenQuery = svmTokenQuery;
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
    chainId: token?.chainId,
  });

  const [percentage, setPercentage] = useState(0);
  const percentageSetValue = useRef('');

  /** After amt is changed, the percentage no matches, so clear it. */
  useEffect(() => {
    if (amt !== percentageSetValue.current) {
      setPercentage(0);
    }
  }, [amt]);

  let showBuyTokenBtn = gotoBuyToken && balance && amt && balance.lt(amt);

  const showInputNumber = !!onInputChange || !!inputReadonlyTooltip;

  return (
    <Box
      sx={{
        minHeight: showInputNumber ? 133 : 'auto',
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
