import { Box } from '@dodoex-io/components';
import { CSSProperties } from 'react';
import { formatReadableNumber } from '../../utils';
import useGetBalance from '../../hooks/Token/useGetBalance';
import TokenLogo from '../TokenLogo';
import { TokenInfo } from './../../hooks/Token';
import { tokenPickerItem } from '../../constants/testId';

export default function TokenItem({
  token,
  disabled,
  style,
  onClick,
}: {
  token: TokenInfo;
  disabled?: boolean;
  style?: CSSProperties;
  onClick: () => void;
}) {
  const getBalance = useGetBalance();
  const balanceBigNumber = getBalance(token);
  const balance = balanceBigNumber
    ? formatReadableNumber({
        input: balanceBigNumber,
      })
    : '';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        typography: 'body2',
        px: 6,
        py: 5,
        borderRadius: 8,
        cursor: disabled ? 'auto' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        '&:hover': {
          backgroundColor: 'hover.default',
        },
      }}
      style={style}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
      data-testid={tokenPickerItem}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenLogo token={token} />
        <Box>
          <Box
            sx={{
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            {token.symbol}
          </Box>
          <Box
            sx={{
              mt: 4,
              textAlign: 'left',
            }}
          >
            {balance}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          color: 'text.secondary',
        }}
      >
        {token.name}
      </Box>
    </Box>
  );
}
