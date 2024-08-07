import { Box, RotatingIcon } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { WalletMap, WalletType } from '../../../../constants/wallet';
import { connectToWallet } from '../../../../hooks/ConnectWallet';
import { useSwitchChain } from '../../../../hooks/ConnectWallet/useSwitchChain';
import { useWalletState } from '../../../../hooks/ConnectWallet/useWalletState';
import {
  getDefaultChainId,
  getFromTokenChainId,
} from '../../../../store/selectors/wallet';
import Dialog from '../Dialog';

export default function ConnectWalletDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useLingui();
  const defaultChainId = useSelector(getDefaultChainId);
  const fromTokenChainId = useSelector(getFromTokenChainId);
  const chainId = useMemo(
    () => fromTokenChainId ?? defaultChainId,
    [fromTokenChainId, defaultChainId],
  );
  const [connectingType, setConnectingType] =
    useState<keyof typeof WalletMap | null>(null);
  const connectingWallet = connectingType
    ? WalletMap[connectingType]
    : undefined;
  const switchChain = useSwitchChain(chainId);
  const webReact = useWalletState();
  return (
    <Dialog
      title={<Trans>Connect to your wallet</Trans>}
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          mx: 20,
          pb: 20,
          border: '1px solid transparent',
          borderTopColor: 'border.main',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {connectingWallet ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <Box
              component={connectingWallet.icon}
              sx={{
                width: 32,
                height: 32,
              }}
            />
            <Box
              sx={{
                mt: 8,
                typography: 'caption',
              }}
            >
              {t`Opening ${connectingWallet.name}...`}
            </Box>
            <Box
              sx={{
                mt: 8,
                typography: 'body2',
                color: 'text.secondary',
              }}
            >
              <RotatingIcon />
            </Box>
          </Box>
        ) : (
          <>
            {Object.values(WalletMap).map((wallet) => (
              <Box
                key={wallet.type}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  mt: 20,
                  p: 20,
                  backgroundColor: 'background.tag',
                  borderRadius: 12,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'hover.default',
                  },
                }}
                onClick={async () => {
                  try {
                    setConnectingType(wallet.type as keyof typeof WalletMap);
                    // When the wallet is already connected, switch chains
                    if (webReact.chainId && webReact.chainId !== chainId) {
                      if (
                        wallet.type === WalletType.METAMASK &&
                        webReact.isMetamask &&
                        switchChain
                      ) {
                        await switchChain();
                        setConnectingType(null);
                        return;
                      }
                    }
                    await connectToWallet(wallet.type, chainId, (error) => {
                      console.error(error);
                      setConnectingType(null);
                    });
                  } catch (error) {
                    console.error(error);
                  }
                  setConnectingType(null);
                }}
              >
                <Box
                  component={wallet.icon}
                  sx={{
                    width: 32,
                    height: 32,
                  }}
                />
                <Box
                  sx={{
                    mt: 8,
                    typography: 'caption',
                  }}
                >
                  {wallet.name}
                </Box>
                <Box
                  sx={{
                    mt: 4,
                    typography: 'body2',
                    color: 'text.secondary',
                  }}
                >
                  <Trans>Connect to your {wallet.name} Wallet</Trans>
                </Box>
              </Box>
            ))}
          </>
        )}
      </Box>
    </Dialog>
  );
}
