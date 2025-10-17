import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useCallback, useMemo, useState } from 'react';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';
import TokenLogo from '../../../../components/TokenLogo';
import { formatTokenAmountNumber } from '../../../../utils';
import { PercentageSelectButtonGroup } from '../../../MiningWidget/MiningList/operate-area/PercentageSelectButtonGroup';
import { Currency, CurrencyAmount } from '../sdks/sdk-core';
import { TokenPickerDialog } from '../../../../components/Swap/components/TokenCard/TokenPickerDialog';
import { convertBackToTokenInfo } from '../utils';
import { TokenInfo } from '../../../../hooks/Token';
import { basicTokenMap, ChainId } from '@dodoex/api';

export interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  maxAmount: CurrencyAmount<Currency> | undefined;
  balance: CurrencyAmount<Currency> | undefined;
  currency?: Currency | null;
  locked?: boolean;
  onChangeNativeCurrenct?: (c: TokenInfo) => void;
}

export const CurrencyInputPanel = ({
  value,
  onUserInput,
  maxAmount,
  balance,
  currency,
  locked,
  onChangeNativeCurrenct,
}: CurrencyInputPanelProps) => {
  const theme = useTheme();

  const handleTokenPartChange = useCallback(
    (part: number) => {
      if (!maxAmount || !currency) {
        return;
      }
      const amount = maxAmount
        .toExact()
        .multipliedBy(part)
        .dp(currency.decimals)
        .toString();
      onUserInput(amount);
    },
    [currency, maxAmount, onUserInput],
  );

  const optTokenBalanceStr = useMemo(() => {
    if (!balance) {
      return '-';
    }

    return formatTokenAmountNumber({
      input: balance.toExact(),
      decimals: currency?.decimals,
    });
  }, [currency?.decimals, balance]);

  const tokenList = useMemo(() => {
    const chainId = currency?.chainId as ChainId | undefined;
    const basic = chainId !== undefined ? basicTokenMap[chainId] : undefined;
    if (!basic) return undefined;
    const isWrapped =
      currency?.address.toLowerCase() ===
      basic.wrappedTokenAddress.toLowerCase();
    return [
      {
        ...basic,
        chainId,
      },
      {
        chainId: chainId,
        address: basic.wrappedTokenAddress,
        symbol: isWrapped ? currency.symbol : basic.wrappedTokenSymbol,
        name: isWrapped ? currency.name : basic.symbol,
        decimals: isWrapped ? currency.decimals : basic.decimals,
      },
    ] as [TokenInfo, TokenInfo];
  }, [currency]);
  const [_, wrappedToken] = tokenList ?? [];

  const canSelect =
    !!onChangeNativeCurrenct &&
    (currency?.isNative ||
      currency?.address.toLowerCase() === wrappedToken?.address.toLowerCase());
  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);

  return (
    <>
      <Box
        sx={{
          pt: 12,
          pb: 20,
          px: 20,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'border.main',
          borderRadius: 12,
          backgroundColor: theme.palette.background.input,
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: theme.palette.text.primary,
              typography: 'h5',
              ...(canSelect && {
                '&:hover': {
                  color: theme.palette.text.secondary,
                },
              }),
            }}
            component={canSelect ? ButtonBase : undefined}
            onClick={canSelect ? () => setTokenPickerVisible(true) : undefined}
          >
            {currency?.address && (
              <TokenLogo
                address={currency?.address ?? ''}
                chainId={currency?.chainId}
                noShowChain
                width={24}
                height={24}
                marginRight={0}
              />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {currency?.address ? (
                <Box>{currency?.symbol ?? '-'}</Box>
              ) : (
                <Trans>SELECT TOKEN</Trans>
              )}
            </Box>
            {canSelect && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.58398 11.376C8.78189 11.6728 9.21811 11.6728 9.41603 11.376L12.4818 6.77735C12.7033 6.44507 12.4651 6 12.0657 6H5.93426C5.53491 6 5.29672 6.44507 5.51823 6.77735L8.58398 11.376Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </Box>
          <Box
            component={ButtonBase}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.text.primary,
              },
              cursor: 'pointer',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              typography: 'body2',
            }}
            onClick={() => {
              handleTokenPartChange(1);
            }}
          >
            <Box
              sx={{
                wordBreak: 'keep-all',
              }}
            >
              {t`Balance`}
              :&nbsp;
            </Box>
            <Box
              sx={{
                wordBreak: 'break-all',
                textAlign: 'right',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {optTokenBalanceStr}
            </Box>
          </Box>
        </Box>

        <NumberInput
          sx={{
            mt: 4,
          }}
          suffix={undefined}
          value={value}
          onChange={onUserInput}
          readOnly={locked}
          withClear={!locked}
        />

        {locked ? null : (
          <PercentageSelectButtonGroup
            sx={{
              mt: 20,
              mb: 0,
            }}
            onClick={handleTokenPartChange}
            currentValue={value}
          />
        )}
      </Box>

      {canSelect && (
        <TokenPickerDialog
          value={convertBackToTokenInfo(currency)}
          open={tokenPickerVisible}
          chainId={currency?.chainId}
          onClose={() => {
            setTokenPickerVisible(false);
          }}
          onTokenChange={(selectedToken) => {
            if (Array.isArray(selectedToken)) {
              return;
            }
            onChangeNativeCurrenct(selectedToken);
            setTokenPickerVisible(false);
          }}
          modal
          tokenList={tokenList}
        />
      )}
    </>
  );
};
