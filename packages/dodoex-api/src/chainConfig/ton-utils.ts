import { ChainId } from './chain';

export const tonEndpointByChain: Record<
  ChainId.TON | ChainId.TON_TESTNET,
  string
> = {
  [ChainId.TON]: 'https://toncenter.com/api/v2/jsonRPC',
  [ChainId.TON_TESTNET]: 'https://testnet.toncenter.com/api/v2/jsonRPC',
};
