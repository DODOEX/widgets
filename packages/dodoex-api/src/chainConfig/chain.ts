export enum ChainId {
  // svm
  SOON_TESTNET = 903,
  SOON = 9031,
}

export enum chainIdShortNameEnum {
  SOON_TESTNET = 'soon-testnet',
  SOON = 'soon',
}

export const chainIdToShortName = {
  [ChainId.SOON_TESTNET]: chainIdShortNameEnum.SOON_TESTNET,
  [ChainId.SOON]: chainIdShortNameEnum.SOON,
};
