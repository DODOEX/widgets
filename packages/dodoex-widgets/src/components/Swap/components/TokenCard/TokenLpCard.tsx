import {
  Box,
  BoxProps,
  useTheme,
  Button,
  TooltipToast,
  ButtonBase,
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
import { TokenLogoPair } from '../../../TokenLogoPair';

export interface TokenCardProps {
  amt: string;
  fiatPriceTxt?: string | React.ReactNode;
  sx?: BoxProps['sx'];
  inputSx?: BoxProps['sx'];
  readOnly?: boolean;
  showMaxBtn?: boolean;
  canClickBalance?: boolean;
  onMaxClick?: (max: string) => void;
  tokenPair?: [TokenInfo | null | undefined, TokenInfo | null | undefined];
  decimals?: number;
  onInputChange?: (v: string) => void;
  onInputFocus?: () => void;
  onInputBlur?: (v: string) => void;
  showChainLogo?: boolean;
  showChainName?: boolean;
  overrideBalance?: BigNumber | null;
  overrideBalanceLoading?: boolean;
  balanceText?: React.ReactNode;
  showPercentage?: boolean;
  inputReadonlyTooltip?: React.ReactNode;
  inputTypography?: string;
  chainId?: ChainId;
  hideToken?: boolean;
  checkLogBalance?: BalanceData;
}

export function TokenLpCard({
  sx,
  inputSx,
  amt,
  tokenPair,
  decimals,
  readOnly,
  showMaxBtn,
  canClickBalance,
  onMaxClick,
  fiatPriceTxt,
  onInputFocus,
  onInputBlur,
  onInputChange,
  showChainLogo,
  showChainName,
  overrideBalance,
  overrideBalanceLoading,
  balanceText,
  showPercentage,
  inputReadonlyTooltip,
  inputTypography,
  chainId,
  hideToken,
  checkLogBalance,
}: TokenCardProps) {
  const theme = useTheme();
  const balance = overrideBalance ?? null;
  const { isTokenLoading } = useBalanceUpdateLoading();
  let balanceLoading = overrideBalanceLoading;
  if (!balanceLoading && balance) {
    if (checkLogBalance) {
      balanceLoading = Object.entries(checkLogBalance).some(([key, value]) => {
        return isTokenLoading(key, value);
      });
    }
  }

  const [percentage, setPercentage] = useState(0);
  const percentageSetValue = useRef('');

  /** After amt is changed, the percentage no matches, so clear it. */
  useEffect(() => {
    if (amt !== percentageSetValue.current) {
      setPercentage(0);
    }
  }, [amt]);

  const showInputNumber = !!onInputChange || !!inputReadonlyTooltip;
  const [baseToken, quoteToken] = tokenPair ?? [];

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
          <Box
            component={ButtonBase}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: theme.palette.text.primary,
              typography: showChainName ? 'body2' : 'h5',
              fontWeight: 600,
              '&:focus-visible': {
                opacity: 0.5,
              },
            }}
          >
            {!!(baseToken && quoteToken) && (
              <TokenLogoPair
                tokens={tokenPair as [TokenInfo, TokenInfo]}
                width={24}
                height={24}
                chainId={chainId ?? baseToken.chainId}
                mr={0}
                showChainLogo={!showChainLogo}
              />
            )}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {`${baseToken?.symbol ?? ''}-${quoteToken?.symbol ?? ''} LP`}
              </Box>
            </Box>
          </Box>
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
          address="address"
          decimals={decimals}
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
            onBlur={onInputBlur}
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
            balance
              ? (part) => {
                  if (balance) {
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
                        .dp(decimals ?? 18)
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
    </Box>
  );
}
