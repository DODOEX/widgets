import { PoolApi } from '@dodoex/api';
import { ChainId } from '../../constants/chains';
import { TokenInfo } from '../../hooks/Token';

export const poolApi = new PoolApi();

export function convertLiquidityTokenToTokenInfo(
  token:
    | {
        id: string;
        symbol: string;
        name: string;
        decimals: number;
        usdPrice: number;
        logoImg?: string | null;
      }
    | undefined,
  chainId: ChainId | number,
) {
  if (!token) return token;
  return {
    chainId: chainId,
    address: token.id,
    name: token.name,
    decimals: token.decimals,
    symbol: token.symbol,
    logoURI: token.logoImg ?? '',
  } as TokenInfo;
}
