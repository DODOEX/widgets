import { GraphQLRequests } from '@dodoex/api';
import { createContext, useContext } from 'react';
import { TokenInfo } from '../hooks/Token';

export interface GlobalFunctionConfig {
  widgetRef?: React.RefObject<HTMLDivElement>;
  /** If true is returned, the default wallet connection logic will not be executed */
  onConnectWalletClick?: () => boolean | Promise<boolean>;
  /** When the token balance is insufficient, users can purchase or swap callbacks */
  gotoBuyToken?: (params: { token: TokenInfo; account: string }) => void;
  getTokenLogoUrl?: (params: {
    address?: string;
    width?: number;
    height?: number;
    url?: string;
    chainId?: number;
  }) => string;
  graphQLRequests?: GraphQLRequests;
}

export const graphQLRequests = new GraphQLRequests();

// Passing widget config
export const GlobalConfigContext = createContext<
  Omit<GlobalFunctionConfig, 'graphQLRequests'> & {
    graphQLRequests: GraphQLRequests;
  }
>({
  onConnectWalletClick: undefined,
  gotoBuyToken: undefined,
  getTokenLogoUrl: undefined,
  graphQLRequests,
});

export const useGlobalConfig = () => {
  return useContext(GlobalConfigContext);
};
