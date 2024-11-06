import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { Box, useTheme, ButtonBase, RotatingIcon } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { Trans } from '@lingui/macro';
import React from 'react';

export function BalanceText({
  onClick,
  balance,
  decimals,
  address,
  showMaxBtn,
  canClickBalance: canClickBalanceProps,
  loading,
  balanceText,
}: {
  onClick?: (max: string) => void;
  balance: BigNumber | null;
  decimals?: number;
  address?: string;
  showMaxBtn?: boolean;
  canClickBalance?: boolean;
  loading?: boolean;
  balanceText?: React.ReactNode;
}) {
  const { palette } = useTheme();
  const canClickBalance = canClickBalanceProps && balance?.gt(0) && onClick;

  return (
    <Box
      sx={{
        typography: 'body2',
        alignItems: 'center',
        color: palette.text.secondary,
        wordBreak: 'break-word',
        textAlign: 'right',
        ...(canClickBalance
          ? {
              '&:hover': {
                color: palette.text.primary,
                cursor: 'pointer',
              },
            }
          : {}),
      }}
      onClick={
        canClickBalance
          ? () => onClick(balance ? balance.toString() : '')
          : undefined
      }
    >
      {balanceText ?? <Trans>Balance:</Trans>}&nbsp;
      {loading ? (
        <RotatingIcon
          sx={{
            position: 'relative',
            top: -2,
            verticalAlign: 'middle',
          }}
        />
      ) : (
        <>
          {address
            ? formatTokenAmountNumber({
                input: balance,
                decimals: Math.min(decimals || 4, 4),
              })
            : '-'}
          {showMaxBtn && balance && balance.gt(0) && onClick && (
            <Box
              component={ButtonBase}
              sx={{
                ml: 6,
                color: balance?.gt(0)
                  ? palette.primary.main
                  : palette.text.disabled,
                cursor: address ? 'pointer' : 'unset',
                typography: 'body2',
              }}
              onClick={() =>
                onClick && onClick(balance ? balance.toString() : '')
              }
            >
              <Trans>Max</Trans>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
