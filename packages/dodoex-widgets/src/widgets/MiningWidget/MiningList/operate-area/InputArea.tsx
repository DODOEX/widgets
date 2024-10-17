import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { Loading } from '@dodoex/icons';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { ReactComponent as LockIcon } from './lock_24dp.svg';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';
import { formatTokenAmountNumber } from '../../../../utils';
import { MiningLpTokenI, TabMiningI } from '../../types';
import { PercentageSelectButtonGroup } from './PercentageSelectButtonGroup';

export function InputArea({
  operateType,
  type,
  lpToken,
  lpTokenBalance,
  currentTokenAmount,
  setCurrentTokenAmount,
  needApprove,
  readOnly,
  lpTokenBalanceLoading,
}: {
  type: TabMiningI['type'];
  operateType: 'stake' | 'unstake';
  lpToken: MiningLpTokenI;
  lpTokenBalance: BigNumber | undefined;
  currentTokenAmount: string;
  setCurrentTokenAmount: Dispatch<SetStateAction<string>>;
  needApprove: boolean;
  readOnly: boolean;
  lpTokenBalanceLoading: boolean;
}) {
  const theme = useTheme();

  const isDeposit = operateType === 'stake';
  const isLpTokenMining =
    type === 'classical' || type === 'dvm' || type === 'lptoken';

  const handleTokenPartChange = useCallback(
    (part: number) => {
      if (
        !lpTokenBalance ||
        lpToken?.decimals === undefined ||
        lpTokenBalanceLoading
      ) {
        return;
      }
      const amount = lpTokenBalance
        .multipliedBy(part)
        .dp(lpToken.decimals, BigNumber.ROUND_DOWN)
        .toString();
      setCurrentTokenAmount(amount);
    },
    [
      lpTokenBalance,
      lpToken.decimals,
      lpTokenBalanceLoading,
      setCurrentTokenAmount,
    ],
  );

  const optTokenBalanceStr = useMemo(() => {
    if (lpToken?.decimals === undefined) {
      return '-';
    }
    if (!lpTokenBalance) {
      return '-';
    }
    if (lpTokenBalanceLoading) {
      return (
        <Loading
          style={{
            width: 17,
            height: 17,
          }}
        />
      );
    }
    return formatTokenAmountNumber({
      input: lpTokenBalance,
      decimals: lpToken.decimals,
    });
  }, [lpToken.decimals, lpTokenBalance, lpTokenBalanceLoading]);

  return (
    <Box
      sx={{
        pt: 12,
        pb: 20,
        px: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'custom.border.default',
        borderRadius: 12,
        backgroundColor: theme.palette.background.input,
      }}
    >
      <Box
        component={ButtonBase}
        sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.text.primary,
          },
          cursor: lpTokenBalanceLoading ? 'unset' : 'pointer',
          width: '100%',
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
          {isLpTokenMining
            ? t`LP Balance`
            : t`${lpToken?.symbol ?? '-'} Balance`}
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

      <NumberInput
        sx={{
          mt: 4,
        }}
        suffix={
          needApprove && isDeposit ? (
            <LockIcon
              style={{
                color: theme.palette.primary.main,
              }}
            />
          ) : undefined
        }
        value={currentTokenAmount}
        onChange={setCurrentTokenAmount}
        readOnly={readOnly}
        withClear={!readOnly}
      />

      {readOnly ? null : (
        <PercentageSelectButtonGroup
          sx={{
            mt: 20,
            mb: 0,
          }}
          onClick={handleTokenPartChange}
          currentValue={currentTokenAmount}
        />
      )}
    </Box>
  );
}
