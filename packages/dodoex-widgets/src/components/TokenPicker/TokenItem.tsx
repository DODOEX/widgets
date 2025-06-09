import { Box, useTheme } from '@dodoex/components';
import { Loading } from '@dodoex/icons';
import BigNumber from 'bignumber.js';
import { CSSProperties } from 'react';
import { tokenPickerItem } from '../../constants/testId';
import { formatTokenAmountNumber } from '../../utils';
import TokenLogo from '../TokenLogo';
import { TokenInfo } from './../../hooks/Token';
import { AddressWithLinkAndCopy } from '../AddressWithLinkAndCopy';

export default function TokenItem({
  token,
  disabled,
  style,
  balance: balanceBigNumber,
  onClick,
}: {
  token: TokenInfo;
  disabled?: boolean;
  style?: CSSProperties;
  balance?: BigNumber;
  onClick: () => void;
}) {
  const theme = useTheme();

  const balance = balanceBigNumber
    ? formatTokenAmountNumber({
        input: balanceBigNumber,
        decimals: token.decimals,
      })
    : '';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        typography: 'body2',
        px: 8,
        py: 8,
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
      <TokenLogo token={token} width={32} height={32} noShowChain noBorder />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          sx={{
            textAlign: 'left',
            color: 'text.primary',
            typography: 'body2',
            fontWeight: 600,
          }}
        >
          {token.symbol}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Box
            sx={{
              color: 'text.secondary',
              typography: 'h6',
              fontWeight: 500,
              maxWidth: '80px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={token.name}
          >
            {token.name}
          </Box>
          <AddressWithLinkAndCopy
            address={token.address}
            customChainId={token.chainId}
            showCopy
            truncate
            iconSpace={2}
            iconSize={12}
            size="small"
            sx={{
              typography: 'h6',
              color: 'text.disabled',
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          ml: 'auto',
          typography: 'body1',
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {balanceBigNumber?.gte(0) ? (
          balance
        ) : (
          <Box
            component={Loading}
            width={18}
            sx={{
              '& path': {
                fill: theme.palette.text.disabled,
              },
              animation: 'loadingRotate 1.1s infinite linear',
              '@keyframes loadingRotate': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(359deg)',
                },
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
