import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { Box, useTheme, ButtonBase } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { Trans } from '@lingui/macro';

export function BalanceText({
  onClick,
  balance,
  decimals,
  address,
  showMaxBtn,
}: {
  onClick?: (max: string) => void;
  balance: BigNumber | null;
  decimals?: number;
  address?: string;
  showMaxBtn?: boolean;
}) {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        typography: 'body2',
        color: palette.text.secondary,
      }}
    >
      <Trans>Balance:</Trans>&nbsp;
      {address
        ? formatTokenAmountNumber({
            input: balance,
            decimals: Math.min(decimals || 4, 4),
          })
        : '-'}
      {showMaxBtn && balance && balance.gt(0) && (
        <Box
          component={ButtonBase}
          sx={{
            ml: 6,
            color: balance?.gt(0)
              ? palette.primary.main
              : palette.text.disabled,
            cursor: address && onClick ? 'pointer' : 'unset',
          }}
          onClick={() => onClick && onClick(balance ? balance.toString() : '')}
        >
          <Trans>Max</Trans>
        </Box>
      )}
    </Box>
  );
}
