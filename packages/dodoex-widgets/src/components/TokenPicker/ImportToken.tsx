import { Box, Button } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { Error } from '@dodoex/icons';
import React from 'react';
import Dialog from '../Dialog';
import TokenLogo from '../TokenLogo';
import { TokenInfo } from '../../hooks/Token';
import { getEtherscanPage, truncatePoolAddress } from '../../utils';
import { setCustomTokenList } from '../../hooks/useTokenState';

export default function ImportToken({
  token,
  onImport,
}: {
  token?: TokenInfo;
  onImport?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        sx={{
          px: 8,
          py: 0,
          height: 33,
          borderRadius: 8,
        }}
        onClick={(evt) => {
          evt.stopPropagation();
          setOpen(true);
        }}
      >
        <Trans>ADD</Trans>
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} modal>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            typography: 'caption',
            py: 20,
          }}
        >
          <Trans>Import Token</Trans>
          <Box
            component={Error}
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              position: 'absolute',
              top: 22,
              right: 20,
            }}
            onClick={() => {
              setOpen(false);
            }}
          />
        </Box>
        <Box
          sx={{
            px: 20,
            pb: 20,
            width: {
              mobile: undefined,
              tablet: 420,
            },
          }}
        >
          <Box
            sx={{
              py: 16,
              textAlign: 'center',
            }}
          >
            <Trans>
              This token doesn't appear on the token list.Make sure this is the
              token that you want to trade.
            </Trans>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'background.paperDarkContrast',
              gap: 12,
              mt: 16,
              pt: 16,
              pb: 24,
              borderRadius: 16,
            }}
          >
            <TokenLogo
              token={token}
              chainId={token?.chainId}
              width={32}
              height={32}
              marginRight={0}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Box sx={{ typography: 'h5', fontWeight: 600 }}>
                {token?.symbol}
              </Box>
              <Box sx={{ color: 'text.secondary' }}>{token?.name}</Box>
            </Box>
            {!!token && (
              <Box
                component="a"
                href={getEtherscanPage(token.chainId, token.address)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main',
                  typography: 'body2',
                  '&:hover': {
                    opacity: 0.7,
                  },
                }}
              >
                {truncatePoolAddress(token?.address)}
              </Box>
            )}
          </Box>

          <Button
            variant={Button.Variant.outlined}
            fullWidth
            onClick={() => {
              if (!token) return;
              setCustomTokenList({
                address: token.address,
                chainId: token.chainId,
                decimals: token.decimals,
                name: token.name,
                symbol: token.symbol,
                isCustom: true,
              });
              setOpen(false);
              onImport?.();
            }}
            sx={{
              mt: 24,
            }}
          >
            <Trans>Import</Trans>
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
