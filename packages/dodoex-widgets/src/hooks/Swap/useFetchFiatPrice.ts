import axios from 'axios';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../store/selectors/globals';
import { useEffect, useCallback, useState } from 'react';
import { FiatPriceAPI } from '../../constants/api';
import { getPlatformId } from '../../utils';
import { ChainId } from '../../constants/chains';
import { usePriceTimer } from './usePriceTimer';
import { TokenInfo } from '../Token';

export interface FetchFiatPriceProps {
  chainId: ChainId | undefined;
  fromToken: TokenInfo | null,
  toToken: TokenInfo | null,
}
export function useFetchFiatPrice({ fromToken, toToken, chainId }: FetchFiatPriceProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { apikey } = useSelector(getGlobalProps);
  const [fromFiatPrice, setFromFiatPrice] = useState<string>('');
  const [toFiatPrice, setToFiatPrice] = useState<string>('');

  const refetch = useCallback(() => {
    if (!chainId || !fromToken || !toToken) return;
    setLoading(true);
    const tokens = [fromToken, toToken];
    
    axios
      .post( // TODO: set timeout value!!
        `${FiatPriceAPI}/current/batch`,
        {
          networks: tokens.map(() => getPlatformId(chainId)),
          addresses: tokens.map((token) => token.address),
          symbols: tokens.map((token) => token.symbol),
          isCache: true,
        },
        {
          headers: { apikey }
        }
      )
      .then((res) => {
        setLoading(false);
        const fiatPriceInfo = res.data?.data;
        if (fiatPriceInfo) {
          setFromFiatPrice(fiatPriceInfo.find((info: any) => info.address === fromToken.address).price);
          setToFiatPrice(fiatPriceInfo.find((info: any) => info.address === toToken.address).price);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [chainId, fromToken, toToken, apikey])

  usePriceTimer({ refetch });

  return {
    loading,
    refetch,
    toFiatPrice,
    fromFiatPrice,
  };
}