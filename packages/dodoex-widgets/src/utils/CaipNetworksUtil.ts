import { AppKitNetworkExtend, type CaipNetworkExtend } from './reown-types';

export const CaipNetworksUtil = {
  isCaipNetwork(network: AppKitNetworkExtend): network is CaipNetworkExtend {
    return 'chainNamespace' in network && 'caipNetworkId' in network;
  },

  getChainNamespace(network: AppKitNetworkExtend) {
    if (this.isCaipNetwork(network)) {
      return network.chainNamespace;
    }

    return 'eip155';
  },
};
