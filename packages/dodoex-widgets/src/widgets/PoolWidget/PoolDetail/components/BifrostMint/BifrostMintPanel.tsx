import { Box, Button, LoadingSkeleton } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';
import TokenLogo from '../../../../../components/TokenLogo';
import { ReactComponent as BifrostMintIcon } from '../../../../../assets/logo/bifrost-mint.svg';
import { BifrostMintToken } from './types';
import { useBifrostApy } from './useBifrostApy';
import { BifrostMintDialog } from './BifrostMintDialog';

interface Props {
  config: BifrostMintToken;
}

export function BifrostMintPanel({ config }: Props) {
  const { wrapToken } = config;
  const { apyDisplay, isLoading } = useBifrostApy(wrapToken.symbol);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <Box
        sx={{
          mt: 20,
          borderRadius: 12,
          background:
            'linear-gradient(to right, rgba(50,106,253,0.1), rgba(254,233,79,0.1))',
          border: '1px solid rgba(69,72,81,0.1)',
          px: 20,
          py: 16,
          display: 'flex',
          alignItems: {
            mobile: 'flex-start',
            tablet: 'center',
          },
          justifyContent: 'space-between',
          flexDirection: {
            mobile: 'column',
            tablet: 'row',
          },
          gap: 16,
        }}
      >
        {/* Left: APY info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Box
            sx={{
              backgroundColor: 'rgba(50,106,253,0.2)',
              borderRadius: 12,
              p: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box component={BifrostMintIcon} sx={{ width: 32, height: 32 }} />
          </Box>
          <Box>
            <Box
              sx={{
                fontSize: 16,
                fontWeight: 500,
                color: 'text.primary',
                lineHeight: '22px',
              }}
            >
              {wrapToken.symbol} APY
            </Box>
            <LoadingSkeleton
              sx={{
                fontSize: 24,
                fontWeight: 700,
                color: '#2fba90',
                lineHeight: '32px',
              }}
              loading={isLoading}
              loadingProps={{ width: 80 }}
            >
              {apyDisplay ?? '-'}
            </LoadingSkeleton>
          </Box>
        </Box>

        {/* Right: Mint button */}
        <Button
          onClick={() => setDialogOpen(true)}
          sx={{
            height: 48,
            px: 20,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: {
              mobile: '100%',
              tablet: 'max-content',
            },
          }}
        >
          <TokenLogo
            address={wrapToken.address}
            width={28}
            height={28}
            chainId={wrapToken.chainId}
            noShowChain
          />
          <Trans>Mint {wrapToken.symbol}</Trans>
        </Button>
      </Box>

      <BifrostMintDialog
        config={config}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
