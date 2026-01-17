import { Trans } from '@lingui/macro';
import { Box, Button, useTheme } from '@dodoex/components';
import Dialog from '../../../../components/Dialog';
import { basicTokenMap, ChainId } from '@dodoex/api';
import { TokenInfo } from '../../../../hooks/Token';
import BigNumber from 'bignumber.js';
import { TokenCard } from '../../../../components/Swap/components/TokenCard';
import { useState } from 'react';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';
import TokenStatusButton from '../../../../components/TokenStatusButton';

export default function RemoveDialog({
  token,
  baseTokenPosition,
  balanceLoading,
  chainId,
  open,
  loading,
  onClose,
  onConfirm,
}: {
  token: TokenInfo | undefined | null;
  baseTokenPosition: BigNumber;
  balanceLoading: boolean;
  chainId: ChainId | undefined;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (params: {
    sharesAmountParseUnit: string;
    isUnWrap: boolean;
  }) => void;
}) {
  const theme = useTheme();
  const basicToken = chainId ? basicTokenMap[chainId] : null;
  const [value, setValue] = useState('');
  const tokenStatus = useTokenStatus(token, {
    amount: value,
  });

  return (
    <Dialog modal open={open} onClose={onClose} title={<Trans>Remove</Trans>}>
      <Box
        sx={{
          p: theme.spacing(8, 20, 20),
          width: {
            mobile: '100%',
            tablet: 420,
          },
        }}
      >
        <TokenCard
          token={token}
          amt={value}
          onInputChange={setValue}
          overrideBalance={baseTokenPosition}
          overrideBalanceLoading={balanceLoading}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 28,
            padding: 20,
            backgroundColor: theme.palette.background.paperContrast,
          }}
        >
          <Box>
            <Box
              sx={{
                fontSize: 12,
                color: 'text.secondary',
              }}
            >
              <Trans>Receive</Trans>
            </Box>
            <Box
              sx={{
                display: 'flex',
                fontWeight: 600,
              }}
            >
              <Box
                sx={{
                  typography: 'h5',
                  maxWidth: 185,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: new BigNumber(value).gt(0)
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                }}
              >
                {value || 0}
              </Box>
              <Box
                sx={{
                  ml: 4,
                  typography: 'h6',
                  display: 'flex',
                  alignSelf: 'flex-end',
                }}
              >
                {token?.symbol}
              </Box>
            </Box>
          </Box>
          <TokenStatusButton status={tokenStatus}>
            <Button
              fullWidth
              isLoading={loading}
              disabled={!Number(value)}
              onClick={() => {
                if (!token) return;
                onConfirm({
                  sharesAmountParseUnit: new BigNumber(value)
                    .times(10 ** token?.decimals)
                    .toString(),
                  isUnWrap:
                    token.address.toLowerCase() ===
                    basicToken?.address.toLowerCase(),
                });
              }}
            >
              <Trans>Remove</Trans>
            </Button>
          </TokenStatusButton>
        </Box>
      </Box>
    </Dialog>
  );
}
