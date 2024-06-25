import axios from 'axios';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../store/selectors/globals';
import { useCallback, useState } from 'react';
import { getPlatformId } from '../../utils';
import { usePriceTimer } from './usePriceTimer';
import { TokenInfo } from '../Token';
import { useGetAPIService } from '../setting/useGetAPIService';
import { APIServiceKey } from '../../constants/api';

export interface FetchFiatPriceProps {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
}
export function useFetchFiatPrice({ fromToken, toToken }: FetchFiatPriceProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { apikey } = useSelector(getGlobalProps);
  const [fromFiatPrice, setFromFiatPrice] = useState<string>('');
  const [toFiatPrice, setToFiatPrice] = useState<string>('');
  const fiatPriceAPI = useGetAPIService(APIServiceKey.fiatPrice);

  const refetch = useCallback(() => {
    if (!fromToken || !toToken) return;
    setLoading(true);
    setError(null);
    const tokens = [fromToken, toToken];

    axios
      .post(
        // TODO: set timeout value!!
        fiatPriceAPI,
        {
          networks: tokens.map((token) => getPlatformId(token.chainId)),
          addresses: tokens.map((token) => token.address),
          symbols: tokens.map((token) => token.symbol),
          isCache: true,
        },
        apikey
          ? {
              headers: { apikey },
            }
          : undefined,
      )
      .then((res) => {
        setLoading(false);
        const fiatPriceInfo = res.data?.data;
        if (fiatPriceInfo) {
          setFromFiatPrice(
            fiatPriceInfo.find(
              (info: any) => info.address === fromToken.address,
            ).price,
          );
          setToFiatPrice(
            fiatPriceInfo.find((info: any) => info.address === toToken.address)
              .price,
          );
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        console.error(error);
      });
  }, [fromToken, toToken, apikey, fiatPriceAPI]);

  usePriceTimer({ refetch });

  return {
    loading,
    isLoading: loading,
    refetch,
    error,
    toFiatPrice,
    fromFiatPrice,
  };
}
