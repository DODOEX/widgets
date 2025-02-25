import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenInfo } from '../../../../hooks/Token/type';
import { formatTokenAmountNumber } from '../../../../utils';
import { PercentageSelectButtonGroup } from '../../../MiningWidget/MiningList/operate-area/PercentageSelectButtonGroup';

export interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  maxAmount: BigNumber | undefined;
  balance: BigNumber | undefined;
  mint?: TokenInfo | null;
  locked?: boolean;
}

export const CurrencyInputPanel = ({
  value,
  onUserInput,
  maxAmount,
  balance,
  mint,
  locked,
}: CurrencyInputPanelProps) => {
  const theme = useTheme();

  const handleTokenPartChange = useCallback(
    (part: number) => {
      if (!maxAmount || !mint) {
        return;
      }
      const amount = maxAmount.multipliedBy(part).dp(mint.decimals).toString();
      onUserInput(amount);
    },
    [mint, maxAmount, onUserInput],
  );

  const optTokenBalanceStr = useMemo(() => {
    if (!balance) {
      return '-';
    }

    return formatTokenAmountNumber({
      input: balance,
      decimals: mint?.decimals,
    });
  }, [mint?.decimals, balance]);

  return (
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
          }}
        >
          {mint?.address && (
            <TokenLogo
              address={mint?.address ?? ''}
              chainId={mint?.chainId}
              noShowChain
              width={24}
              height={24}
              marginRight={0}
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {mint?.address ? (
              <Box>{mint?.symbol ?? '-'}</Box>
            ) : (
              <Trans>SELECT TOKEN</Trans>
            )}
          </Box>
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
  );
};
