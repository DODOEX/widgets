import { Box } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { CSSProperties } from 'react';
import { formatReadableNumber } from '../../utils';
import useGetBalance from '../../hooks/Token/useGetBalance';
import TokenLogo from '../TokenLogo';
import { TokenInfo } from './../../hooks/Token';
import { Loading } from '@dodoex/icons';
import { tokenPickerItem } from '../../constants/testId';
import { useTheme } from '@dodoex/components';
import { useWalletState } from '../../hooks/ConnectWallet/useWalletState';
import { ChainId } from '../../constants/chains';

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
  const theme = useTheme();
  const getBalance = useGetBalance();
  const { account, isTon } = useWalletState();
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
          {account &&
            (isTon
              ? token.chainId === ChainId.TON
              : token.chainId !== ChainId.TON) && (
              <Box
                sx={{
                  mt: 4,
                  textAlign: 'left',
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
            )}
        </Box>
      </Box>
      <Box
        sx={{
          color: 'text.secondary',
          textAlign: 'right',
        }}
      >
        {token.name}
      </Box>
    </Box>
  );
}
