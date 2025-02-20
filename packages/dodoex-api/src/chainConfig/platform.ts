import { ChainId } from './chain';

export const platformIdMap: {
  [key in ChainId]: string;
} = {
  [ChainId.SOON_TESTNET]: 'soon-testnet',
  [ChainId.SOON]: 'soon',
};
