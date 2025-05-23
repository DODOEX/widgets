import { Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';
import { TokenInfo } from '../../../hooks/Token';
import { formatTokenAmountNumber } from '../../../utils/formatter';

export function PriceWithToggle({
  fromToken,
  toToken,
  fromTokenPrice,
  toTokenPrice,
  sx,
  children,
}: {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromTokenPrice: string | null | undefined;
  toTokenPrice: string | null | undefined;
  sx?: BoxProps['sx'];
  children?: React.ReactNode;
}) {
  const theme = useTheme();

  const [toggled, setToggled] = useState(false);

  const price = useMemo(() => {
    if (!fromTokenPrice || !toTokenPrice) {
      return new BigNumber(0);
    }
    return new BigNumber(toggled ? toTokenPrice : fromTokenPrice);
  }, [fromTokenPrice, toTokenPrice, toggled]);

  return (
    <Box
      component={ButtonBase}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'text.primary',
        typography: 'body1',
        fontWeight: 600,
        '&:hover>svg>path': {
          fill: theme.palette.text.primary,
        },
        ...sx,
      }}
      onClick={() => setToggled((prev) => !prev)}
    >
      <Box>
        {children}1&nbsp;{toggled ? toToken.symbol : fromToken.symbol}
        &nbsp;=&nbsp;
        {price && price.isFinite()
          ? formatTokenAmountNumber({
              input: price,
              decimals: toggled ? fromToken.decimals : toToken.decimals,
            })
          : '-'}
        &nbsp;{toggled ? fromToken.symbol : toToken.symbol}
      </Box>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="9" cy="9" r="9" fill={theme.palette.border.main} />
        <path
          d="M9.5 6.5H4.5V8H13.5L9.5 4.25V6.5ZM8.25 13.75V11.5H13.5V10H4.5L8.25 13.75Z"
          fill={theme.palette.text.secondary}
        />
      </svg>
    </Box>
  );
}
