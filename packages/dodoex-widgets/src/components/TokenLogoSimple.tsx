import { Box, BoxProps } from '@dodoex/components';
import Identicon from 'identicon.js';
import React from 'react';

/**
 *
 * @param param0
 * @returns
 * @deprecated
 */
export default function TokenLogoSimple({
  address,
  url,
  symbol,
  width,
  height,
  marginRight,
  zIndex,
  sx,
  onLoadedLogoUrl,
}: {
  address: string | undefined;
  url: string;
  symbol?: string;
  width: number;
  height: number;
  marginRight?: number;
  zIndex?: number;
  sx?: BoxProps['sx'];
  onLoadedLogoUrl?: (isLoaded: boolean) => void;
}) {
  const [loaded, setLoaded] = React.useState(false);
  const onLoad = React.useCallback(() => setLoaded(true), []);
  const [defaultUrl, setDefaultUrl] = React.useState('');
  const [error, setError] = React.useState(false);
  const initial = symbol?.charAt(0).toUpperCase();

  React.useEffect(() => {
    setError(false);
  }, [address]);

  React.useEffect(() => {
    // When address is none：A hash of at least 15 characters is required.
    try {
      let addr = address;
      if (addr && addr.length < 15) {
        addr = addr.padEnd(15, '0');
      }
      if (addr) {
        const data = new Identicon(addr, {
          size: width,
          format: 'svg',
          margin: 0.2,
          background: [255, 234, 4, 255],
        }).toString();
        setDefaultUrl(`data:image/svg+xml;base64,${data}`);
      }
    } catch (err) {
      console.error('generate Identicon error: ', err);
    }
  }, [address, width]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: width,
        width,
        height,
        marginRight,
        zIndex,
        ...(sx || {}),
      }}
      style={{
        width,
        height,
      }}
    >
      {!loaded && (
        <Box
          sx={{
            typography: 'h5',
            height: '100%',
            width: '100%',
            borderRadius: '50%',
            border: 'transparent 2px solid',
            borderColor: 'text.primary',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {initial}
        </Box>
      )}
      <Box
        component="img"
        src={!url || error ? defaultUrl : url}
        onLoad={() => {
          if (onLoadedLogoUrl) {
            onLoadedLogoUrl(true);
          }
          onLoad();
        }}
        onError={(e: any) => {
          const target = e.target as HTMLImageElement;
          if (address && defaultUrl) {
            if (onLoadedLogoUrl) {
              onLoadedLogoUrl(false);
            }
            setError(true);
          }
          target.onerror = null;
        }}
        sx={{
          position: 'absolute',
          top: '0',
          bottom: '0',
          left: '0',
          right: '0',
          borderRadius: '50%',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
}
