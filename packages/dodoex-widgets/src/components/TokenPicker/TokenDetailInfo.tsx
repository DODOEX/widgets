import { Box } from '@dodoex/components';
import { ArrowTopRightBorder, DetailBorder, Error } from '@dodoex/icons';
import { TokenInfo } from '../../hooks/Token';
import Dialog from '../Dialog';
import React from 'react';
import { Trans } from '@lingui/macro';
import TokenLogo from '../TokenLogo';
import { AddTokenToMetamask } from '../AddTokenToMetamask';
import { CopyTooltipToast } from '../CopyTooltipToast';
import { getEtherscanPage, truncatePoolAddress } from '../../utils';

export default function TokenDetailInfo({
  token,
  isCustom,
}: {
  token: TokenInfo;
  isCustom?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Box
        component={DetailBorder}
        sx={{
          width: 14,
          height: 14,
          cursor: 'pointer',
          '&:hover': {
            color: 'text.primary',
          },
        }}
        onClick={(evt) => {
          evt.stopPropagation();
          setOpen(true);
        }}
      />
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
          <Trans>Token Info</Trans>
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
            pb: 44,
            width: {
              mobile: undefined,
              tablet: 420,
            },
          }}
        >
          <Box
            sx={{
              px: 20,
              textAlign: 'center',
            }}
          >
            {isCustom ? (
              <Trans>
                This token doesn't appear on the token list.Make sure this is
                the token that you want to trade.
              </Trans>
            ) : (
              <Trans>
                This is an official appear <br />
                on the token list
              </Trans>
            )}
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
              chainId={token.chainId}
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
                {token.symbol}
              </Box>
              <Box sx={{ color: 'text.secondary' }}>{token.name}</Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Box
                component="a"
                href={getEtherscanPage(token.chainId, token.address)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main',
                  typography: 'body2',
                  textDecoration: 'none',
                  '&:hover': {
                    opacity: 0.7,
                  },
                }}
              >
                {truncatePoolAddress(token.address)}
              </Box>
              <CopyTooltipToast
                size={14}
                copyText={token.address}
                componentProps={{
                  sx: {
                    display: 'flex',
                    alignItems: 'center',
                    color: 'primary.main',
                    height: 14,
                    '&:hover': {
                      opacity: 0.7,
                    },
                  },
                }}
              />
              <Box
                sx={{
                  display: 'block',
                  width: '1px',
                  height: '18px',
                  backgroundColor: 'border.main',
                }}
              />
              <AddTokenToMetamask token={token} />
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
