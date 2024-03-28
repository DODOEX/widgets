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
import SwitchChainDialog from '../../../SwitchChainDialog';
import { useQuery } from '@tanstack/react-query';
import { tokenApi } from '../../../../constants/api';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import BigNumber from 'bignumber.js';
import { PercentageSelectButtonGroup } from './PercentageSelectButtonGroup';
import { Trans } from '@lingui/macro';
import { useGlobalConfig } from '../../../../providers/GlobalConfigContext';
import { ChainId } from '@dodoex/api';

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
  showPercentage?: boolean;
  inputReadonlyTooltip?: React.ReactNode;
  chainId?: ChainId;
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
  showPercentage,
  inputReadonlyTooltip,
  chainId,
}: TokenCardProps) {
  const { account } = useWalletInfo();
  const [openSwitchChainDialog, setOpenSwitchChainDialog] = useState(false);
  const theme = useTheme();
  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);
  const tokenQuery = useQuery(
    tokenApi.getFetchTokenQuery(token?.chainId, token?.address, account),
  );
  const balance = overrideBalance ?? tokenQuery.data?.balance ?? null;

  const [percentage, setPercentage] = useState(0);
  const percentageSetValue = useRef('');

  /** After amt is changed, the percentage no matches, so clear it. */
  useEffect(() => {
    if (amt !== percentageSetValue.current) {
      setPercentage(0);
    }
  }, [amt]);

  useEffect(() => {
    if (token && onlyCurrentChain) {
      setOpenSwitchChainDialog(true);
    }
  }, [token, onlyCurrentChain]);

  const { gotoBuyToken } = useGlobalConfig();
  let showBuyTokenBtn = gotoBuyToken && balance && amt && balance.lt(amt);

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
          address={token?.address}
          decimals={token?.decimals}
          loading={overrideBalanceLoading ?? tokenQuery.isLoading}
        />
      </Box>

      {readOnly && inputReadonlyTooltip ? (
        <TooltipToast title={inputReadonlyTooltip}>
          <Box>
            <NumberInput
              value={amt}
              readOnly
              withClear
              sx={{
                mt: 12,
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
          sx={{
            mt: 12,
          }}
        />
      )}

      {!readOnly && showPercentage ? (
        <PercentageSelectButtonGroup
          sx={{
            mt: 16,
            mb: 9,
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
            mt: 4,
            typography: 'body2',
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
