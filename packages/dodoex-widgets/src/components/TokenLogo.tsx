import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Identicon from 'identicon.js';
import { Box, BoxProps } from '@dodoex/components';
import { TokenInfo, useFindTokenByAddress } from '../hooks/Token';
import { chainListMap } from '../constants/chainList';
import { ChainId } from '@dodoex/api';
import { useUserOptions } from './UserOptionsProvider';

export interface TokenLogoProps {
  address?: string;
  token?: TokenInfo;
  width?: number;
  height?: number;
  marginRight?: number;
  url?: string;
  zIndex?: number;
  cross?: boolean;
  sx?: BoxProps['sx'];
  chainId?: number;
  noShowChain?: boolean;
  noBorder?: boolean;
  chainSize?: number;
  logoOffset?: number;
}

function toDataURL(url: URL | string, callback: (v?: any) => void) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.onerror = function () {
    callback();
  };
  let urlObj: any;
  try {
    // eslint-disable-next-line no-param-reassign
    urlObj = new URL(url);
  } catch (e) {
    // catch local file
  } finally {
    xhr.open('GET', urlObj || url);
    xhr.responseType = 'blob';
    xhr.send();
  }
}

export default function TokenLogo({
  width = 24,
  height = 24,
  marginRight = 8,
  url,
  zIndex,
  cross,
  address: addressProps,
  token: tokenProps,
  sx,
  chainId,
  noShowChain,
  noBorder,
  chainSize = 12,
  logoOffset: logoOffsetProps,
}: TokenLogoProps): React.ReactElement {
  const [loaded, setLoaded] = useState(false);
  const [crossLogoUrl, setCrossLogoUrl] = useState('');
  const [defaultUrl, setDefaultUrl] = useState('');
  const [error, setError] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);
  let token = useFindTokenByAddress(addressProps);
  if (tokenProps) {
    token = tokenProps;
  }
  const address = addressProps || token?.address;
  const symbol = token?.symbol;
  const initial = symbol?.charAt(0).toUpperCase();
  const { getTokenLogoUrl } = useUserOptions();

  const logoUrl = useMemo(() => {
    const tokenUrl = token?.logoURI;
    const result = url || tokenUrl || '';
    if (getTokenLogoUrl) {
      return (
        getTokenLogoUrl({
          address,
          chainId,
          width,
          height,
          url: result,
        }) || result
      );
    }
    return result;
  }, [url, token, getTokenLogoUrl, address, chainId, width, height]);

  let logoOffset = logoOffsetProps;
  if (!logoOffset) {
    logoOffset = chainSize / 2 < 8 ? chainSize / 2 : chainSize - 8;
  }

  useEffect(() => {
    setError(false);
  }, [address, logoUrl]);

  useEffect(() => {
    if (!cross) return;
    if (!logoUrl) {
      setCrossLogoUrl('');
      return;
    }
    toDataURL(logoUrl, (result: React.SetStateAction<string>) => {
      setCrossLogoUrl(result);
    });
  }, [logoUrl, cross]);

  useEffect(() => {
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
      // address is empty
      console.error('generate Identicon error: ', err);
    }
  }, [address, width]);

  const chain = chainId ? chainListMap.get(chainId as ChainId) : null;
  const { onlyChainId } = useUserOptions();
  const showChain = !noShowChain && !!chain && !onlyChainId;

  const logo = (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height,
        borderRadius: '50%',
        ...(noBorder
          ? {}
          : {
              border: 'solid 1px',
              borderColor: 'border.main',
            }),
        flexShrink: 0,
        ...(showChain
          ? {}
          : {
              marginRight,
              zIndex,
              ...sx,
            }),
      }}
    >
      {!loaded && (
        <Box
          sx={{
            typography: 'ht',
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
        src={
          !(cross ? crossLogoUrl : logoUrl) || error
            ? defaultUrl
            : cross
            ? crossLogoUrl
            : logoUrl
        }
        onLoad={onLoad}
        onError={(e: any) => {
          const target = e.target as HTMLImageElement;
          if (address && defaultUrl) {
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

  if (!showChain) return logo;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: width + logoOffset,
        height,
        marginRight,
        zIndex,
        ...(sx || {}),
      }}
    >
      {logo}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          bottom: -1,
          width: chainSize,
          height: chainSize,
          border: 'solid 1px',
          borderColor: 'border.main',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <Box
          component={chain.logo}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    </Box>
  );
}
