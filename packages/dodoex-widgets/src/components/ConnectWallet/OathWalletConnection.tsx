import { Box, Button, RotatingIcon } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { ReactComponent as OathIcon } from '../../assets/logo/oathWallet.svg';
import { OathConnectorContext } from '../../hooks/ConnectWallet/OathConnectorContext';
import {
  getOathWalletUri,
  OATH_APP_STORE,
  OathConnectionCancelled,
} from '../../hooks/ConnectWallet/Connectors/OathWalletConnector';

export default function OathWalletConnection({
  chainId,
  onConnected,
  onBack,
}: {
  chainId?: number;
  onConnected: () => void;
  onBack: () => void;
}) {
  const connector = useContext(OathConnectorContext);
  const [uri, setUri] = useState<string>();
  const [qr, setQr] = useState<string>();
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const onConnectedRef = useRef(onConnected);
  onConnectedRef.current = onConnected;

  useEffect(() => {
    let mounted = true;
    let connected = false;
    if (!connector) {
      setFailed(true);
      return;
    }
    const unsubscribe = connector.subscribeUri((value) => {
      if (mounted) setUri(value);
    });
    setFailed(false);
    setUri(undefined);
    void connector
      .activate(chainId)
      .then(() => {
        if (!mounted) return;
        connected = true;
        onConnectedRef.current();
      })
      .catch((error: unknown) => {
        if (mounted && !(error instanceof OathConnectionCancelled))
          setFailed(true);
      });
    return () => {
      mounted = false;
      unsubscribe();
      if (!connected) void connector.deactivate();
    };
  }, [connector, chainId, retry]);

  useEffect(() => {
    let mounted = true;
    setQr(undefined);
    if (uri) {
      void QRCode.toDataURL(uri, {
        width: 240,
        margin: 4,
        errorCorrectionLevel: 'M',
      })
        .then((image) => {
          if (mounted) setQr(image);
        })
        .catch(() => {
          if (mounted) {
            setFailed(true);
            void connector?.deactivate();
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, [connector, uri]);

  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 12,
        py: 16,
      }}
    >
      <Box component={OathIcon} sx={{ width: 40, height: 40 }} />
      <Box sx={{ typography: 'caption' }}>
        <Trans>Connect Oath Wallet</Trans>
      </Box>
      {failed ? (
        <>
          <Box role="alert">
            <Trans>Could not connect. Please try again.</Trans>
          </Box>
          <Button onClick={() => setRetry((value) => value + 1)}>
            <Trans>Try again</Trans>
          </Button>
        </>
      ) : (
        <>
          {qr ? (
            <Box
              component="img"
              src={qr}
              alt="WalletConnect QR code for Oath Wallet"
              sx={{ width: 240, maxWidth: '100%', backgroundColor: '#fff' }}
            />
          ) : (
            <RotatingIcon />
          )}
          <Box sx={{ typography: 'body2', textAlign: 'center' }}>
            <Trans>
              Open Oath on your iPhone and scan this QR code. Review the website
              and requested network in Oath before approving.
            </Trans>
          </Box>
          {isIOS && uri && (
            <Button component="a" href={getOathWalletUri(uri)}>
              <Trans>Open Oath on this iPhone</Trans>
            </Button>
          )}
        </>
      )}
      <Box
        component="a"
        href={OATH_APP_STORE}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Get Oath for iPhone</Trans>
      </Box>
      <Button onClick={onBack}>
        <Trans>Back to wallets</Trans>
      </Button>
    </Box>
  );
}
