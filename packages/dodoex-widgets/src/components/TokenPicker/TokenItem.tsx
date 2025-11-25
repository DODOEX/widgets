import { Box, ButtonBase } from '@dodoex/components';
import { CSSProperties } from 'react';
import { formatReadableNumber, getEtherscanPage } from '../../utils';
import TokenLogo from '../TokenLogo';
import { TokenInfo } from './../../hooks/Token';
import { ArrowTopRightBorder, Delete, Loading } from '@dodoex/icons';
import { tokenPickerItem } from '../../constants/testId';
import { useTheme } from '@dodoex/components';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import TokenDetailInfo from './TokenDetailInfo';

export default function TokenItem({
  token,
  disabled,
  style,
  balance: balanceBigNumber,
  onClick,
  onDelete,
}: {
  token: TokenInfo;
  disabled?: boolean;
  style?: CSSProperties;
  balance?: BigNumber;
  onClick: () => void;
  onDelete?: () => void;
}) {
  const theme = useTheme();
  const { account } = useWeb3React();
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
          textAlign: 'left',
        }}
      >
        <TokenLogo token={token} />
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 600,
            }}
          >
            {token.symbol}
            {!!onDelete && (
              <>
                <Box
                  component="a"
                  href={getEtherscanPage(token.chainId, token.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                  onClick={(evt) => {
                    evt.stopPropagation();
                  }}
                >
                  <Box component={ArrowTopRightBorder} width={18} height={18} />
                </Box>
                <Box
                  sx={{
                    width: '1px',
                    height: '12px',
                    backgroundColor: 'border.main',
                  }}
                />
                <ButtonBase
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      opacity: 0.5,
                    },
                  }}
                  onClick={(evt: any) => {
                    evt.stopPropagation();
                    onDelete();
                  }}
                >
                  <Box component={Delete} width={18} height={18} />
                </ButtonBase>
              </>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              typography: 'h6',
              color: 'text.secondary',
            }}
          >
            {token.name}
            <TokenDetailInfo
              token={token}
              isCustom={token.isCustom || !!onDelete}
            />
          </Box>
        </Box>
      </Box>
      {!!account && (
        <Box
          sx={{
            mt: 4,
            textAlign: 'right',
            fontWeight: 600,
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
  );
}
