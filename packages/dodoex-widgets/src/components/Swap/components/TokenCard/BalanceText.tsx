import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { Box, useTheme, ButtonBase, RotatingIcon } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { Trans } from '@lingui/macro';

export function BalanceText({
  onClick,
  balance,
  decimals,
  address,
  showMaxBtn,
  loading,
}: {
  onClick?: (max: string) => void;
  balance: BigNumber | null;
  decimals?: number;
  address?: string;
  showMaxBtn?: boolean;
  loading?: boolean;
}) {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        typography: 'body2',
        alignItems: 'center',
        color: palette.text.secondary,
      }}
    >
      <Trans>Balance:</Trans>&nbsp;
      {loading ? (
        <RotatingIcon />
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
